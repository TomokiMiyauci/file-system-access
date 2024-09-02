export function isTooSensitiveOrDangerous(): boolean {
  return false;
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
export function isValidSuffixCodePoints(codePoint: number): boolean {
  if (isAsciiAlphanumeric(codePoint)) return true;

  // U+002B ('+')
  if (codePoint === 0x002B) return true;

  // U+002E ('.')
  if (codePoint === 0x002E) return true;

  return false;
}
