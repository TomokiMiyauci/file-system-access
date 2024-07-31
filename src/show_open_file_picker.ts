import {
  createFileSystemFileHandle,
  FileSystemFileHandle,
  IO,
  UnderlyingFileSystem,
} from "@miyauci/file-system";
import { isTooSensitiveOrDangerous } from "./algorithm.ts";
import type { OpenFileDialog, OpenFilePickerOptions } from "./type.ts";

export function showOpenFilePickerWith(
  fs: UnderlyingFileSystem,
  io: IO,
  openFileDialog: OpenFileDialog,
  options: OpenFilePickerOptions = {},
): Promise<FileSystemFileHandle[]> {
  // 1. Let environment be this’s relevant settings object.

  // 2. Let accepts options be the result of processing accept types given options.
  // const acceptsOptions = processAcceptTypes(options);

  // 3. Let starting directory be the result of determining the directory the picker will start in given options["id"], options["startIn"], and environment.

  // 4. Let global be environment’s global object.

  // 5. Verify that environment is allowed to show a file picker.

  // 6. Let p be a new promise.
  // 7. Run the following steps in parallel:
  const p = new Promise<FileSystemFileHandle[]>((resolve) => {
    // 1. Optionally, wait until any prior execution of this algorithm has terminated.

    // 2. Display a prompt to the user requesting that the user pick some files. If options["multiple"] is false, there must be no more than one file selected; otherwise any number may be selected.
    // The displayed prompt should let the user pick one of the accepts options to filter the list of displayed files. Exactly how this is implemented, and what this prompt looks like is implementation-defined.
    // When possible, this prompt should start out showing starting directory.

    // 3. Wait for the user to have made their selection.

    const entries = openFileDialog(options);

    // 4. If the user dismissed the prompt without making a selection, reject p with an "AbortError" DOMException and abort.

    // 5. Let entries be a list of file entries representing the selected files or directories.

    // 6. Let result be a empty list.
    const result: FileSystemFileHandle[] = [];

    // 7. For each entry of entries:
    for (const { root, name } of entries) {
      // 1. If entry is deemed too sensitive or dangerous to be exposed to this website by the user agent:
      if (isTooSensitiveOrDangerous()) {
        // 1. Inform the user that the selected files or directories can’t be exposed to this website.

        // 2. At the discretion of the user agent, either go back to the beginning of these in parallel steps, or reject p with an "AbortError" DOMException and abort.
      }

      const path: string[] = [name];

      // 2. Add a new FileSystemFileHandle associated with entry to result.
      result.push(createFileSystemFileHandle(root, path, fs, io));
    }

    // 8. Remember a picked directory given options["id"], entries[0] and environment.

    // 9. Perform the activation notification steps in global’s browsing context.

    // 10. Resolve p with result.
    resolve(result);
  });

  // 8. Return p.
  return p;
}

// export function rememberPickedDirectory(
//   id?: string,
//   entry: FileSystemEntry,
//   environment: unknown,
// ) {}

export function crateShowOpenFilePicker(
  fs: UnderlyingFileSystem,
  io: IO,
  open: OpenFileDialog,
) {
  return (options?: OpenFilePickerOptions) =>
    showOpenFilePickerWith(fs, io, open, options);
}