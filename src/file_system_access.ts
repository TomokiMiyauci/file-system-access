import type {
  FileSystemDirectoryHandle,
  FileSystemFileHandle,
} from "@miyauci/fs";
import { Map } from "@miyauci/infra";
import type {
  Adaptor,
  Environment as _Environment,
  UserAgent as _UserAgent,
  WellKnownDirectoryRecord as _WellKnownDirectoryRecord,
} from "./implementation_defined.ts";
import { createShowOpenFilePicker } from "./show_open_file_picker.ts";
import type {
  DirectoryPickerOptions,
  OpenFilePickerOptions,
  SaveFilePickerOptions,
} from "./type.ts";
import { createShowDirectoryPicker } from "./show_directory_picker.ts";
import { createShowSaveFilePicker } from "./show_save_file_picker.ts";
import { homedir } from "node:os";
import { join } from "@std/path/join";

export class FileSystemAccess {
  constructor(adaptor: Adaptor) {
    const environment = new Environment();

    this.showOpenFilePicker = createShowOpenFilePicker(
      environment,
      adaptor.locateEntry,
      adaptor.openFileDialog.bind(adaptor),
    );

    this.showDirectoryPicker = createShowDirectoryPicker(
      environment,
      adaptor.locateEntry,
      adaptor.openDirectoryDialog.bind(adaptor),
    );

    this.showSaveFilePicker = createShowSaveFilePicker(
      environment,
      adaptor.locateEntry,
      adaptor.openSaveFileDialog.bind(adaptor),
    );
  }

  /** Shows a file picker that lets a user select a single existing file, returning a handle for the selected file.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showopenfilepicker)
   */
  showOpenFilePicker: (
    options?: OpenFilePickerOptions,
  ) => Promise<FileSystemFileHandle[]>;

  /** Shows a directory picker that lets the user select a single directory, returning a handle for the selected directory if the user grants read permission.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showdirectorypicker)
   */
  showDirectoryPicker: (
    options?: DirectoryPickerOptions,
  ) => Promise<FileSystemDirectoryHandle>;

  /** Shows a file picker that lets a user select a single file, returning a handle for the selected file.
   *
   * The selected file does not have to exist already. If the selected file does not exist a new empty file is created before this method returns, otherwise the existing file is cleared before this method returned.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-window-showsavefilepicker)
   */
  showSaveFilePicker: (
    options?: SaveFilePickerOptions,
  ) => Promise<FileSystemFileHandle>;
}

class Environment implements _Environment {
  userAgent: _UserAgent = new UserAgent();
  origin: unknown = {};
}

class UserAgent implements _UserAgent {
  recentlyPickedDirectoryMap: Map<unknown, Map<string, string>> = new Map();

  defaultPath: string = "";
  wellKnownDirectory: WellKnownDirectoryRecord = new WellKnownDirectoryRecord();
}

class WellKnownDirectoryRecord implements _WellKnownDirectoryRecord {
  get desktop() {
    return join(homedir(), "Desktop");
  }

  get documents() {
    return join(homedir(), "Documents");
  }

  get downloads() {
    return join(homedir(), "Downloads");
  }

  get music() {
    return join(homedir(), "Music");
  }

  get pictures() {
    return join(homedir(), "Pictures");
  }

  get videos() {
    return join(homedir(), "Videos");
  }
}
