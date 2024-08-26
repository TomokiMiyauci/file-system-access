import type {
  FileLocation,
  OpenFileDialogOptions,
  OpenSaveFilePickerOptions,
  Options,
} from "../implementation_defined.ts";
import { Dialog } from "./generated.ts";
import { parse } from "@std/path";

type Result<T> = Success<T> | Failure;

interface Success<T> {
  success: true;
  data: T;
}

interface Failure {
  success: false;
}

class FileDialog {
  constructor(private dialog: Dialog) {}

  pickFile(): string {
    const ptr = this.dialog.pick_file();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const fullPath = ptrView.getCString();
    const json = JSON.parse(fullPath) as Result<string>;

    if (json.success) return json.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  pickFiles(): string[] {
    const ptr = this.dialog.pick_files();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const jsonStr = ptrView.getCString();
    const result = JSON.parse(jsonStr) as Result<string[]>;

    if (result.success) return result.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  pickDirectory(): string {
    const ptr = this.dialog.pick_directory();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const jsonStr = ptrView.getCString();
    const result = JSON.parse(jsonStr) as Result<string>;

    if (result.success) return result.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  saveFile() {
    const ptr = this.dialog.save_file();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const jsonStr = ptrView.getCString();
    const result = JSON.parse(jsonStr) as Result<string>;

    if (result.success) return result.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  addFilter(_: string, extensions: string[]): FileDialog {
    // const decode = new TextEncoder().encode(description);
    const extensionsStr = JSON.stringify(extensions);
    const ext = new TextEncoder().encode(extensionsStr);

    const dialog = this.dialog.add_filter(ext);

    return new FileDialog(dialog);
  }

  setDirectory(path: string): FileDialog {
    const u8 = new TextEncoder().encode(path);

    const dialog = this.dialog.set_directory(u8);

    return new FileDialog(dialog);
  }

  setFileName(fileName: string): FileDialog {
    const u8 = new TextEncoder().encode(fileName);

    const dialog = this.dialog.set_file_name(u8);

    return new FileDialog(dialog);
  }
}

export function openFileDialog(
  options: OpenFileDialogOptions,
): FileLocation[] {
  using dialog = new Dialog();
  let fileDialog = new FileDialog(dialog);

  if (options.startingDirectory) {
    fileDialog = fileDialog.setDirectory(options.startingDirectory);
  }

  // const types = options?.types ?? [];
  // const allExts = types.flatMap(getAllExts);
  // const exts = allExts.map((ext) => ext.slice(1));

  // fileDialog = fileDialog.addFilter("<unknown>", exts);

  if (options?.multiple) {
    const paths = fileDialog.pickFiles();

    return paths.map(toLoc);
  }

  const fullPath = fileDialog.pickFile();

  return [toLoc(fullPath)];
}

export function openSaveFileDialog(
  options: OpenSaveFilePickerOptions,
): FileLocation {
  using dialog = new Dialog();
  let fileDialog = new FileDialog(dialog);

  if (options.startingDirectory) {
    fileDialog = fileDialog.setDirectory(options.startingDirectory);
  }

  if (options?.suggestedName) {
    fileDialog = fileDialog.setFileName(options.suggestedName);
  }

  const path = fileDialog.saveFile();

  Deno.writeFileSync(path, new Uint8Array());

  return toLoc(path);
}

// function getAllExts(accept: FilePickerAcceptType): string[] {
//   return Object.values(accept.accept).flatMap((value) => value);
// }

function toLoc(path: string): FileLocation {
  const { base: name, dir: root } = parse(path);

  return { name, root };
}

export function openDirectoryDialog(
  options: Options,
): FileLocation {
  using dialog = new Dialog();
  let fileDialog = new FileDialog(dialog);

  if (options.startingDirectory) {
    fileDialog = fileDialog.setDirectory(options.startingDirectory);
  }

  const fullPath = fileDialog.pickDirectory();

  return toLoc(fullPath);
}
