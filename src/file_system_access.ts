import type {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "@miyauci/fs";
import type {
  Environment,
  Environment as _Environment,
  UserAgent,
} from "./implementation_defined.ts";
import { createShowOpenFilePicker } from "./show_open_file_picker.ts";
import type {
  DirectoryPickerOptions,
  OpenFilePickerOptions,
  SaveFilePickerOptions,
} from "./type.ts";
import { createShowDirectoryPicker } from "./show_directory_picker.ts";
import { createShowSaveFilePicker } from "./show_save_file_picker.ts";

export function createFileSystemAccess(userAgent: UserAgent): FileSystemAccess {
  const environment = { userAgent, origin: {} } satisfies Environment;

  return {
    showDirectoryPicker: createShowDirectoryPicker(environment),
    showSaveFilePicker: createShowSaveFilePicker(environment),
    showOpenFilePicker: createShowOpenFilePicker(environment),
  };
}

export interface FileSystemAccess {
  /** Shows a file picker that lets a user select a single existing file, returning a handle for the selected file.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showopenfilepicker)
   */
  showOpenFilePicker(
    options?: OpenFilePickerOptions,
  ): Promise<FileSystemFileHandle[]>;

  /** Shows a directory picker that lets the user select a single directory, returning a handle for the selected directory if the user grants read permission.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showdirectorypicker)
   */
  showDirectoryPicker(
    options?: DirectoryPickerOptions,
  ): Promise<FileSystemDirectoryHandle>;

  /** Shows a file picker that lets a user select a single file, returning a handle for the selected file.
   *
   * The selected file does not have to exist already. If the selected file does not exist a new empty file is created before this method returns, otherwise the existing file is cleared before this method returned.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showsavefilepicker)
   */
  showSaveFilePicker(
    options?: SaveFilePickerOptions,
  ): Promise<FileSystemFileHandle>;
}
