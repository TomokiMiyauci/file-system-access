import type {
  FileSystemEntry,
  FileSystemHandle,
  FileSystemPath,
} from "@miyauci/fs";

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

export interface SaveFilePickerOptions extends FilePickerOptions {
  suggestedName?: string;
}

export interface OpenDirectoryPicker {
  (options?: DirectoryPickerOptions): FileLocation;
}

export interface OpenSaveFilePicker {
  (options?: SaveFilePickerOptions): FileLocation;
}

export interface FileLocation {
  root: string;
  name: string;
}

export interface OpenFileDialog {
  (options?: OpenFilePickerOptions): FileLocation[];
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
