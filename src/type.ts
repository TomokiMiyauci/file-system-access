import type { FileSystemHandle } from "@miyauci/fs";
import type { PermissionDescriptor } from "./permissions/type.ts";

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-filepickeroptions)
 */
export interface FilePickerOptions {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filepickeroptions-types)
   */
  types?: FilePickerAcceptType[];

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filepickeroptions-excludeacceptalloption)
   */
  excludeAcceptAllOption?: boolean;

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filepickeroptions-id)
   */
  id?: string;

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filepickeroptions-startin)
   */
  startIn?: StartInDirectory;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-filepickeraccepttype)
 */
export interface FilePickerAcceptType {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filepickeraccepttype-description)
   */
  description?: string;

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filepickeraccepttype-accept)
   */
  accept: Record<string, string | string[]>;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-directorypickeroptions)
 */
export interface DirectoryPickerOptions {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-directorypickeroptions-id)
   */
  id?: string;

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-directorypickeroptions-startin)
   */
  startIn?: StartInDirectory;

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-directorypickeroptions-mode)
   */
  mode?: FileSystemPermissionMode;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#enumdef-wellknowndirectory)
 */
export type WellKnownDirectory =
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-wellknowndirectory-desktop)
   */
  | "desktop"
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-wellknowndirectory-documents)
   */
  | "documents"
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-wellknowndirectory-downloads)
   */
  | "downloads"
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-wellknowndirectory-music)
   */
  | "music"
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-wellknowndirectory-pictures)
   */
  | "pictures"
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-wellknowndirectory-videos)
   */
  | "videos";

/**
 * [File System Access](https://wicg.github.io/file-system-access/#enumdef-filesystempermissionmode)
 */
export type FileSystemPermissionMode =
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystempermissionmode-read)
   */
  | "read"
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystempermissionmode-readwrite)
   */
  | "readwrite";

/**
 * [File System Access](https://wicg.github.io/file-system-access/#typedefdef-startindirectory)
 */
export type StartInDirectory = WellKnownDirectory | FileSystemHandle;

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-filesystempermissiondescriptor)
 */
export interface FileSystemPermissionDescriptor extends PermissionDescriptor {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystempermissiondescriptor-handle)
   */
  readonly handle: FileSystemHandle;

  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystempermissiondescriptor-mode)
   */
  mode: FileSystemPermissionMode;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-openfilepickeroptions)
 */
export interface OpenFilePickerOptions extends FilePickerOptions {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-openfilepickeroptions-multiple)
   */
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
