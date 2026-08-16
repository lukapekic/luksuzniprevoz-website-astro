/**
 * theme:sync — CLI script to generate CSS from theme tokens.
 * FND-THEME-07
 *
 * Usage: pnpm theme:sync [path/to/project]
 *   If no path is given, defaults to examples/reference-site.
 *   Writes to <project>/src/theme/generated/theme.css.
 *   Also writes to packages/astro-foundation/src/theme/generated/theme.css as default.
 */

import { resolve, join } from "node:path";
import { writeFileSync, mkdirSync } from "node:fs";
import { loadThemeTokens } from "../packages/astro-foundation/src/theme/loader.ts";
import { ACTIVE_THEME_VERSION } from "../packages/astro-foundation/src/theme/active-theme.ts";
import { generateThemeCss } from "../packages/astro-foundation/src/theme/sync.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";
import { validateThemeSemantics } from "../packages/astro-foundation/src/theme/validate-theme.ts";

const args = process.argv.slice(2);
const projectPath = args[0] || "examples/reference-site";
const rootDir = resolve(import.meta.dirname ?? ".", "..");
const absProjectPath = resolve(rootDir, projectPath);

const themeVersionDir = join(absProjectPath, "src", "theme", "versions", ACTIVE_THEME_VERSION);

console.log(`Loading theme tokens from: ${themeVersionDir}`);

const { tokens, issues } = loadThemeTokens({ themeDir: themeVersionDir });

if (issues.length > 0) {
  console.error(formatIssues(issues));
  process.exit(1);
}

// Run semantic validation (warnings only — sync still proceeds)
const semanticIssues = validateThemeSemantics(tokens);
if (semanticIssues.length > 0) {
  console.warn(formatIssues(semanticIssues));
  console.warn("Semantic issues found but proceeding with CSS generation.");
}

const css = generateThemeCss(tokens);

// Write to project
const projectOutput = join(absProjectPath, "src", "theme", "generated", "theme.css");
mkdirSync(join(projectOutput, ".."), { recursive: true });
writeFileSync(projectOutput, css, "utf-8");
console.log(`✓ Wrote ${projectOutput}`);

// Write to core package default
const coreOutput = join(
  rootDir,
  "packages",
  "astro-foundation",
  "src",
  "theme",
  "generated",
  "theme.css",
);
mkdirSync(join(coreOutput, ".."), { recursive: true });
writeFileSync(coreOutput, css, "utf-8");
console.log(`✓ Wrote ${coreOutput}`);

console.log(
  `\nTheme "${tokens.manifest.name}" v${tokens.manifest.themeVersion} synced successfully.`,
);
