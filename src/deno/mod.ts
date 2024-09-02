import type {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "@miyauci/fs";
import type {
  DirectoryPickerOptions,
  OpenFilePickerOptions,
  SaveFilePickerOptions,
} from "@miyauci/file-system-access";
import { UserAgent } from "./user_agent.ts";
import { showOpenFilePickerWith } from "../show_open_file_picker.ts";
import { showDirectoryPickerWith } from "../show_directory_picker.ts";
import { showSaveFilePickerWith } from "../show_save_file_picker.ts";
import type { Environment } from "../implementation_defined.ts";

const environment = {
  origin: {},
  userAgent: new UserAgent(),
} satisfies Environment;

/** Shows a file picker that lets a user select a single existing file, returning a handle for the selected file. */
export function showOpenFilePicker(
  options?: OpenFilePickerOptions & { multiple?: false },
): Promise<[FileSystemFileHandle]>;
/** Shows a file picker that lets a user select multiple existing files, returning handles for the selected files. */
export function showOpenFilePicker(
  options?: OpenFilePickerOptions & { multiple?: true },
): Promise<FileSystemFileHandle[]>;
export function showOpenFilePicker(
  options?: OpenFilePickerOptions,
): Promise<FileSystemFileHandle[]> {
  return showOpenFilePickerWith(environment, options);
}

export function showDirectoryPicker(
  options?: DirectoryPickerOptions,
): Promise<FileSystemDirectoryHandle> {
  return showDirectoryPickerWith(environment, options);
}

export function showSaveFilePicker(
  options?: SaveFilePickerOptions,
): Promise<FileSystemFileHandle> {
  return showSaveFilePickerWith(environment, options);
}
