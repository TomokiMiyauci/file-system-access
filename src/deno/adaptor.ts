import { type FileEntry, UA, type UserAgent } from "@miyauci/fs";
import { FileSystem } from "@miyauci/fs/deno";
import { openDirectoryDialog, openFileDialog } from "./ffi.ts";
import type { Adaptor, OpenDirectoryPicker, OpenFileDialog } from "../type.ts";
import { typeByExtension } from "@std/media-types";
import { extname } from "@std/path/extname";

export class DenoAdaptor implements Adaptor {
  openFileDialog: OpenFileDialog = openFileDialog;
  openDirectoryDialog: OpenDirectoryPicker = openDirectoryDialog;

  userAgent: UserAgent = new UA();
  typeByEntry(entry: FileEntry): string | undefined {
    return typeByExtension(extname(entry.name));
  }
  locateEntry = FileSystem.prototype.locateEntry;
}
