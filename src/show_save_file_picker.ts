import {
  createNewFileSystemFileHandle,
  type FileSystemFileHandle,
} from "@miyauci/fs";
import type {
  Environment,
  LocateEntry,
  OpenSaveFilePicker,
  SaveFilePickerOptions,
} from "./type.ts";
import { List, Set } from "@miyauci/infra";
import {
  determineDirectoryPickerStartIn,
  processAcceptTypes,
  rememberPickedDirectory,
} from "./algorithm.ts";

export function showSaveFilePickerWith(
  environment: Environment,
  locateEntry: LocateEntry,
  openSaveFilePicker: OpenSaveFilePicker,
  options: SaveFilePickerOptions = {},
): Promise<FileSystemFileHandle> {
  // 1. Let environment be this’s relevant settings object.

  // 2. Let accepts options be the result of processing accept types given options.
  const acceptsOptions = processAcceptTypes(options);

  // 3. Let starting directory be the result of determining the directory the picker will start in given options["id"], options["startIn"] and environment.
  const startingDirectory = determineDirectoryPickerStartIn(
    options?.id,
    options?.startIn,
    environment,
  );

  // 4. Let global be environment’s global object.

  // 5. Verify that environment is allowed to show a file picker.

  // 6. Let p be a new promise.
  // 7. Run the following steps in parallel:
  const p = new Promise<FileSystemFileHandle>((resolve) => {
    // 1. Optionally, wait until any prior execution of this algorithm has terminated.

    // 2. Display a prompt to the user requesting that the user pick exactly one file. The displayed prompt should let the user pick one of the accepts options to filter the list of displayed files. Exactly how this is implemented, and what this prompt looks like is implementation-defined. If accepts options are displayed in the UI, the selected option should also be used to suggest an extension to append to a user provided file name, but this is not required. In particular user agents are free to ignore potentially dangerous suffixes such as those ending in ".lnk" or ".local".
    // When possible, this prompt should start out showing starting directory.
    // If options["suggestedName"] exists and is not null, the file picker prompt will be pre-filled with the options["suggestedName"] as the default name to save as. The interaction between the suggestedName and accepts options is implementation-defined. If the suggestedName is deemed too dangerous, user agents should ignore or sanitize the suggested file name, similar to the sanitization done when fetching something as a download.
    const { root, name } = openSaveFilePicker({
      startingDirectory,
      suggestedName: options?.suggestedName,
      acceptsOptions,
    });

    // 3. Wait for the user to have made their selection.

    // 4. If the user dismissed the prompt without making a selection, reject p with an "AbortError" DOMException and abort.

    // 5. Let entry be a file entry representing the selected file.

    // 6. If entry is deemed too sensitive or dangerous to be exposed to this website by the user agent:

    // 1. Inform the user that the selected files or directories can’t be exposed to this website.

    // 2. At the discretion of the user agent, either go back to the beginning of these in parallel steps, or reject p with an "AbortError" DOMException and abort.

    // 7. Set entry’s binary data to an empty byte sequence.

    // 8. Set result to a new FileSystemFileHandle associated with entry.
    const result = createNewFileSystemFileHandle({
      root,
      locateEntry,
      observations: new Set(),
    }, new List([name]));

    // 9. Remember a picked directory given options["id"], entry and environment.
    rememberPickedDirectory(options?.id, environment);

    // 10. Perform the activation notification steps in global’s browsing context.

    // 11. Resolve p with result.
    resolve(result);
  });

  // 8. Return p.
  return p;
}

export function createShowSaveFilePicker(
  environment: Environment,
  locateEntry: LocateEntry,
  openShowFilePicker: OpenSaveFilePicker,
) {
  return (options?: SaveFilePickerOptions) =>
    showSaveFilePickerWith(
      environment,
      locateEntry,
      openShowFilePicker,
      options,
    );
}
