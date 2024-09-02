import type { PermissionState } from "@miyauci/permissions";
import type { FileSystemPermissionMode } from "./type.ts";

/**
 * [File System Access](https://wicg.github.io/file-system-access/#dictdef-filesystemhandlepermissiondescriptor)
 */
export interface FileSystemHandlePermissionDescriptor {
  /**
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystemhandlepermissiondescriptor-mode)
   */
  mode?: FileSystemPermissionMode;
}

/**
 * [File System Standard](https://fs.spec.whatwg.org/#filesystemhandle)
 */
export interface FileSystemHandle {
  /** Queries the current state of the read permission of this handle. If this returns "[prompt](https://w3c.github.io/permissions/#dom-permissionstate-prompt)" the website will have to call [requestPermission()](https://wicg.github.io/file-system-access/#dom-filesystemhandle-requestpermission) before any operations on the handle can be done. If this returns "[denied](https://w3c.github.io/permissions/#dom-permissionstate-denied)" any operations will reject.
   *
   * Usually handles returned by the [local file system handle factories](https://wicg.github.io/file-system-access/#local-file-system-handle-factories) will initially return "[granted](https://w3c.github.io/permissions/#dom-permissionstate-granted)" for their read permission state, however other than through the user revoking permission, a handle retrieved from IndexedDB is also likely to return "[prompt](https://w3c.github.io/permissions/#dom-permissionstate-prompt)".
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystemhandle-querypermission)
   */
  queryPermission(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>;

  /** If the state of the read permission of this handle is anything other than "[prompt](https://w3c.github.io/permissions/#dom-permissionstate-prompt)"", this will return that state directly. If it is "[prompt](https://w3c.github.io/permissions/#dom-permissionstate-prompt)" however, user activation is needed and this will show a confirmation prompt to the user. The new read permission state is then returned, depending on the user’s response to the prompt.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-filesystemhandle-requestpermission)
   */
  requestPermission(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>;
}
