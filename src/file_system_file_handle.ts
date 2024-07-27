import { FileSystemHandle } from "./file_system_handle.ts";
import {
  FileEntry,
  FileSystemEntry,
  FileSystemLocator,
  IO,
  UnderlyingFileSystem,
} from "./type.ts";
import { locateEntry, takeLock } from "./algorithm.ts";
import { createFileSystemWritableFileStream } from "./file_system_writable_file_stream.ts";
import { buffer, locator } from "./symbol.ts";
import { extname } from "@std/path";
import { typeByExtension } from "@std/media-types";

export class FileSystemFileHandle extends FileSystemHandle
  implements globalThis.FileSystemFileHandle {
  override get kind(): "file" {
    return "file";
  }

  getFile(): Promise<File> {
    // 1. Let result be a new promise.
    const { reject, promise, resolve } = Promise.withResolvers<File>();

    // 2. Let locator be this's locator.
    const fsLocator = this[locator];

    // 3. Let global be this's relevant global object.

    // 4. Enqueue the following steps to the file system queue:
    queueMicrotask(() => {
      // 1. Let entry be the result of locating an entry given locator.
      const entry = locateEntry(fsLocator, this.io);

      // 2. Let accessResult be the result of running entry’s query access given "read".
      const accessResult = entry?.queryAccess("read");

      // 3. Queue a storage task with global to run these steps:

      // 1. If accessResult’s permission state is not "granted", reject result with a DOMException of accessResult’s error name and abort these steps.
      if (accessResult && accessResult.permissionState !== "granted") {
        return reject(new DOMException(accessResult.errorName));
      }

      // 2. If entry is null, reject result with a "NotFoundError" DOMException and abort these steps.
      if (entry === null) return reject(new DOMException("NotFoundError"));

      // 3. Assert: entry is a file entry.
      assertFileEntry(entry);

      // 4. Let f be a new File.
      // 5. Set f’s snapshot state to the current state of entry.
      // 6. Set f’s underlying byte sequence to a copy of entry’s binary data.
      // 7. Set f’s name to entry’s name.
      // 8. Set f’s lastModified to entry’s modification timestamp.
      // 9. Set f’s type to an implementation-defined value, based on for example entry’s name or its file extension.
      const blob = new BlobDataItem({
        locator: fsLocator,
        lastModified: entry.modificationTimestamp,
        entry,
        fs: this.fs,
        io: this.io,
      });

      const type = typeByExtension(extname(entry.name));

      const file = new File([blob], entry.name, {
        lastModified: entry.modificationTimestamp,
        type,
      });

      // 10. Resolve result with f.
      resolve(file);
    });

    // 5. Return result.

    return promise;
  }

  createWritable(
    options?: FileSystemCreateWritableOptions,
  ): Promise<FileSystemWritableFileStream> {
    // 1. Let result be a new promise.
    const { promise, reject, resolve } = Promise.withResolvers<
      FileSystemWritableFileStream
    >();

    // 2. Let locator be this's locator.
    const fsLocator = this[locator];

    // 3. Let realm be this's relevant Realm.

    // 4. Let global be this's relevant global object.

    // 5. Enqueue the following steps to the file system queue:
    queueMicrotask(() => {
      // 1. Let entry be the result of locating an entry given locator.
      const entry = locateEntry(fsLocator, this.io);

      // 2. Let accessResult be the result of running entry’s request access given "readwrite".
      const accessResult = entry?.requestAccess("readwrite");

      // 3. If accessResult’s permission state is not "granted", queue a storage task with global to reject result with a DOMException of accessResult’s error name and abort these steps.
      if (accessResult && accessResult.permissionState !== "granted") {
        return reject(new DOMException(accessResult.errorName));
      }

      // 4. If entry is null, queue a storage task with global to reject result with a "NotFoundError" DOMException and abort these steps.
      if (entry === null) return reject(new DOMException("NotFoundError"));

      // 5. Assert: entry is a file entry.
      assertFileEntry(entry);

      // 6. Let lockResult be the result of taking a lock with "shared" on entry.
      const lockResult = takeLock("shared", entry);

      // 7. Queue a storage task with global to run these steps:

      // 1. If lockResult is "failure", reject result with a "NoModificationAllowedError" DOMException and abort these steps.
      if (lockResult === "failure") {
        return reject(new DOMException("NoModificationAllowedError"));
      }

      // 2. Let stream be the result of creating a new FileSystemWritableFileStream for entry in realm.
      const stream = createFileSystemWritableFileStream(entry);

      // 3. If options["keepExistingData"] is true:
      if (options?.keepExistingData) {
        // 1. Set stream’s [[buffer]] to a copy of entry’s binary data.
        stream[buffer] = entry.binaryData.slice(0);
      }

      // 4. Resolve result with stream.
      return resolve(stream);
    });

    // 6. Return result.
    return promise;
  }
}

function assertFileEntry(_: FileSystemEntry): asserts _ is FileEntry {}

interface BlobDataItemOptions {
  lastModified: number;
  locator: FileSystemLocator;
  entry: FileEntry;
  fs: UnderlyingFileSystem;
  io: IO;
}

class BlobDataItem extends Blob {
  lastModified: number;
  locator: FileSystemLocator;
  entry: FileEntry;
  fs: UnderlyingFileSystem;
  io: IO;

  constructor(options: BlobDataItemOptions) {
    super([options.entry.binaryData]);

    this.lastModified = options.lastModified;
    this.locator = options.locator;
    this.entry = options.entry;
    this.fs = options.fs;
    this.io = options.io;
  }

  slice(start: number = 0, end?: number): Blob {
    const binaryData = this.entry.binaryData.slice(start, end);

    return new BlobDataItem({
      lastModified: this.lastModified,
      locator: this.locator,
      entry: { ...this.entry, binaryData },
      fs: this.fs,
      io: this.io,
    });
  }

  stream(): ReadableStream<Uint8Array> {
    const timestamp = this.io.modificationTimestamp(this.locator);

    if (timestamp > this.lastModified) {
      throw new DOMException(
        "The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.",
        "NotReadableError",
      );
    }

    return this.fs.stream(this.entry, this.locator);
  }
}
