import type {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "@miyauci/fs";
import type { Adaptor } from "./type.ts";
import { crateShowOpenFilePicker } from "./show_open_file_picker.ts";
import type { DirectoryPickerOptions, OpenFilePickerOptions } from "./type.ts";
import { createShowDirectoryPicker } from "./show_directory_picker.ts";

export class FileSystemAccess {
  constructor(adaptor: Adaptor) {
    this.showOpenFilePicker = crateShowOpenFilePicker(
      adaptor,
      adaptor.openFileDialog.bind(adaptor),
    );

    this.showDirectoryPicker = createShowDirectoryPicker(
      adaptor,
      adaptor.openDirectoryDialog.bind(adaptor),
    );
  }

  showOpenFilePicker: (
    options?: OpenFilePickerOptions,
  ) => Promise<FileSystemFileHandle[]>;

  showDirectoryPicker: (
    options?: DirectoryPickerOptions,
  ) => Promise<FileSystemDirectoryHandle>;
}
