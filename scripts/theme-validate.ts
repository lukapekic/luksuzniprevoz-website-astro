/**
 * theme:validate — CLI script to validate theme tokens.
 * FND-THEME-06, FND-THEME-11
 *
 * Usage: pnpm theme:validate [path/to/project]
 *   If no path is given, defaults to site/luksuzni-prevoz.
 *
 * Validates:
 *   - Schema conformance (FND-THEME-03) — hard failure
 *   - WCAG contrast ratios (FND-THEME-06, FND-A11Y-04) — error
 *   - Focus visibility (FND-THEME-06) — error
 */

import { resolve, join } from "node:path";
import { existsSync } from "node:fs";
import { loadThemeTokens } from "../packages/astro-foundation/src/theme/loader.ts";
import { validateThemeSemantics } from "../packages/astro-foundation/src/theme/validate-theme.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";

const args = process.argv.slice(2);
const projectPath = args[0] || "site/luksuzni-prevoz";
const rootDir = resolve(import.meta.dirname ?? ".", "..");
const absProjectPath = resolve(rootDir, projectPath);

// Resolve the active theme version from the target project's foundation.config.ts.
// Each site MUST select its own theme — there is no shared fallback.
// A missing config, missing activeThemeVersion, or load failure is a hard error.
async function resolveActiveThemeVersion(projectDir: string): Promise<string> {
  const candidates = [
    join(projectDir, "foundation.config.ts"),
    join(projectDir, "src", "foundation.config.ts"),
  ];
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      `Cannot resolve active theme: no foundation.config.ts found at:\n` +
        candidates.map((p) => `  - ${p}`).join("\n") +
        `\nEach site must define activeThemeVersion in its own foundation.config.ts.`,
    );
  }
  try {
    const mod = await import(found);
    const cfg = mod.default ?? mod["config"];
    if (cfg && typeof cfg.activeThemeVersion === "string" && cfg.activeThemeVersion) {
      return cfg.activeThemeVersion;
    }
    throw new Error(
      `activeThemeVersion is missing or empty in ${found}.\n` +
        `Each site must explicitly select its theme version.`,
    );
  } catch (error) {
    if (error.message?.includes("activeThemeVersion")) throw error;
    throw new Error(
      `Failed to load foundation config from ${found}: ${error.message}\n` +
        `Ensure the file is valid TypeScript and exports a config with activeThemeVersion.`,
    );
  }
}

const activeThemeVersion = await resolveActiveThemeVersion(absProjectPath);
const themeVersionDir = join(absProjectPath, "src", "theme", "versions", activeThemeVersion);

if (!existsSync(themeVersionDir)) {
  console.error(
    `✖ Configured activeThemeVersion "${activeThemeVersion}" has no theme directory at:\n` +
      `  ${themeVersionDir}\n` +
      `  Check that the version exists in src/theme/versions/.`,
  );
  process.exit(1);
}

console.log(`Validating theme tokens from: ${themeVersionDir}`);

const { tokens, issues: schemaIssues } = loadThemeTokens({ themeDir: themeVersionDir });

const allIssues = [...schemaIssues];

if (schemaIssues.length === 0) {
  // Run semantic validation
  const semanticIssues = validateThemeSemantics(tokens);
  allIssues.push(...semanticIssues);
}

if (allIssues.length > 0) {
  console.error(formatIssues(allIssues));

  const errors = allIssues.filter((i) => i.severity === "error").length;
  if (errors > 0) {
    console.error(`
✖ Theme validation failed with ${errors} error(s).`);
    process.exit(1);
  }

  console.warn(`\n⚠ Theme validation passed with warnings.`);
  process.exit(0);
}

console.log("✓ Theme validation passed — no issues found.");
process.exit(0);
