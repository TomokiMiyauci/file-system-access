import { beforeEach, describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { createNewFileSystemHandle } from "@miyauci/fs";
import {
  determineDirectoryPickerStartIn,
  rememberPickedDirectory,
  validateSuffix,
} from "./file_picker_option.ts";
import type { Environment } from "./implementation_defined.ts";
import { List, Map, Set } from "@miyauci/infra";

describe("validateSuffix", () => {
  it("should throw error if suffix does not start with period", () => {
    expect(() => validateSuffix(" ")).toThrow(TypeError);
  });

  it("should throw error if suffix end with period", () => {
    expect(() => validateSuffix(".a.")).toThrow(TypeError);
  });

  it("should throw error if suffix length greater than 16", () => {
    expect(() => validateSuffix(".abcdefghijklmnop")).toThrow(TypeError);
  });

  it("should throw error if suffix contains invalid code point", () => {
    expect(() => validateSuffix(".あ")).toThrow(TypeError);
  });

  it("should not throw", () => {
    const table: string[] = [
      ".a",
      ".txt",
      ".abcdefghijklmno",
    ];

    for (const suffix of table) {
      expect(validateSuffix(suffix)).toBeFalsy();
    }
  });
});

describe("determineDirectoryPickerStartIn", () => {
  interface Context {
    env: Environment;
  }
  beforeEach<Context>(function () {
    this.env = {
      origin: {},
      userAgent: {
        defaultPath: "/",
        locateEntry() {
          return null;
        },
        openDirectoryDialog() {
          return null;
        },
        openFileDialog() {
          return null;
        },
        openSaveFileDialog() {
          return null;
        },
        requestPermissionToUse() {
          return "granted";
        },
        recentlyPickedDirectoryMap: new Map(),
        wellKnownDirectories: {
          desktop: "/desktop",
          documents: "/documents",
          downloads: "/downloads",
          music: "/music",
          pictures: "/pictures",
          videos: "/videos",
        },
      },
    } satisfies Environment;
  });

  it<Context>("should throw error if id is invalid", function () {
    expect(() => determineDirectoryPickerStartIn(" ", "desktop", this.env))
      .toThrow(TypeError);
  });

  it<Context>("should throw error if id is greater than 32", function () {
    expect(() =>
      determineDirectoryPickerStartIn("a".repeat(33), "desktop", this.env)
    ).toThrow(TypeError);
  });

  it<Context>("should return default path", function () {
    expect(
      determineDirectoryPickerStartIn(undefined, undefined, this.env),
    ).toBe(this.env.userAgent.defaultPath);
  });

  it<Context>("should return default path if id does not exist", function () {
    expect(
      determineDirectoryPickerStartIn("", undefined, this.env),
    ).toBe(this.env.userAgent.defaultPath);
  });

  it<Context>(
    "should return desktop path if startIn is wellknown directory",
    function () {
      expect(
        determineDirectoryPickerStartIn("", "desktop", this.env),
      ).toBe(this.env.userAgent.wellKnownDirectories.desktop);
    },
  );

  it<Context>(
    "should return recently picked directory path if id provided",
    function () {
      const id = "";
      const pathIdMap = new Map<string, string>();
      pathIdMap.set(id, "/default");
      this.env.userAgent.recentlyPickedDirectoryMap.set(
        this.env.origin,
        pathIdMap,
      );

      expect(
        determineDirectoryPickerStartIn(id, undefined, this.env),
      ).toBe("/default");
    },
  );

  it<Context>(
    "should return recently picked directory path if id provided 2",
    function () {
      const id = "abcd";
      const pathIdMap = new Map<string, string>();
      pathIdMap.set(id, "/default");
      this.env.userAgent.recentlyPickedDirectoryMap.set(
        this.env.origin,
        pathIdMap,
      );

      expect(
        determineDirectoryPickerStartIn(id, undefined, this.env),
      ).toBe("/default");
    },
  );

  it<Context>(
    "should return recently picked directory path",
    function () {
      const pathIdMap = new Map<string, string>();
      pathIdMap.set("", "/default");
      this.env.userAgent.recentlyPickedDirectoryMap.set(
        this.env.origin,
        pathIdMap,
      );

      expect(
        determineDirectoryPickerStartIn(undefined, undefined, this.env),
      ).toBe("/default");
    },
  );

  it<Context>(
    "should return parent local file system path via file handle",
    function () {
      const fileSystemHandle = createNewFileSystemHandle(
        {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path/to",
        },
        new List(["dir", "file.txt"]),
        "file",
      );

      expect(
        determineDirectoryPickerStartIn(undefined, fileSystemHandle, this.env),
      ).toBe("/path/to/dir");
    },
  );

  it<Context>(
    "should return local file system path via directory handle",
    function () {
      const fileSystemHandle = createNewFileSystemHandle(
        {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path/to",
        },
        new List(["dir", "file.txt"]),
        "directory",
      );

      expect(
        determineDirectoryPickerStartIn(undefined, fileSystemHandle, this.env),
      ).toBe("/path/to/dir/file.txt");
    },
  );

  it<Context>(
    "should skip file system handle if this is in bucket file system",
    function () {
      const fileSystemHandle = createNewFileSystemHandle(
        {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path/to",
        },
        new List(["", "dir", "file.txt"]),
        "directory",
      );

      expect(
        determineDirectoryPickerStartIn(undefined, fileSystemHandle, this.env),
      ).toBe(this.env.userAgent.defaultPath);
    },
  );
});

describe("rememberPickedDirectory", () => {
  interface Context {
    env: Environment;
  }
  beforeEach<Context>(function () {
    this.env = {
      origin: {},
      userAgent: {
        defaultPath: "/",
        locateEntry() {
          return null;
        },
        openDirectoryDialog() {
          return null;
        },
        openFileDialog() {
          return null;
        },
        openSaveFileDialog() {
          return null;
        },
        requestPermissionToUse() {
          return "granted";
        },
        recentlyPickedDirectoryMap: new Map(),
        wellKnownDirectories: {
          desktop: "/desktop",
          documents: "/documents",
          downloads: "/downloads",
          music: "/music",
          pictures: "/pictures",
          videos: "/videos",
        },
      },
    } satisfies Environment;
  });

  it<Context>(
    "should add recently picked directory if id does not provide",
    function () {
      rememberPickedDirectory(undefined, {
        fileSystem: {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path",
        },
        kind: "file",
        path: new List(["file.txt"]),
      }, this.env);

      expect(
        this.env.userAgent.recentlyPickedDirectoryMap.get(this.env.origin)!.get(
          "",
        ),
      ).toBe("/path");
    },
  );

  it<Context>(
    "should add recently picked directory if id does not provide 2",
    function () {
      rememberPickedDirectory(undefined, {
        fileSystem: {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path",
        },
        kind: "file",
        path: new List(["dir", "file.txt"]),
      }, this.env);

      expect(
        this.env.userAgent.recentlyPickedDirectoryMap.get(this.env.origin)!.get(
          "",
        ),
      ).toBe("/path/dir");
    },
  );

  it<Context>(
    "should add recently picked directory if id does not provide 3",
    function () {
      rememberPickedDirectory(undefined, {
        fileSystem: {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path",
        },
        kind: "directory",
        path: new List(["dir", "file.txt"]),
      }, this.env);

      expect(
        this.env.userAgent.recentlyPickedDirectoryMap.get(this.env.origin)!.get(
          "",
        ),
      ).toBe("/path/dir/file.txt");
    },
  );

  it<Context>(
    "should add recently picked directory if id provided",
    function () {
      const id = "abc";
      rememberPickedDirectory(id, {
        fileSystem: {
          locateEntry() {
            return null;
          },
          observations: new Set(),
          root: "/path",
        },
        kind: "directory",
        path: new List(["dir", "file.txt"]),
      }, this.env);

      expect(
        this.env.userAgent.recentlyPickedDirectoryMap.get(this.env.origin)!.get(
          id,
        ),
      ).toBe("/path/dir/file.txt");
    },
  );
});
