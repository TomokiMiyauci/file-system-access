import type {
  FileSystemFileOrDirectoryHandleContext,
  FileSystemHandle,
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

export interface OpenDirectoryPicker {
  (options?: DirectoryPickerOptions): { root: string };
}

export interface OpenFileDialog {
  (options?: OpenFilePickerOptions): { root: string; name: string }[];
}

export interface Adaptor extends
  Pick<
    FileSystemFileOrDirectoryHandleContext,
    "locateEntry" | "typeByEntry" | "userAgent"
  > {
  openFileDialog: OpenFileDialog;
  openDirectoryDialog: OpenDirectoryPicker;
}
