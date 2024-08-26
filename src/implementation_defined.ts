import type { FileSystemEntry, FileSystemPath } from "@miyauci/fs";
import type { Map } from "@miyauci/infra";
import type { FilePickerAcceptType } from "./type.ts";

export interface Options {
  startingDirectory: string;
}

export type AcceptOption = [description: string, exts: string[]];

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

export interface OpenFileDialogOptions extends Options {
  acceptsOptions: AcceptOption[];
  multiple?: boolean;
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
