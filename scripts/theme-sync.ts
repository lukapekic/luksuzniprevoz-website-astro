/**
 * theme:sync — CLI script to generate CSS from theme tokens.
 * FND-THEME-07
 *
 * Usage: pnpm theme:sync [path/to/project]
 *   If no path is given, defaults to site/luksuzni-prevoz.
 *   Writes to <project>/src/theme/generated/theme.css.
 */

import { resolve, join } from "node:path";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { loadThemeTokens } from "../packages/astro-foundation/src/theme/loader.ts";
import { generateThemeCss } from "../packages/astro-foundation/src/theme/sync.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";
import { validateThemeSemantics } from "../packages/astro-foundation/src/theme/validate-theme.ts";

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

console.log(
  `\nTheme "${tokens.manifest.name}" v${tokens.manifest.themeVersion} synced successfully.`,
);
