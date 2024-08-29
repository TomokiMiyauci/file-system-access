import { BucketFileSystem } from "@miyauci/fs/deno";
import { FileDialog } from "@miyauci/rfd/deno";
import { parse } from "@std/path/parse";
import type {
  Adaptor,
  FileLocation,
  OpenDirectoryPicker,
  OpenFileDialog,
  OpenFileDialogOptions,
  OpenSaveFilePickerOptions,
  Options,
} from "../implementation_defined.ts";

export class DenoAdaptor implements Adaptor {
  openFileDialog: OpenFileDialog = openFileDialog;
  openDirectoryDialog: OpenDirectoryPicker = openDirectoryDialog;

  locateEntry = BucketFileSystem.prototype.locateEntry;
  openSaveFileDialog = openSaveFileDialog;
}

export function openFileDialog(
  options: OpenFileDialogOptions,
): FileLocation[] | null {
  using fileDialog = new FileDialog();

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
  using fileDialog = new FileDialog();

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

  Deno.writeFileSync(path, new Uint8Array());

  return toLoc(path);
}

function toLoc(path: string): FileLocation {
  const { base: name, dir: root } = parse(path);

  return { name, root };
}

export function openDirectoryDialog(
  options: Options,
): FileLocation | null {
  using fileDialog = new FileDialog();

  if (options.startingDirectory) {
    fileDialog.setDirectory(options.startingDirectory);
  }

  const fullPath = fileDialog.pickDirectory();

  if (!fullPath) return null;

  return toLoc(fullPath);
}
