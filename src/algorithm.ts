import {
  AccessMode,
  DirectoryEntry,
  DirectoryLocator,
  FileEntry,
  FileLocator,
  FileSystemEntry,
  FileSystemLocator,
  IO,
  UnderlyingFileSystem,
} from "./type.ts";
import { type FileSystemDirectoryHandle } from "./file_system_directory_handle.ts";
import type { FileSystemFileHandle } from "./file_system_file_handle.ts";
import { locator } from "./symbol.ts";

export function locateEntry(
  locator: FileSystemLocator,
  io: IO,
): FileSystemEntry | null {
  switch (locator.kind) {
    case "directory":
      return createDirectoryEntry(locator, io);

    case "file":
      return createFileEntry(locator, io);
  }
}

function createFileEntry(locator: FileLocator, io: IO): FileEntry {
  const name = locator.path[locator.path.length - 1];

  return new FileEntryImpl(name, io, locator);
}

class FileEntryImpl implements FileEntry {
  constructor(
    public name: string,
    private io: IO,
    private locator: FileLocator,
  ) {}
  sharedLockCount: number = 0;
  queryAccess(mode: AccessMode) {
    return this.io.queryAccess(this.locator, mode);
  }
  requestAccess(mode: AccessMode) {
    return this.io.requestAccess(this.locator, mode);
  }
  lock: "open" | "taken-exclusive" | "taken-shared" = "open";

  #timestamp: number | undefined;
  #binaryData: ArrayBuffer | undefined;

