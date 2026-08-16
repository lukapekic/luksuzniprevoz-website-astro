import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ThemeTokensSchema, CURRENT_SCHEMA_VERSION, type ThemeTokens } from "./schema.ts";
import { reportIssue, type FoundationIssue } from "../core/errors.ts";

const TOKEN_FILES = [
  "manifest.json",
  "palette.json",
  "typography.json",
  "spacing.json",
  "radii.json",
  "motion.json",
  "layout.json",
] as const;

export interface LoadThemeOptions {
  /**
   * Absolute path to the theme version directory that contains token JSON files.
   * e.g. /path/to/src/theme/versions/version-1
   */
  themeDir: string;
}

/**
 * Loads all theme token files from a version directory, validates against the schema,
 * and returns the parsed tokens.
 *
 * FND-THEME-03: schemaVersion mismatch is a hard failure (FND-DX-01 error).
 */
export function loadThemeTokens(opts: LoadThemeOptions): {
  tokens: ThemeTokens;
  issues: FoundationIssue[];
} {
  const { themeDir } = opts;
  const issues: FoundationIssue[] = [];
  const raw: Record<string, unknown> = {};

  // Pre-check schemaVersion from manifest first (hard fail)
  const manifestPath = join(themeDir, "manifest.json");
  try {
    const manifestRaw = JSON.parse(readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
    if (
      typeof manifestRaw["schemaVersion"] === "number" &&
      manifestRaw["schemaVersion"] !== CURRENT_SCHEMA_VERSION
    ) {
      issues.push({
        ruleId: "FND-THEME-03",
        severity: "error",
        filePath: manifestPath,
        offendingValue: `schemaVersion is ${String(manifestRaw["schemaVersion"])}`,
        expectedValue: `schemaVersion must be ${CURRENT_SCHEMA_VERSION}`,
        docAnchor: "§8.3",
      });
      return { tokens: {} as ThemeTokens, issues };
    }
  } catch {
    // manifest parse failure will be caught by the full validation below
  }

  // Load all token files
  for (const file of TOKEN_FILES) {
    const filePath = join(themeDir, file);
    try {
      const content = readFileSync(filePath, "utf-8");
      const key = file.replace(".json", "");
      raw[key] = JSON.parse(content) as unknown;
    } catch (err) {
      issues.push({
        ruleId: "FND-THEME-03",
        severity: "error",
        filePath,
        offendingValue: `Failed to read/parse ${file}: ${err instanceof Error ? err.message : String(err)}`,
        fix: `Ensure ${file} exists and is valid JSON`,
        docAnchor: "§8.3",
      });
    }
  }

  if (issues.length > 0) {
    return { tokens: {} as ThemeTokens, issues };
  }

  // Full schema validation
  const result = ThemeTokensSchema.safeParse(raw);

  if (!result.success) {
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      issues.push({
        ruleId: "FND-THEME-03",
        severity: "error",
        filePath: themeDir,
        offendingValue: `${path}: ${issue.message}`,
        fix: "Fix the token file to match the schema",
        docAnchor: "§8.3",
      });
    }
    return { tokens: {} as ThemeTokens, issues };
  }

  return { tokens: result.data, issues: [] };
}

/**
 * Loads theme tokens and throws on any errors.
 * Convenience wrapper for programmatic usage.
 */
export function loadThemeTokensOrThrow(opts: LoadThemeOptions): ThemeTokens {
  const { tokens, issues } = loadThemeTokens(opts);
  if (issues.length > 0) {
    throw new Error(`Theme loading failed:\n${issues.map((i) => reportIssue(i)).join("\n")}`);
  }
  return tokens;
}
