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
