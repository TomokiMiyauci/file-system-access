import {
  createFileSystemDirectoryHandle,
  FileSystemDirectoryHandle,
  type IO,
  type UnderlyingFileSystem,
} from "@miyauci/file-system";
import { isTooSensitiveOrDangerous } from "./algorithm.ts";
import type { DirectoryPickerOptions, OpenDirectoryPicker } from "./type.ts";

export function showDirectoryPickerWith(
  fs: UnderlyingFileSystem,
  io: IO,
  openDirectoryPicker: OpenDirectoryPicker,
  options?: DirectoryPickerOptions,
): Promise<FileSystemDirectoryHandle> {
  // 1. Let environment be this’s relevant settings object.

  // 2. Let starting directory be the result of determining the directory the picker will start in given options["id"], options["startIn"] and environment.

  // 3. Let global be environment’s global object.

  // 4. Verify that environment is allowed to show a file picker.

  // 5. Let p be a new promise.
  // 6. Run the following steps in parallel:
  const p = new Promise<FileSystemDirectoryHandle>((resolve) => {
    // 1. Optionally, wait until any prior execution of this algorithm has terminated.

    // 2. Display a prompt to the user requesting that the user pick a directory.
    // When possible, this prompt should start out showing starting directory.

    // 3. Wait for the user to have made their selection.

    // 4. If the user dismissed the prompt without making a selection, reject p with an "AbortError" DOMException and abort.

    // 5. Let entry be a directory entry representing the selected directory.
    const { root } = openDirectoryPicker(options);

    // 6. If entry is deemed too sensitive or dangerous to be exposed to this website by the user agent:
    if (isTooSensitiveOrDangerous()) {
      // 1. Inform the user that the selected files or directories can’t be exposed to this website.

      // 2. At the discretion of the user agent, either go back to the beginning of these in parallel steps, or reject p with an "AbortError" DOMException and abort.
    }

    // 7. Set result to a new FileSystemDirectoryHandle associated with entry.
    const result = createFileSystemDirectoryHandle(root, [""], {
      FileSystemDirectoryHandle,
      fs,
      io,
    });

    // 8. Remember a picked directory given options["id"], entry and environment.

    // 9. Let desc be a FileSystemPermissionDescriptor.
    // 10. Set desc["name"] to "file-system".
    // 11. Set desc["handle"] to result.
    // 12. Set desc["mode"] to options["mode"].
    // const desc = {
    //   // name: "file-system",
    //   handle: result,
    //   // mode,
    // } satisfies FileSystemPermissionDescriptor;

    // 13. Let status be the result of running create a PermissionStatus for desc.

    // 14. Perform the activation notification steps in global’s browsing context.

    // 15. Request permission to use desc.

    // 16. Run the default permission query algorithm on desc and status.

    // 17. If status is not "granted", reject result with a "AbortError" DOMException and abort.

    // 18. Perform the activation notification steps in global’s browsing context.

    // 19. Resolve p with result.
    resolve(result);
  });

  // 7. Return p.
  return p;
}

export function createShowDirectoryPicker(
  fs: UnderlyingFileSystem,
  io: IO,
  openDirectoryPicker: OpenDirectoryPicker,
) {
  return (options?: DirectoryPickerOptions) =>
    showDirectoryPickerWith(fs, io, openDirectoryPicker, options);
}
