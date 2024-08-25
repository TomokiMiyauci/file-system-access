import type {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "@miyauci/fs";
import type { Adaptor } from "./type.ts";
import { createShowOpenFilePicker } from "./show_open_file_picker.ts";
import type { DirectoryPickerOptions, OpenFilePickerOptions } from "./type.ts";
import { createShowDirectoryPicker } from "./show_directory_picker.ts";
import { createShowSaveFilePicker } from "./show_save_file_picker.ts";

export class FileSystemAccess {
  constructor(adaptor: Adaptor) {
    this.showOpenFilePicker = createShowOpenFilePicker(
      adaptor.locateEntry,
      adaptor.openFileDialog.bind(adaptor),
    );

    this.showDirectoryPicker = createShowDirectoryPicker(
      adaptor.locateEntry,
      adaptor.openDirectoryDialog.bind(adaptor),
    );

    this.showSaveFilePicker = createShowSaveFilePicker(
      adaptor.locateEntry,
      adaptor.openSaveFileDialog.bind(adaptor),
    );
  }

  showOpenFilePicker: (
    options?: OpenFilePickerOptions,
  ) => Promise<FileSystemFileHandle[]>;

  showDirectoryPicker: (
    options?: DirectoryPickerOptions,
  ) => Promise<FileSystemDirectoryHandle>;

  showSaveFilePicker: () => Promise<FileSystemFileHandle>;
}
