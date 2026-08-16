/**
 * theme:validate — CLI script to validate theme tokens.
 * FND-THEME-06, FND-THEME-11
 *
 * Usage: pnpm theme:validate [path/to/project]
 *   If no path is given, defaults to examples/reference-site.
 *
 * Validates:
 *   - Schema conformance (FND-THEME-03) — hard failure
 *   - WCAG contrast ratios (FND-THEME-06, FND-A11Y-04) — error
 *   - Focus visibility (FND-THEME-06) — error
 */

import { resolve, join } from "node:path";
import { loadThemeTokens } from "../packages/astro-foundation/src/theme/loader.ts";
import { ACTIVE_THEME_VERSION } from "../packages/astro-foundation/src/theme/active-theme.ts";
import { validateThemeSemantics } from "../packages/astro-foundation/src/theme/validate-theme.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";

const args = process.argv.slice(2);
const projectPath = args[0] || "examples/reference-site";
const rootDir = resolve(import.meta.dirname ?? ".", "..");
const absProjectPath = resolve(rootDir, projectPath);

const themeVersionDir = join(absProjectPath, "src", "theme", "versions", ACTIVE_THEME_VERSION);

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
