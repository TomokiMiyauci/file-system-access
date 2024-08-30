import { FileSystemHandle, type FileSystemLocator } from "@miyauci/fs";
import { join } from "@std/path/join";
import { Map } from "@miyauci/infra";
import { format } from "@miyauci/format";
import type { StartInDirectory } from "./type.ts";
import type { Environment } from "./implementation_defined.ts";
import { Msg } from "./constant.ts";

/**
 * [File System Access](https://wicg.github.io/file-system-access/#valid-path-id)
 */
export function isValidPathId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#wellknowndirectory-determine-the-directory-the-picker-will-start-in)
 */
export function determineDirectoryPickerStartIn(
  id: string | undefined,
  startIn: StartInDirectory | undefined,
  environment: Environment,
): string {
  const { userAgent } = environment;
  const { recentlyPickedDirectoryMap } = userAgent;

  // 1. If id given, and is not a valid path id, then throw a TypeError.
  if (typeof id === "string" && !isValidPathId(id)) {
    throw new TypeError(format(Msg.InvalidId, { id }));
  }

  // 2. If id’s length is more than 32, then throw a TypeError.
  if (typeof id === "string" && 32 < id.length) {
    throw new TypeError(format(Msg.InvalidIdLength, { id }));
  }

  // 3. Let origin be environment’s origin.
  const origin = environment.origin;

  // 4. If startIn is a FileSystemHandle and startIn is not in a bucket file system:
  if (startIn instanceof FileSystemHandle && !isBucketFileSystem(startIn)) {
    // 1. Let entry be the result of locating an entry given startIn’s locator.
    const locator = startIn["locator"];

    // 2. If entry is a file entry, return the path of entry’s parent in the local file system.
    if (locator.kind === "file") {
      return join(locator.fileSystem.root, ...[...locator.path].slice(1));
    }

    // 3. If entry is a directory entry, return entry’s path in the local file system.
    return join(locator.fileSystem.root, ...locator.path);
  }

  // 5. If id is non-empty:
  if (id) {
    // 1. If recently picked directory map[origin] exists:
    if (recentlyPickedDirectoryMap.exists(origin)) {
      // 1. Let path map be recently picked directory map[origin].
      const pathMap = recentlyPickedDirectoryMap.get(origin)!;

      // 2. If path map[id] exists, then return path map[id].
      if (pathMap.exists(id)) return pathMap.get(id)!;
    }
  }

  // 6. If startIn is a WellKnownDirectory:
  if (typeof startIn === "string") {
    // 1. Return a user agent defined path corresponding to the WellKnownDirectory value of startIn.
    return userAgent.wellKnownDirectories[startIn];
  }

  // 7. If id is not specified, or is an empty string:
  if (!id) {
    // 1. If recently picked directory map[origin] exists:
    if (recentlyPickedDirectoryMap.exists(origin)) {
      // 1. Let path map be recently picked directory map[origin].
      const pathMap = recentlyPickedDirectoryMap.get(origin)!;

      // 2. If path map[""] exists, then return path map[""].
      if (pathMap.exists("")) return pathMap.get("")!;
    }
  }

  // 8. Return a default path in a user agent specific manner.
  return userAgent.defaultPath;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#wellknowndirectory-remember-a-picked-directory)
 */
export function rememberPickedDirectory(
  id: string | undefined,
  locator: FileSystemLocator,
  environment: Environment,
): void {
  const { recentlyPickedDirectoryMap } = environment.userAgent;
  // 1. Let origin be environment’s origin.
  const origin = environment.origin;

  // 2. If recently picked directory map[origin] does not exist, then set recently picked directory map[origin] to an empty path id map.
  if (!recentlyPickedDirectoryMap.exists(origin)) {
    recentlyPickedDirectoryMap.set(origin, new Map());
  }

  // 3. If id is not specified, let id be an empty string.
  id ??= "";

  const path = locator.kind === "file"
    ? join(locator.fileSystem.root, ...[...locator.path].slice(1))
    : join(locator.fileSystem.root, ...locator.path);
  // 4. Set recently picked directory map[origin][id] to the path on the local file system corresponding to entry, if such a path can be determined.
  recentlyPickedDirectoryMap.get(origin)!.set(id, path);
}

function isBucketFileSystem(handle: FileSystemHandle): boolean {
  return handle["locator"].path[0] === "";
}
