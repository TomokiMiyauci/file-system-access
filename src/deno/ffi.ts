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
  #dialog: Dialog = new Dialog();

  pickFile(): string {
    const ptr = this.#dialog.pick_file();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const fullPath = ptrView.getCString();
    const json = JSON.parse(fullPath) as Result<string>;

    if (json.success) return json.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  pickFiles(): string[] {
    const ptr = this.#dialog.pick_files();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const jsonStr = ptrView.getCString();
    const result = JSON.parse(jsonStr) as Result<string[]>;

    if (result.success) return result.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  pickDirectory(): string {
    const ptr = this.#dialog.pick_directory();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const jsonStr = ptrView.getCString();
    const result = JSON.parse(jsonStr) as Result<string>;

    if (result.success) return result.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  saveFile(): string {
    const ptr = this.#dialog.save_file();
    const ptrView = new Deno.UnsafePointerView(ptr!);
    const jsonStr = ptrView.getCString();
    const result = JSON.parse(jsonStr) as Result<string>;

    if (result.success) return result.data;

    throw new DOMException("The user aborted a request.", "AbortError");
  }

  addFilter(_: string, extensions: string[]): void {
    const extensionsStr = JSON.stringify(extensions);
    const ext = new TextEncoder().encode(extensionsStr);
    const dialog = this.#dialog.add_filter(ext);

    this.#update(dialog);
  }

  setDirectory(path: string): void {
    const u8 = new TextEncoder().encode(path);
    const dialog = this.#dialog.set_directory(u8);

    this.#update(dialog);
  }

  setFileName(fileName: string): void {
    const u8 = new TextEncoder().encode(fileName);
    const dialog = this.#dialog.set_file_name(u8);

    this.#update(dialog);
  }

  #release(): void {
    this.#dialog[Symbol.dispose]();
  }

  #update(dialog: Dialog): void {
    this.#release();

    this.#dialog = dialog;
  }

  [Symbol.dispose](): void {
    this.#release();
  }
}

export function openFileDialog(
  options: OpenFileDialogOptions,
): FileLocation[] {
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

    return paths.map(toLoc);
  }

  const fullPath = fileDialog.pickFile();

  return [toLoc(fullPath)];
}

export function openSaveFileDialog(
  options: OpenSaveFilePickerOptions,
): FileLocation {
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

  Deno.writeFileSync(path, new Uint8Array());

  return toLoc(path);
}

function toLoc(path: string): FileLocation {
  const { base: name, dir: root } = parse(path);

  return { name, root };
}

export function openDirectoryDialog(
  options: Options,
): FileLocation {
  const fileDialog = new FileDialog();

  if (options.startingDirectory) {
    fileDialog.setDirectory(options.startingDirectory);
  }

  const fullPath = fileDialog.pickDirectory();

  return toLoc(fullPath);
}
