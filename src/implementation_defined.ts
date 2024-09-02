import type { FileSystemEntry, FileSystemPath } from "@miyauci/fs";
import type { Map } from "@miyauci/infra";
import type {
  FilePickerAcceptType,
  FileSystemPermissionDescriptor,
} from "./type.ts";

export interface Options {
  startingDirectory: string;
}

export type AcceptOption = [description: string, exts: string[]];

export interface Filter {
  (filename: string, type: FilePickerAcceptType): boolean;
}

export interface OpenDirectoryPicker {
  (options: Options): FileLocation | null;
}

export interface OpenSaveFilePickerOptions extends Options {
  suggestedName?: string;
  acceptsOptions: AcceptOption[];
}

export interface OpenSaveFilePicker {
  (options: OpenSaveFilePickerOptions): FileLocation | null;
}

export interface FileLocation {
  root: string;
  name: string;
}

export interface OpenFileDialogOptions extends Options {
  acceptsOptions: AcceptOption[];
  multiple: boolean;
}

export interface OpenFileDialog {
  (options: OpenFileDialogOptions): FileLocation[] | null;
}

export interface LocateEntry {
  (root: string, path: FileSystemPath): FileSystemEntry | null;
}

export interface UserAgent {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#recently-picked-directory-map)
   */
  recentlyPickedDirectoryMap: Map<unknown, Map<string, string>>;

  /** Default path in a user agent specific manner.
   *
   * [File System Access, 8](https://wicg.github.io/file-system-access/#wellknowndirectory-determine-the-directory-the-picker-will-start-in)
   */
  defaultPath: string;

  openDirectoryDialog: OpenDirectoryPicker;
  openFileDialog: OpenFileDialog;
  openSaveFileDialog: OpenSaveFilePicker;
  locateEntry: LocateEntry;
  query(desc: FileSystemPermissionDescriptor): "granted" | "denied" | "prompt";

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#enumdef-wellknowndirectory)
   */
  wellKnownDirectories: WellKnownDirectoryMap;
}

export interface WellKnownDirectoryMap {
  readonly desktop: string;

  readonly documents: string;

  readonly downloads: string;
  readonly music: string;
  readonly pictures: string;
  readonly videos: string;
}

export interface Environment {
  origin: unknown;
  userAgent: UserAgent;
}
