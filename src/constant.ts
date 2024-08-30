export const enum Msg {
  InvalidId = "ID '{id}' contains invalid characters.",
  InvalidIdLength = "ID '{id}' cannot be longer than 32 characters.",
  InvalidSuffixNotStatsWithPeriod = "Extension '{suffix}' must start with '.'.",
  InvalidSuffixEndsWithPeriod = "Extension '{suffix}' must not end with '.'.",
  InvalidSuffix = "Extension '{suffix}' contains invalid characters.",
  InvalidSuffixLength =
    "Extension '{suffix}' cannot be longer than 16 characters.",
  AbortRequest = "The user aborted a request.",
}
