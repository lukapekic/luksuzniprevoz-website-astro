/**
 * theme:sync — Generates CSS from validated theme tokens.
 * FND-THEME-07, FND-CSS-04
 */

import type { ThemeTokens } from "./schema.ts";

/**
 * Convert a camelCase or kebab-case key to a CSS custom property name.
 * e.g. "on-accent" → "--on-accent", "fontSizes" → "--font-sizes"
 *
 * Sanitizes characters that are illegal in a CSS custom-property name.
 * Per the CSS spec, a custom property name is `--` followed by an
 * `<ident-token>`, which permits letters, digits, hyphens, underscores, and
 * non-ASCII — but NOT a `.`. A fractional spacing key like "0.5" would
 * produce `--space-0.5`, which is invalid and silently dropped by
 * lightningcss/browsers. We map any character outside the allowed set to
 * `_`, so "0.5" → "0_5" and the token becomes `--space-0_5`.
 */
function sanitizeIdent(key: string): string {
  return key.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function toCssVar(group: string, key: string): string {
  // Already kebab-case (e.g. on-accent, ring-offset)
  return `--${group}-${sanitizeIdent(key)}`;
}

/**
 * Generate CSS custom property declarations for a flat object.
 */
function generateProperties(obj: Record<string, string>, group: string): string[] {
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const cssKey = toCssVar(group, key);
    lines.push(`  ${cssKey}: ${value};`);
  }
  return lines;
}

/**
 * Generate the full theme CSS from validated tokens.
 * Output uses @layer theme (FND-CSS-04), scoped by [data-theme].
 */
export function generateThemeCss(tokens: ThemeTokens): string {
  const sections: string[] = [];
  const modes = Object.entries(tokens.palette.modes);

  // ── :root with color-scheme and base typography ──
  const rootLines: string[] = [
    "  color-scheme: light dark;",
    `  font-family: var(--font-${Object.keys(tokens.typography.fontFamilies)[0] ?? "sans"});`,
    "  font-size: var(--text-base);",
    "  line-height: var(--line-height-normal);",
  ];
  sections.push(`  :root {\n${rootLines.join("\n")}\n  }`);

  // ── Per-mode color tokens ──
  for (const [modeName, colors] of modes) {
    const lines: string[] = [];

    // Surface, text, focus, accent, border groups
    const colorGroups: Array<[string, Record<string, string>]> = [
      ["surface", colors.surface],
      ["text", colors.text],
      ["focus", colors.focus],
      ["accent", colors.accent],
      ["border", colors.border],
    ];

    for (const [group, values] of colorGroups) {
      for (const [key, value] of Object.entries(values)) {
        lines.push(`  --${group}-${key}: ${value};`);
      }
    }

    sections.push(`  [data-theme="${modeName}"] {\n${lines.join("\n")}\n  }`);
  }

  // ── prefers-color-scheme: dark fallback (when no data-theme set) ──
  const darkMode = tokens.palette.modes["dark"];
  if (darkMode) {
    const darkLines: string[] = [];
    const colorGroups: Array<[string, Record<string, string>]> = [
      ["surface", darkMode.surface],
      ["text", darkMode.text],
      ["focus", darkMode.focus],
      ["accent", darkMode.accent],
      ["border", darkMode.border],
    ];
    for (const [group, values] of colorGroups) {
      for (const [key, value] of Object.entries(values)) {
        darkLines.push(`    --${group}-${key}: ${value};`);
      }
    }
    sections.push(
      `  @media (prefers-color-scheme: dark) {\n    :root:not([data-theme]) {\n${darkLines.join("\n")}\n    }\n  }`,
    );
  }

  // ── Typography ──
  const typoLines: string[] = [];
  for (const [key, value] of Object.entries(tokens.typography.fontFamilies)) {
    typoLines.push(`  --font-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontSizes)) {
    typoLines.push(`  --text-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.fontWeights)) {
    typoLines.push(`  --font-weight-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.typography.lineHeights)) {
    typoLines.push(`  --line-height-${key}: ${value};`);
  }
  sections.push(`  :root {\n${typoLines.join("\n")}\n  }`);

  // ── Spacing ──
  const spacingLines = generateProperties(tokens.spacing.scale, "space");
  sections.push(`  :root {\n${spacingLines.join("\n")}\n  }`);

  // ── Radii ──
  const radiiLines = generateProperties(tokens.radii.values, "radius");
  sections.push(`  :root {\n${radiiLines.join("\n")}\n  }`);

  // ── Layout ──
  const layoutLines: string[] = [];
  for (const [key, value] of Object.entries(tokens.layout.containers)) {
    layoutLines.push(`  --container-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.layout.gutters)) {
    layoutLines.push(`  --gutter-${key}: ${value};`);
  }
  sections.push(`  :root {\n${layoutLines.join("\n")}\n  }`);

  // ── Motion ──
  const motionLines: string[] = [];
  for (const [key, value] of Object.entries(tokens.motion.durations)) {
    motionLines.push(`  --duration-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(tokens.motion.easings)) {
    motionLines.push(`  --ease-${key}: ${value};`);
  }
  sections.push(`  :root {\n${motionLines.join("\n")}\n  }`);

  // ── Reduced motion override ──
  const reducedLines: string[] = [];
  for (const [key, value] of Object.entries(tokens.motion.reduced.durations)) {
    reducedLines.push(`    --duration-${key}: ${value};`);
  }
  sections.push(
    `  @media (prefers-reduced-motion: reduce) {\n    :root {\n${reducedLines.join("\n")}\n    }\n  }`,
  );

  // Assemble
  const header = [
    "/* Auto-generated by theme:sync — DO NOT EDIT MANUALLY */",
    `/* Theme: ${tokens.manifest.name} v${tokens.manifest.themeVersion} */`,
    "",
  ].join("\n");

  const body = sections.join("\n\n");

  return `${header}@layer theme {\n${body}\n}\n`;
}
