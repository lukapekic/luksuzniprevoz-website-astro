/** Escape HTML parser delimiters while retaining valid JSON and Unicode text. */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</gu, "\\u003c")
    .replace(/>/gu, "\\u003e")
    .replace(/&/gu, "\\u0026")
    .replace(/\u2028/gu, "\\u2028")
    .replace(/\u2029/gu, "\\u2029");
}
