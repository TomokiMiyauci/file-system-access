/**
 * [Permissions](https://w3c.github.io/permissions/#dfn-create-a-permissionstatus)
 */
export type PermissionState =
  /**
   * [Permissions](https://w3c.github.io/permissions/#dom-permissionstate-granted)
   */
  | "granted"
  /**
   * [Permissions](https://w3c.github.io/permissions/#dom-permissionstate-denied)
   */
  | "denied"
  /**
   * [Permissions](https://w3c.github.io/permissions/#dom-permissionstate-prompt)
   */
  | "prompt";
