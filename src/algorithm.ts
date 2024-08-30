import { FileSystemHandle, type FileSystemLocator } from "@miyauci/fs";
import { Map } from "@miyauci/infra";
import { parseMediaType } from "@std/media-types";
import { join } from "@std/path/join";
import { format } from "@miyauci/format";
import type { FilePickerOptions, StartInDirectory } from "./type.ts";
import type { AcceptOption, Environment } from "./implementation_defined.ts";
import { Msg } from "./constant.ts";

export function isTooSensitiveOrDangerous(): boolean {
  return false;
}

export function processAcceptTypes(options: FilePickerOptions): AcceptOption[] {
  // 1. Let accepts options be a empty list of tuples consisting of a description and a filter.
  const acceptsOptions: AcceptOption[] = [];

  // 2. For each type of options["types"]:
  for (const type of options.types ?? []) {
    // 1. For each typeString → suffixes of type["accept"]:
    for (const [typeString, suffixes] of Object.entries(type.accept)) {
      // 1. Let parsedType be the result of parse a MIME type with typeString.
      const parsedType = parse(typeString);

      // 2. If parsedType is failure, then throw a TypeError.

      // 3. If parsedType’s parameters are not empty, then throw a TypeError.
      if (Object.keys(parsedType.parameters).length) throw new TypeError();

      // 4. If suffixes is a string:
      if (typeof suffixes === "string") {
        // 1. Validate a suffix given suffixes.
        validateSuffix(suffixes);

        // 5. Otherwise, for each suffix of suffixes:
      } else {
        for (const suffix of suffixes) {
          // 1. Validate a suffix given suffix.
          validateSuffix(suffix);
        }
      }
    }

    // 2. Let filter be these steps, given a filename (a string) and a type (a MIME type):
    // const filter: Filter = (_, __) => {
    // // 1. For each typeString → suffixes of type["accept"]:
    // for (const [typeString, suffixes] of Object.entries(type.accept)) {
    //   // 2. Let parsedType be the result of parse a MIME type with typeString.
    //   const parsedType = parse(typeString);

    //   // 1. If parsedType’s subtype is "*":
    //   if (parsedType.subtype === "*") {
    //     // 1. If parsedType’s type is "*", return true.
    //     if (parsedType.type === "*") return true;

    //     // 2. If parsedType’s type is type’s type, return true.
    //     if (parsedType.type === type.type) return true;
    //   }

    //   // 2. parsedType’s essence is type’s essence, return true.
    //   if (parsedType.essence === type.essence) return true;

    //   // 3. If suffixes is a string, set suffixes to « suffixes ».
    //   if (typeof suffixes === "string") suffixes = [suffixes];

    //   // 4. For each suffix of suffixes:
    //   for (const suffix of suffixes) {
    //     // 1. If filename ends with suffix, return true.
    //     if (filename.endsWith(suffix)) return true;
    //   }

    //   // 3. Return false.
    //   return false;
    // }

    // return true;
    // };

    // 3. Let description be type["description"].
    // 4. If description is an empty string, set description to some user understandable string describing filter.
    const description = type.description || "custom filter";

    // 5. Append (description, filter) to accepts options.
    acceptsOptions.push([description, Object.values(type.accept).flat()]);
  }

  // // 3. If either accepts options is empty, or options["excludeAcceptAllOption"] is false:
  // if (!acceptsOptions.length || !options.excludeAcceptAllOption) {
  //   // 1. Let description be a user understandable string describing "all files".
  //   const description = "all files";

  //   // 1. Let filter be an algorithm that returns true.
  //   const filter = () => true;

  //   // 2. Append (description, filter) to accepts options.
  //   acceptsOptions.push([description, filter]);
  // }

  // 4. If accepts options is empty, then throw a TypeError.
  // if (!acceptsOptions.length) throw new TypeError();

  // 5. Return accepts options.
  return acceptsOptions;
}

export function parse(input: string): MIMEType {
  const [essence, parameters = {}] = parseMediaType(input);
  const [type, subtype] = divideBy(essence, "/");

  return { type, subtype, essence, parameters };
}

function divideBy(input: string, divider: string): [string, string] {
  const [head, ...tails] = input.split(divider);

  return [head, tails.join("")];
}

interface MIMEType {
  type: string;
  subtype: string;
  essence: string;
  parameters: Record<string, string>;
}

function isAsciiAlphanumeric(codePoint: number): boolean {
  return (
    (0x30 <= codePoint && codePoint <= 0x39) || // '0' to '9'
    (0x41 <= codePoint && codePoint <= 0x5A) || // 'A' to 'Z'
    (0x61 <= codePoint && codePoint <= 0x7A) // 'a' to 'z'
  );
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#valid-suffix-code-point)
 */
function isValidSuffixCodePoints(codePoint: number): boolean {
  if (isAsciiAlphanumeric(codePoint)) return true;

  // U+002B ('+')
  if (codePoint === 0x002B) return true;

  // U+002E ('.')
  if (codePoint === 0x002E) return true;

  return false;
}

/**
 * [File System Access](https://wicg.github.io/file-system-access/#validate-a-suffix)
 */
export function validateSuffix(suffix: string): asserts suffix {
  // If suffix does not start with ".", then throw a TypeError.
  if (!suffix.startsWith(".")) {
    throw new TypeError(
      format(Msg.InvalidSuffixNotStatsWithPeriod, { suffix }),
    );
  }

  // If suffix contains any code points that are not valid suffix code points, then throw a TypeError.
  for (const str of suffix) {
    const codePoint = str.codePointAt(0)!;

    if (!isValidSuffixCodePoints(codePoint)) {
      throw new TypeError(format(Msg.InvalidSuffix, { suffix }));
    }
  }

  // If suffix ends with ".", then throw a TypeError.
  if (suffix.endsWith(".")) {
    throw new TypeError(format(Msg.InvalidSuffixEndsWithPeriod, { suffix }));
  }

  // If suffix’s length is more than 16, then throw a TypeError.
  if (16 < suffix.length) {
    throw new TypeError(format(Msg.InvalidSuffixLength, { suffix }));
  }
}

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

/**
 * [File System Access](https://wicg.github.io/file-system-access/#valid-path-id)
 */
export function isValidPathId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

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
    return userAgent.wellKnownDirectory[startIn];
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

function isBucketFileSystem(handle: FileSystemHandle): boolean {
  return handle["locator"].path[0] === "";
}
