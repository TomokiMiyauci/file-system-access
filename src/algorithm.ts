import { FilePickerAcceptType, FilePickerOptions } from "./type.ts";
import { parseMediaType } from "@std/media-types";

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
    const filter: Filter = (_, __) => {
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

      return true;
    };

    // 3. Let description be type["description"].
    // 4. If description is an empty string, set description to some user understandable string describing filter.
    const description = type.description || "custom filter";

    // 5. Append (description, filter) to accepts options.
    acceptsOptions.push([description, filter]);
  }

  // 3. If either accepts options is empty, or options["excludeAcceptAllOption"] is false:
  if (!acceptsOptions.length || !options.excludeAcceptAllOption) {
    // 1. Let description be a user understandable string describing "all files".
    const description = "all files";

    // 1. Let filter be an algorithm that returns true.
    const filter = () => true;

    // 2. Append (description, filter) to accepts options.
    acceptsOptions.push([description, filter]);
  }

  // 4. If accepts options is empty, then throw a TypeError.
  if (!acceptsOptions.length) throw new TypeError();

  // 5. Return accepts options.
  return acceptsOptions;
}

type AcceptOption = [description: string, filter: Filter];

interface Filter {
  (filename: string, type: FilePickerAcceptType): boolean;
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

export function validateSuffix(suffix: string): asserts suffix {
  // If suffix does not start with ".", then throw a TypeError.
  if (!suffix.startsWith(".")) throw new TypeError();

  // If suffix contains any code points that are not valid suffix code points, then throw a TypeError.

  // If suffix ends with ".", then throw a TypeError.
  if (suffix.endsWith(".")) throw new TypeError();

  // If suffix’s length is more than 16, then throw a TypeError.
  if (suffix.length > 16) throw new TypeError();
}