import { parseMediaType } from "@std/media-types/parse-media-type";

export interface MIMEType {
  type: string;
  subtype: string;
  essence: string;
  parameters: Record<string, string>;
}

/**
 * [MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/#parse-a-mime-type)
 */
export function parseMIMEType(input: string): MIMEType {
  const [essence, parameters = {}] = parseMediaType(input);
  const [type, subtype] = divideBy(essence, "/");

  return { type, subtype, essence, parameters };
}

function divideBy(input: string, divider: string): [string, string] {
  const [head, ...tails] = input.split(divider);

  return [head, tails.join("")];
}
