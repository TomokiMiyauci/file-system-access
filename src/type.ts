import type {
  FileSystemEntry,
  FileSystemHandle,
  FileSystemPath,
} from "@miyauci/fs";
import type { Map } from "@miyauci/infra";

export interface FilePickerOptions {
  types?: FilePickerAcceptType[];
  excludeAcceptAllOption?: boolean;

  id?: string;

  startIn?: StartInDirectory;
}

export interface FilePickerAcceptType {
  description?: string;

  accept: Record<string, string | string[]>;
}

export interface DirectoryPickerOptions {
  id?: string;
  startIn?: StartInDirectory;
  mode?: FileSystemPermissionMode;
}

export type WellKnownDirectory =
  | "desktop"
  | "documents"
  | "downloads"
  | "music"
  | "pictures"
  | "videos";

export type FileSystemPermissionMode = "read" | "readwrite";

export type StartInDirectory = WellKnownDirectory | FileSystemHandle;

export interface PermissionDescriptor {
  name: PermissionName;
}

export type PermissionName =
  | "geolocation"
  | "notifications"
  | "persistent-storage"
  | "push"
  | "screen-wake-lock"
  | "xr-spatial-tracking";

export interface FileSystemPermissionDescriptor extends PermissionDescriptor {
  handle: FileSystemHandle;
  mode: "read" | "readwrite";
}

export interface OpenFilePickerOptions extends FilePickerOptions {
  multiple?: boolean;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-savefilepickeroptions)
 */
export interface SaveFilePickerOptions extends FilePickerOptions {
  /** The suggested file name.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-savefilepickeroptions-suggestedname)
   */
  suggestedName?: string;
}

export interface Options {
  startingDirectory: string;
}

export type AcceptOption = [description: string, filter: Filter];

export interface Filter {
  (filename: string, type: FilePickerAcceptType): boolean;
}

export interface OpenDirectoryPicker {
  (options: Options): FileLocation;
}

export interface OpenSaveFilePickerOptions extends Options {
  suggestedName?: string;
  acceptsOptions: AcceptOption[];
}

export interface OpenSaveFilePicker {
  (options: OpenSaveFilePickerOptions): FileLocation;
}

export interface FileLocation {
  root: string;
  name: string;
}

interface OpenFileDialogOptions extends Options {
  acceptsOptions: AcceptOption[];
}

export interface OpenFileDialog {
  (options: OpenFileDialogOptions): FileLocation[];
}

export interface Adaptor {
  openFileDialog: OpenFileDialog;
  openDirectoryDialog: OpenDirectoryPicker;
  openSaveFileDialog: OpenSaveFilePicker;
  locateEntry: LocateEntry;
}

export interface LocateEntry {
  (path: FileSystemPath): FileSystemEntry | null;
}

export interface UserAgent {
  recentlyPickedDirectoryMap: Map<unknown, Map<string, string>>;
  defaultPath: string;
  wellKnownDirectory: WellKnownDirectoryRecord;
}

export interface WellKnownDirectoryRecord {
  get desktop(): string;

  get documents(): string;

  get downloads(): string;
  get music(): string;
  get pictures(): string;
  get videos(): string;
}

export interface Environment {
  origin: unknown;
  userAgent: UserAgent;
}
