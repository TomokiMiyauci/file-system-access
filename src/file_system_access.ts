import { Adaptor } from "./type.ts";
import { crateShowOpenFilePicker } from "./show_open_file_picker.ts";
import { DirectoryPickerOptions, OpenFilePickerOptions } from "./type.ts";
import { createShowDirectoryPicker } from "./show_directory_picker.ts";

export class FileSystemAccess {
  constructor(adaptor: Adaptor) {
    this.showOpenFilePicker = crateShowOpenFilePicker(
      adaptor.fs,
      adaptor.io,
      adaptor.openFileDialog.bind(adaptor),
    );

    this.showDirectoryPicker = createShowDirectoryPicker(
      adaptor.fs,
      adaptor.io,
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
