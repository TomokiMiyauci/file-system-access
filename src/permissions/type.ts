export interface PermissionDescriptor {
  name: PermissionName;
}

export type PermissionName =
  | "geolocation"
  | "notifications"
  | "persistent-storage"
  | "push"
  | "screen-wake-lock"
  | "xr-spatial-tracking"
  | "file-system";