  get modificationTimestamp(): number {
    return this.#timestamp ??
      (this.#timestamp = this.io.modificationTimestamp(this.locator));
  }

  set modificationTimestamp(value: number) {
    this.#timestamp = value;
  }

  get binaryData(): ArrayBuffer {
    return this.#binaryData ??
      (this.#binaryData = this.io.binaryData(this.locator));
  }

  set binaryData(value: ArrayBuffer) {
    this.#binaryData = value;
  }
}

function createDirectoryEntry(
  locator: DirectoryLocator,
  io: IO,
): DirectoryEntry {
  const name = locator.path[locator.path.length - 1];

  return {
    get children() {
      const childLocators = io.children(locator);

      return childLocators.map((childLocator) => {
        if (childLocator.kind === "file") {
          return createFileEntry(childLocator, io);
        }

        return createDirectoryEntry(childLocator, io);
      });
    },
    name,
    queryAccess: (mode) => {
      return io.queryAccess(locator, mode);
    },
    requestAccess: (mode) => {
      return io.requestAccess(locator, mode);
    },
  };
}

export function isValidFileName(fileName: string): boolean {
  // a string that is not an empty string, is not equal to "." or "..", and does not contain '/' or any other character used as path separator on the underlying platform.
  if (!fileName) return false;

  if (fileName === "." || fileName === "..") return false;

  if (fileName.includes("/")) return false;

  return true;
}

export function isDirectoryEntry(
  entry: FileSystemEntry,
): entry is DirectoryEntry {
  return "children" in entry;
}

export function isFileEntry(
  entry: FileSystemEntry,
): entry is FileEntry {
  return "binaryData" in entry;
}

export function createChildFileSystemFileHandle(
  parentLocator: FileSystemLocator,
  name: string,
  realm: {
    FileSystemFileHandle: typeof FileSystemFileHandle;
    fs: UnderlyingFileSystem;
    io: IO;
  },
): FileSystemFileHandle {
  // 1. Let handle be a new FileSystemFileHandle in realm.
  const handle = new realm.FileSystemFileHandle(realm.fs, realm.io);

  // 2. Let childType be "file".
  const childType = "file";

  // 3. Let childRoot be a copy of parentLocator’s root.
  const childRoot = parentLocator.root;

  // 4. Let childPath be the result of cloning parentLocator’s path and appending name.
  const childPath = parentLocator.path.concat(name);

  // 5. Set handle’s locator to a file system locator whose kind is childType, root is childRoot, and path is childPath.
  handle[locator] = {
    kind: childType,
    root: childRoot,
    path: childPath,
  } satisfies FileSystemLocator;

  // 6. Return handle.
  return handle;
}

export function createFileSystemDirectoryHandle(
  root: string,
  path: string[],
  realm: {
    FileSystemDirectoryHandle: typeof FileSystemDirectoryHandle;
    fs: UnderlyingFileSystem;
    io: IO;
  },
): FileSystemDirectoryHandle {
  const handle = new realm.FileSystemDirectoryHandle(realm.fs, realm.io);

  handle[locator] = { kind: "directory", root, path };

  return handle;
}

export function resolve(
  child: FileSystemLocator,
  root: FileSystemLocator,
): Promise<string[] | null> {
  // 1. Let result be a new promise.
  const { promise, resolve } = Promise.withResolvers<string[] | null>();
  // 2. Enqueue the following steps to the file system queue:
  queueMicrotask(() => {
    // 1. If child’s locator's root is not root’s locator's root, resolve result with null, and abort these steps. // maybe type miss
    // 1. If child’s root is not root’s root, resolve result with null, and abort these steps.
    if (child.root !== root.root) return resolve(null);

    // 2. Let childPath be child’s path.
    const childPath = child.path;

    // 3. Let rootPath be root’s path.
    const rootPath = root.path;

    // 4. If childPath is the same path as rootPath, resolve result with « », and abort these steps.
    if (isSamePath(childPath, rootPath)) return resolve([]);

    // 5. If rootPath’s size is greater than childPath’s size, resolve result with null, and abort these steps.

    if (rootPath.length > childPath.length) return resolve([]);

    // 6. For each index of rootPath’s indices:
    for (const index of rootPath.keys()) {
      // 1. If rootPath.\[[index]] is not childPath.\[[index]], then resolve result with null, and abort these steps.
      if (rootPath[index] !== childPath[index]) return resolve(null);
    }

    // 7. Let relativePath be « ».
    const relativePath: string[] = [];

    // 8. For each index of the range from rootPath’s size to rootPath’s size, exclusive, append childPath.\[[index]] to relativePath.
    for (const index of exclusiveRange(rootPath.length, rootPath.length)) {
      relativePath.push(childPath[index]);
    }

    // 9. Resolve result with relativePath.
    resolve(relativePath);
  });

  // 3. Return result.
  return promise;
}

/**
 * @see https://fs.spec.whatwg.org/#file-system-path-the-same-path-as
 */
export function isSamePath(a: string[], b: string[]): boolean {
  // if a’s size is the same as b’s size and for each index of a’s indices a.\[[index]] is b.\[[index]].
  return a.length === b.length &&
    a.every((aValue, index) => aValue === b[index]);
}

function exclusiveRange(n: number, m: number): number[] {
  // If m equals n, then it creates an empty ordered set.
  if (m === n) return [];
  // creates a new ordered set containing all of the integers from n up to and including m − 1 in consecutively increasing order, as long as m is greater than n.

  return [];
}

/**
 * @see https://fs.spec.whatwg.org/#file-system-locator-the-same-locator-as
 */
export function isSameLocator(
  a: FileSystemLocator,
  b: FileSystemLocator,
): boolean {
  // if a’s kind is b’s kind, a’s root is b’s root, and a’s path is the same path as b’s path.
  return a.kind === b.kind && a.root === b.root && isSamePath(a.path, b.path);
}

/**
 * @see https://fs.spec.whatwg.org/#file-entry-lock-take
 */
export function takeLock(
  value: "exclusive" | "shared",
  file: FileEntry,
): "success" | "failure" {
  // 1. Let lock be the file’s lock.
  const lock = file.lock;

  // 2. Let count be the file’s shared lock count.

  // 3. If value is "exclusive":
  if (value === "exclusive") {
    // 1. If lock is "open":
    if (lock === "open") {
      // 1. Set lock to "taken-exclusive".
      file.lock = "taken-exclusive";

      // 2. Return "success".
      return "success";
    }
  }

  // 4. If value is "shared":
  if (value === "shared") {
    // 1. If lock is "open":
    if (lock === "open") {
      // 1. Set lock to "taken-shared".
      file.lock = "taken-shared";

      // 2. Set count to 1.
      file.sharedLockCount = 1;

      // 3. Return "success".
      return "success";

      // 2. Otherwise, if lock is "taken-shared":
    } else if (lock === "taken-shared") {
      // 1. Increase count by 1.
      file.sharedLockCount++;

      // 2. Return "success".
      return "success";
    }
  }

  // 5. Return "failure".
  return "failure";
}

/**
 * @see https://fs.spec.whatwg.org/#file-entry-lock-release
 */
export function releaseLock(file: FileEntry): void {
  // 1. Let lock be the file’s associated lock.
  // 2. Let count be the file’s shared lock count.

  // 3. If lock is "taken-shared":
  if (file.lock === "taken-shared") {
    // 1. Decrease count by 1.
    file.sharedLockCount--;

    // 2. If count is 0, set lock to "open".
    if (file.sharedLockCount === 0) file.lock = "open";
  } // 4. Otherwise, set lock to "open".
  else file.lock = "open";
}
