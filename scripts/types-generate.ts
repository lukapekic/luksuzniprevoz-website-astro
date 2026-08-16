/**
 * types:generate — FND-TYPE-01, FND-TYPE-03, FND-TYPE-04
 *
 * Reads the reference site's foundation.config.ts and routes, then generates
 * src/generated/types.ts with machine-owned type definitions.
 *
 * Usage: pnpm types:generate [path/to/project]
 *   If no path is given, defaults to examples/reference-site
 */
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { FoundationConfig, FoundationIssue } from "../packages/astro-foundation/src/index.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const targetArg = process.argv[2];
const resolvedTarget = targetArg
  ? resolve(MONO_ROOT, targetArg)
  : resolve(MONO_ROOT, "examples", "reference-site");

const issues: FoundationIssue[] = [];

// --- Load config ---
let configFilePath: string | undefined;
for (const p of [
  resolve(resolvedTarget, "foundation.config.ts"),
  resolve(resolvedTarget, "src/foundation.config.ts"),
]) {
  if (existsSync(p)) {
    configFilePath = p;
    break;
  }
}

if (!configFilePath) {
  issues.push({
    ruleId: "FND-TYPE-01",
    severity: "error",
    filePath: resolvedTarget,
    offendingValue: "No foundation.config.ts found",
    fix: "Create a foundation.config.ts at the project root",
  });
  console.error(formatIssues(issues));
  process.exit(1);
}

let config: FoundationConfig;
try {
  const mod = await import(configFilePath);
  config = mod.default ?? mod["config"];
  if (!config) throw new Error("No config export found");
} catch (err: unknown) {
  const msg = String((err as Error)?.message || err);
  issues.push({
    ruleId: "FND-TYPE-01",
    severity: "error",
    filePath: configFilePath,
    offendingValue: `Failed to load config: ${msg.slice(0, 200)}`,
  });
  console.error(formatIssues(issues));
  process.exit(1);
}

const locales = config.locales.locales;
const localeCodes = locales.map((l) => l.code);

// --- Load routes ---
let routes: readonly { key: string; slugs: Record<string, string | undefined> }[] = [];
const routesPath = resolve(resolvedTarget, "src/data/routes.ts");
if (existsSync(routesPath)) {
  try {
    const mod = await import(routesPath);
    routes = mod.routes ?? [];
  } catch {
    issues.push({
      ruleId: "FND-TYPE-01",
      severity: "warning",
      filePath: routesPath,
      offendingValue: "Failed to load routes.ts",
    });
  }
}

const routeKeys = routes.map((r) => r.key);

// --- Load UI string keys ---
const uiKeys = new Set<string>();
const uiDir = resolve(resolvedTarget, "src/content/ui");
if (existsSync(uiDir)) {
  for (const file of readdirSync(uiDir).filter((f) => f.endsWith(".json"))) {
    try {
      const data = JSON.parse(readFileSync(join(uiDir, file), "utf-8")) as Record<string, unknown>;
      for (const key of Object.keys(data)) {
        uiKeys.add(key);
      }
    } catch {
      issues.push({
        ruleId: "FND-TYPE-01",
        severity: "warning",
        filePath: join(uiDir, file),
        offendingValue: "Failed to parse UI JSON file",
      });
    }
  }
}

// Fallback UI keys if none found
if (uiKeys.size === 0) {
  const defaultKeys = [
    "nav.menu",
    "nav.close",
    "nav.skipLink",
    "nav.language",
    "form.error.required",
    "form.error.email",
    "form.success",
    "footer.rights",
    "a11y.skipToContent",
  ];
  for (const k of defaultKeys) uiKeys.add(k);
}

