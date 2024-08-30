import { BucketFileSystem } from "@miyauci/fs/node";
import { FileDialog } from "@miyauci/rfd/node";
import { Map } from "@miyauci/infra";
import { join, parse } from "node:path";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import type { FileSystemEntry, FileSystemPath } from "@miyauci/fs";
import type {
  FileLocation,
  OpenDirectoryPicker,
  OpenFileDialog,
  OpenFileDialogOptions,
  OpenSaveFilePickerOptions,
  Options,
  UserAgent as IUserAgent,
  WellKnownDirectoryMap as IWellKnownDirectoryMap,
} from "../implementation_defined.ts";

export class UserAgent implements IUserAgent {
  openFileDialog: OpenFileDialog = openFileDialog;
  openDirectoryDialog: OpenDirectoryPicker = openDirectoryDialog;

  locateEntry(root: string, path: FileSystemPath): FileSystemEntry | null {
    const fs = new BucketFileSystem(root);

    return fs.locateEntry(path);
  }
  openSaveFileDialog = openSaveFileDialog;
  wellKnownDirectories: IWellKnownDirectoryMap = new WellKnownDirectoryMap();
  recentlyPickedDirectoryMap: Map<unknown, Map<string, string>> = new Map();
  defaultPath: string = "";
}

class WellKnownDirectoryMap implements IWellKnownDirectoryMap {
  get desktop() {
    return join(homedir(), "Desktop");
  }

  get documents() {
    return join(homedir(), "Documents");
  }

  get downloads() {
    return join(homedir(), "Downloads");
  }

  get music() {
    return join(homedir(), "Music");
  }

  get pictures() {
    return join(homedir(), "Pictures");
  }

  get videos() {
    return join(homedir(), "Videos");
  }
}

export function openFileDialog(
  options: OpenFileDialogOptions,
): FileLocation[] | null {
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

export function openSaveFileDialog(
  options: OpenSaveFilePickerOptions,
): FileLocation | null {
  const fileDialog = new FileDialog();

  if (options.startingDirectory) {
    fileDialog.setDirectory(options.startingDirectory);
  }

  if (options?.suggestedName) {
    fileDialog.setFileName(options.suggestedName);
  }

  for (const [description, exts] of options.acceptsOptions) {
    const extsWithoutDot = exts.map((ext) =>
      ext.startsWith(".") ? ext.slice(1) : ext
    );

    fileDialog.addFilter(description, extsWithoutDot);
  }

  const path = fileDialog.saveFile();

  if (!path) return null;

  writeFileSync(path, new Uint8Array());

  return toLoc(path);
}

function toLoc(path: string): FileLocation {
  const { base: name, dir: root } = parse(path);

  return { name, root };
}

export function openDirectoryDialog(
  options: Options,
): FileLocation | null {
  const fileDialog = new FileDialog();

  if (options.startingDirectory) {
    fileDialog.setDirectory(options.startingDirectory);
  }

  const fullPath = fileDialog.pickFolder();

  if (!fullPath) return null;

  return toLoc(fullPath);
}
