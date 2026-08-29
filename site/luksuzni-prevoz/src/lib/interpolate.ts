const TOKEN_PATTERN = /\{([a-zA-Z][a-zA-Z0-9]*)\}/gu;
const UNRESOLVED_TOKEN_PATTERN = /\{[a-zA-Z][a-zA-Z0-9]*\}/u;

export function interpolateTokens(
  template: string,
  values: Readonly<Record<string, string | number>>,
  context: string,
): string {
  const rendered = template.replace(TOKEN_PATTERN, (token, key: string) => {
    if (!(key in values)) {
      throw new Error(`Unknown interpolation token "${token}" in ${context}.`);
    }
    return String(values[key]);
  });

  if (UNRESOLVED_TOKEN_PATTERN.test(rendered)) {
    throw new Error(`Unresolved interpolation token remains in ${context}.`);
  }

  return rendered;
}
