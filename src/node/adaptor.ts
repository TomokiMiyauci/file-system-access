import { BucketFileSystem } from "@miyauci/fs/node";
import { FileDialog } from "@miyauci/rfd/node";
import { Map } from "@miyauci/infra";
import { join, parse } from "node:path";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import type { FileSystemEntry, FileSystemPath } from "@miyauci/fs";
import type {
  FileLocation,
  OpenFileDialogOptions,
  OpenSaveFilePickerOptions,
  Options,
  UserAgent as IUserAgent,
  WellKnownDirectoryMap as IWellKnownDirectoryMap,
} from "../implementation_defined.ts";

export class UserAgent implements IUserAgent {
  openFileDialog(options: OpenFileDialogOptions): FileLocation[] | null {
    const fileDialog = new FileDialog();

    if (options.startingDirectory) {
      fileDialog.setDirectory(options.startingDirectory);
    }

    for (const [description, exts] of options.acceptsOptions) {
      const extsWithoutDot = exts.map((ext) =>
        ext.startsWith(".") ? ext.slice(1) : ext
      );

      fileDialog.addFilter(description, extsWithoutDot);
    }

    if (options?.multiple) {
      const paths = fileDialog.pickFiles();

      if (!paths) return null;

      return paths.map(toLoc);
    }

    const fullPath = fileDialog.pickFile();

    if (!fullPath) return null;

    return [toLoc(fullPath)];
  }
  openDirectoryDialog(options: Options): FileLocation | null {
    const fileDialog = new FileDialog();

    if (options.startingDirectory) {
      fileDialog.setDirectory(options.startingDirectory);
    }

    const fullPath = fileDialog.pickFolder();

    if (!fullPath) return null;

    return toLoc(fullPath);
  }

  openSaveFileDialog(options: OpenSaveFilePickerOptions): FileLocation | null {
    const dialog = new FileDialog();

    if (options.startingDirectory) {
      dialog.setDirectory(options.startingDirectory);
    }

    if (options?.suggestedName) dialog.setFileName(options.suggestedName);

    for (const [description, exts] of options.acceptsOptions) {
      const extsWithoutDot = exts.map((ext) =>
        ext.startsWith(".") ? ext.slice(1) : ext
      );

      dialog.addFilter(description, extsWithoutDot);
    }

    const path = dialog.saveFile();

    if (!path) return null;

    writeFileSync(path, new Uint8Array());

    return toLoc(path);
  }

  locateEntry(root: string, path: FileSystemPath): FileSystemEntry | null {
    const fs = new BucketFileSystem(root);

    return fs.locateEntry(path);
  }
  wellKnownDirectories: IWellKnownDirectoryMap = new WellKnownDirectoryMap();
  recentlyPickedDirectoryMap: Map<unknown, Map<string, string>> = new Map();
  defaultPath: string = "";
}

class WellKnownDirectoryMap implements IWellKnownDirectoryMap {
  get #home(): string {
    return homedir();
  }

  get desktop(): string {
    return join(this.#home, "Desktop");
  }

  get documents(): string {
    return join(this.#home, "Documents");
  }

  get downloads(): string {
    return join(this.#home, "Downloads");
  }

  get music(): string {
    return join(this.#home, "Music");
  }

  get pictures(): string {
    return join(this.#home, "Pictures");
  }

  get videos(): string {
    return join(this.#home, "Videos");
  }
}

function toLoc(path: string): FileLocation {
  const { base: name, dir: root } = parse(path);

  return { name, root };
}
