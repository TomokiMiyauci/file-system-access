import {
  AccessMode,
  FileEntry,
  FileLocator,
  FileSystemAccessResult,
  FileSystemEntry,
  FileSystemLocator,
  IO,
  UnderlyingFileSystem,
} from "@miyauci/file-system";
import { join } from "@std/path/join";
import { isDirectoryEntry } from "@miyauci/file-system";
import { readdirSync, statSync } from "node:fs";
import { openDirectoryDialog, openFileDialog } from "./ffi.ts";
import type { Adaptor, OpenDirectoryPicker, OpenFileDialog } from "../type.ts";

export class DenoAdaptor implements Adaptor {
  io: IO = new DenoIO();

  openFileDialog: OpenFileDialog = openFileDialog;
  openDirectoryDialog: OpenDirectoryPicker = openDirectoryDialog;

  fs: UnderlyingFileSystem = new DenoFs();
}

class DenoFs implements UnderlyingFileSystem {
  create(entry: FileSystemEntry, locator: FileSystemLocator): void {
    const fullPath = join(locator.root, ...locator.path, entry.name);

    if (isDirectoryEntry(entry)) {
      Deno.mkdirSync(fullPath);
    } else {
      const file = Deno.openSync(fullPath, { createNew: true, write: true });

      file.writeSync(entry.binaryData);
      file.utimeSync(entry.modificationTimestamp, entry.modificationTimestamp);

      file.close();
    }
  }

  remove(entry: FileSystemEntry, locator: FileSystemLocator): void {
    const fullPath = join(locator.root, ...locator.path.slice(1), entry.name);

    Deno.remove(fullPath, { recursive: true });
  }

  stream(
    entry: FileEntry,
    locator: FileSystemLocator,
  ): ReadableStream<Uint8Array> {
    const fullPath = join(locator.root, ...locator.path);

    return new ReadableStream({
      async start(controller) {
        using file = await Deno.open(fullPath, { read: true });

        await file.read(entry.binaryData);

        controller.enqueue(entry.binaryData);
        controller.close();
      },
    });
  }

  write(locator: FileLocator, data: Uint8Array): void {
    const fullPath = join(locator.root, ...locator.path);

    Deno.writeFile(fullPath, data);
  }
}

export class DenoIO implements IO {
  time: number = Date.now();
  async queryAccess(
    locator: FileLocator,
    mode: AccessMode,
  ): Promise<FileSystemAccessResult> {
    const path = join(locator.root, ...locator.path);

    switch (mode) {
      case "read": {
        const status = await Deno.permissions.request({ name: "read", path });

        return { permissionState: status.state, errorName: "" };
      }

      case "readwrite": {
        const readStatus = await Deno.permissions.request({
          name: "read",
          path,
        });

        if (readStatus.state !== "granted") {
          return {
            permissionState: readStatus.state,
            errorName: "NotAllowedError",
          };
        }

        const writeStatus = await Deno.permissions.request({
          name: "write",
          path,
        });

        if (writeStatus.state !== "granted") {
          return {
            permissionState: writeStatus.state,
            errorName: "NotAllowedError",
          };
        }

        return {
          permissionState: "granted",
          errorName: "",
        };
      }
    }
  }

  async requestAccess(
    locator: FileLocator,
    mode: AccessMode,
  ): Promise<FileSystemAccessResult> {
    const path = join(locator.root, ...locator.path);

    switch (mode) {
      case "read": {
        const status = await Deno.permissions.request({ name: "read", path });

        return { permissionState: status.state, errorName: "" };
      }

      case "readwrite": {
        const readStatus = await Deno.permissions.request({
          name: "read",
          path,
        });

        if (readStatus.state !== "granted") {
          return {
            permissionState: readStatus.state,
            errorName: "NotAllowedError",
          };
        }

        const writeStatus = await Deno.permissions.request({
          name: "write",
          path,
        });

        if (writeStatus.state !== "granted") {
          return {
            permissionState: writeStatus.state,
            errorName: "NotAllowedError",
          };
        }

        return {
          permissionState: "granted",
          errorName: "",
        };
      }
    }
  }

  children(locator: FileSystemLocator): FileSystemLocator[] {
    const path = join(locator.root, ...locator.path);

    const dir = readdirSync(path, { withFileTypes: true });

    return dir.map<FileSystemLocator>((entry) => {
      const path = locator.path.concat(entry.name);

      if (entry.isDirectory()) {
        return { kind: "directory", root: locator.root, path };
      }

      if (entry.isFile()) {
        return { kind: "file", root: locator.root, path };
      }

      throw new Error();
    });
  }

  modificationTimestamp(locator: FileSystemLocator): number {
    const path = join(locator.root, ...locator.path);
    const file = statSync(path);

    return file.mtime?.getTime() ?? this.time;
  }

  binaryData(locator: FileSystemLocator): Uint8Array {
    const path = join(locator.root, ...locator.path);
    const file = statSync(path);

    return new Uint8Array(file.size);
  }
}