// --- Load theme tokens → TokenName union (FND-THEME-08 / FND-TYPE-01) ---
// Token names mirror the CSS custom properties emitted by theme:sync:
// `--<group>-<key>` (e.g. --surface-base, --space-4, --text-primary, --radius-sm).
// Sanitized identically to theme:sync so `var(\`--${name}\`)` always resolves:
// a key like "0.5" (illegal `.` in a CSS ident) becomes "0_5".
const sanitizeIdent = (key: string): string => key.replace(/[^a-zA-Z0-9_-]/g, "_");
const tokenNames = new Set<string>();
const themeDir = resolve(
  resolvedTarget,
  "src/theme/versions",
  config.activeThemeVersion ?? "version-1",
);
if (existsSync(themeDir)) {
  const loadJson = (name: string): Record<string, unknown> | undefined => {
    const p = join(themeDir, name);
    if (!existsSync(p)) return undefined;
    try {
      return JSON.parse(readFileSync(p, "utf-8")) as Record<string, unknown>;
    } catch {
      issues.push({
        ruleId: "FND-TYPE-01",
        severity: "warning",
        filePath: p,
        offendingValue: `Failed to parse theme token file ${name}`,
      });
      return undefined;
    }
  };

  // Palette: surface/text/focus/accent/border subgroups → --<group>-<key>
  const palette = loadJson("palette.json");
  if (palette) {
    const modes = (palette["modes"] ?? {}) as Record<string, Record<string, Record<string, string>>>;
    // Use the first mode (light) — token names are mode-agnostic (only values differ).
    const firstMode = Object.values(modes)[0];
    if (firstMode) {
      for (const [group, keys] of Object.entries(firstMode)) {
        for (const key of Object.keys(keys)) {
          tokenNames.add(`${group}-${sanitizeIdent(key)}`);
        }
      }
    }
  }

  // Spacing: scale → --space-<key>
  const spacing = loadJson("spacing.json");
  if (spacing?.["scale"]) {
    for (const key of Object.keys(spacing["scale"] as Record<string, string>)) {
      tokenNames.add(`space-${sanitizeIdent(key)}`);
    }
  }

  // Radii: values → --radius-<key>
  const radii = loadJson("radii.json");
  if (radii?.["values"]) {
    for (const key of Object.keys(radii["values"] as Record<string, string>)) {
      tokenNames.add(`radius-${sanitizeIdent(key)}`);
    }
  }

  // Typography: fontFamilies → --font-<key>; fontSizes → --text-<key>;
  // fontWeights → --font-weight-<key>; lineHeights → --line-height-<key>
  const typo = loadJson("typography.json");
  if (typo) {
    for (const key of Object.keys((typo["fontFamilies"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`font-${sanitizeIdent(key)}`);
    }
    for (const key of Object.keys((typo["fontSizes"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`text-${sanitizeIdent(key)}`);
    }
    for (const key of Object.keys((typo["fontWeights"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`font-weight-${sanitizeIdent(key)}`);
    }
    for (const key of Object.keys((typo["lineHeights"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`line-height-${sanitizeIdent(key)}`);
    }
  }

  // Layout: containers → --container-<key>; gutters → --gutter-<key>
  const layout = loadJson("layout.json");
  if (layout) {
    for (const key of Object.keys((layout["containers"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`container-${sanitizeIdent(key)}`);
    }
    for (const key of Object.keys((layout["gutters"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`gutter-${sanitizeIdent(key)}`);
    }
  }

  // Motion: durations → --duration-<key>; easings → --ease-<key>
  const motion = loadJson("motion.json");
  if (motion) {
    for (const key of Object.keys((motion["durations"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`duration-${sanitizeIdent(key)}`);
    }
    for (const key of Object.keys((motion["easings"] ?? {}) as Record<string, string>)) {
      tokenNames.add(`ease-${sanitizeIdent(key)}`);
    }
  }
}

// --- StructuredData types ---
const structuredDataTypes = config.capabilities.structuredData;

// --- Island events (FND-ARCH-05) ---
const defaultEvents = ["nav:toggle", "dialog:close", "form:submitted"];

// --- RouteLocales: per-route locale availability ---
function buildRouteLocales(
  routeList: readonly { key: string; slugs: Record<string, string | undefined> }[],
  locCodes: string[],
): string {
  const lines: string[] = ["  {"];
  for (const route of routeList) {
    const availableLocales = locCodes.filter((lc) => route.slugs[lc] !== undefined);
    if (availableLocales.length === 0) continue;
    const localeUnion = availableLocales.map((lc) => `"${lc}"`).join(" | ");
    lines.push(`    ${route.key}: ${localeUnion};`);
  }
  lines.push("  }");
  return lines.join("\n");
}

// --- Generate the file ---
function escapeForUnion(str: string): string {
  return `"${str}"`;
}

const localeUnion = localeCodes.map(escapeForUnion).join(" | ");
const routeKeyUnion = routeKeys.map(escapeForUnion).join(" | ");
const uiKeyUnion = [...uiKeys].sort().map(escapeForUnion).join(" | ");
const tokenNameUnion = [...tokenNames].sort().map(escapeForUnion).join(" | ");
const sdUnion =
  structuredDataTypes.length > 0 ? structuredDataTypes.map(escapeForUnion).join(" | ") : "never";
const eventUnion = defaultEvents.map(escapeForUnion).join(" | ");
const routeLocales = buildRouteLocales(routes, localeCodes);

const output = `// src/foundation/generated/types.ts — machine-owned
// DO NOT EDIT — generated by types:generate
// Generated at: ${new Date().toISOString()}

/** Locale codes from foundation.config.ts */
export type LocaleCode = ${localeUnion};

/** Route keys from the route map */
export type RouteKey = ${routeKeyUnion || "never"};

/** UI string keys from content/ui/*.json */
export type UiStringKey = ${uiKeyUnion};

/** Structured data types from capabilities.structuredData */
export type StructuredDataType = ${sdUnion};

/** Island event names (FND-ARCH-05) */
export type IslandEvent = ${eventUnion};

/** Per-route locale availability — only locales with a published slug */
export type RouteLocales = ${routeLocales};

/**
 * Theme token names from the active theme version (FND-THEME-08 / FND-TYPE-01).
 * Each name is the CSS custom-property stem after \`--\` (e.g. "surface-base",
 * "space-4", "text-primary"). Use \`var(\`--\${name}\`)\` to reference a token.
 */
export type TokenName = ${tokenNameUnion || "never"};
`;

// Write to the package's generated directory
const outDir = resolve(MONO_ROOT, "packages", "astro-foundation", "src", "generated");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "types.ts");
writeFileSync(outFile, output, "utf-8");

if (issues.length > 0) {
  console.warn(formatIssues(issues));
}

console.log(
  `✓ types:generate — wrote ${outFile} (${routeKeys.length} routes, ${localeCodes.length} locales, ${uiKeys.size} UI keys, ${tokenNames.size} tokens)`,
);
