import { BucketFileSystem } from "@miyauci/fs/deno";
import {
  openDirectoryDialog,
  openFileDialog,
  openSaveFileDialog,
} from "./ffi.ts";
import type { Adaptor, OpenDirectoryPicker, OpenFileDialog } from "../type.ts";

export class DenoAdaptor implements Adaptor {
  openFileDialog: OpenFileDialog = openFileDialog;
  openDirectoryDialog: OpenDirectoryPicker = openDirectoryDialog;

  locateEntry = BucketFileSystem.prototype.locateEntry;
  openSaveFileDialog = openSaveFileDialog;
}
