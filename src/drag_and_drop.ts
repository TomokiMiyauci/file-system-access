import type { FileSystemHandle } from "@miyauci/fs";

/**
 * [HTML Standard](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)
 */
export interface DataTransferItem {
  /** Returns a FileSystemFileHandle object if the dragged item is a file and a FileSystemDirectoryHandle object if the dragged item is a directory.
   *
   * [File System Access](https://wicg.github.io/file-system-access/#dom-datatransferitem-getasfilesystemhandle)
   */
  getAsFileSystemHandle(): Promise<FileSystemHandle | null>;
}
