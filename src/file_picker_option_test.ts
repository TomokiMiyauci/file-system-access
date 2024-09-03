import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { validateSuffix } from "./file_picker_option.ts";

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
