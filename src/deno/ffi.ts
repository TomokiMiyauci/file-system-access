/// <reference lib="deno.unstable" />

import {
  DirectoryPickerOptions,
  FilePickerAcceptType,
  OpenFilePickerOptions,
  StartInDirectory,
} from "../type.ts";
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
    const fullPath = ptrView.getCString();

    return fullPath;
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
}

export function openFileDialog(
  options?: OpenFilePickerOptions,
): { root: string; name: string }[] {
  using dialog = new Dialog();
  let fileDialog = new FileDialog(dialog);

  const types = options?.types ?? [];
  const allExts = types.flatMap(getAllExts);
  const exts = allExts.map((ext) => ext.slice(1));

  fileDialog = fileDialog.addFilter("<unknown>", exts);

  if (options?.multiple) {
    const paths = fileDialog.pickFiles();
    console.log(paths);

    return paths.map(to);
  }

  const fullPath = fileDialog.pickFile();

  return [to(fullPath)];
}

function getAllExts(accept: FilePickerAcceptType): string[] {
  return Object.values(accept.accept).flatMap((value) => value);
}

function to(path: string): { root: string; name: string } {
  const { base: name, dir: root } = parse(path);

  return { name, root };
}

export function openDirectoryDialog(options?: DirectoryPickerOptions): {
  root: string;
} {
  const startIn = options?.startIn ? normalize(options.startIn) : null;

  using dialog = new Dialog();
  const fileDialog = new FileDialog(dialog);

  if (typeof startIn === "string") {
    const fullPath = fileDialog.setDirectory(startIn).pickDirectory();

    return { root: fullPath };
  }

  const fullPath = fileDialog.pickDirectory();

  return { root: fullPath };
}

function normalize(startIn: StartInDirectory): string {
  if (typeof startIn === "string") {
    throw new Error("unsupported");
  }

  throw new Error("unsupported");
}
