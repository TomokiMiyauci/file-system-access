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

/** Shows a file picker that lets a user select a single existing file, returning a handle for the selected file.
 *
 * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showopenfilepicker)
 */
export function showOpenFilePicker(
  options?: OpenFilePickerOptions & { multiple?: false },
): Promise<[FileSystemFileHandle]>;
/** Shows a file picker that lets a user select multiple existing files, returning handles for the selected files.
 *
 * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showopenfilepicker)
 */
export function showOpenFilePicker(
  options?: OpenFilePickerOptions & { multiple?: true },
): Promise<FileSystemFileHandle[]>;
export function showOpenFilePicker(
  options?: OpenFilePickerOptions,
): Promise<FileSystemFileHandle[]> {
  return showOpenFilePickerWith(environment, options);
}

/** Shows a directory picker that lets the user select a single directory, returning a handle for the selected directory if the user grants read permission.
 *
 * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showdirectorypicker)
 */
export function showDirectoryPicker(
  options?: DirectoryPickerOptions,
): Promise<FileSystemDirectoryHandle> {
  return showDirectoryPickerWith(environment, options);
}

/** Shows a file picker that lets a user select a single file, returning a handle for the selected file.
 *
 * The selected file does not have to exist already. If the selected file does not exist a new empty file is created before this method returns, otherwise the existing file is cleared before this method returned.
 *
 * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showsavefilepicker)
 */
export function showSaveFilePicker(
  options?: SaveFilePickerOptions,
): Promise<FileSystemFileHandle> {
  return showSaveFilePickerWith(environment, options);
}
