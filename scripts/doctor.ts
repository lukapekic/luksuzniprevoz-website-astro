import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import {
  FoundationConfigSchema,
  type FoundationIssue,
} from "../packages/astro-foundation/src/core/index.js";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

// --- CLI arg handling ---
const targetArg = process.argv[2];
const resolvedTarget = targetArg ? resolve(MONO_ROOT, targetArg) : MONO_ROOT;

const issues: FoundationIssue[] = [];

// --- FND-CAP-01: Locate foundation.config.ts ---
// Support both: a directory (look for foundation.config.ts) or a direct .ts file
let configPaths: string[];
if (existsSync(resolvedTarget) && resolvedTarget.endsWith(".ts")) {
  configPaths = [resolvedTarget];
} else {
  configPaths = [
    resolve(resolvedTarget, "foundation.config.ts"),
    resolve(resolvedTarget, "src/foundation.config.ts"),
  ];
}

let rawConfig: unknown;
let configFilePath: string | undefined;

for (const p of configPaths) {
  if (existsSync(p)) {
    configFilePath = p;
    break;
  }
}

if (configFilePath) {
  try {
    // tsx handles TS imports natively — this script runs via tsx
    const mod = await import(configFilePath);
    rawConfig = mod.default ?? mod["config"];
    if (!rawConfig) {
      issues.push({
        ruleId: "FND-CAP-01",
        severity: "error",
        filePath: configFilePath,
        offendingValue: "No default or named 'config' export found",
        fix: "Export your config as `export default defineFoundationConfig(...)`",
      });
    }
  } catch (err: unknown) {
    const msg = String((err as Error)?.message || err);
    if (
      msg.includes("too_small") ||
      msg.includes("at least 2") ||
      msg.includes("Exactly one locale must be isDefault")
    ) {
      issues.push({
        ruleId: "FND-CAP-04",
        severity: "error",
        filePath: configFilePath,
        offendingValue: "Config has fewer than 2 locales",
        expectedValue:
          "At least 2 locales required (use single-language setup only for prototyping)",
        fix: "Add at least one more locale to foundation.config.ts, or remove i18n entirely for single-language prototypes",
        docAnchor: "#FND-CAP-04",
      });
    } else {
      issues.push({
        ruleId: "FND-CAP-01",
        severity: "error",
        filePath: configFilePath,
        offendingValue: `Failed to load or parse config: ${msg.slice(0, 200)}`,
        fix: "Ensure your foundation.config.ts is valid and exports a FoundationConfig",
      });
    }
  }
} else {
  issues.push({
    ruleId: "FND-CAP-01",
    severity: "error",
    filePath: "foundation.config.ts",
    offendingValue: "No foundation.config.ts found",
    fix: "Create a foundation.config.ts at the project root",
  });
}

// --- Validate loaded config with Zod ---
if (rawConfig && !issues.some((i) => i.ruleId === "FND-CAP-01")) {
  const parsed = FoundationConfigSchema.safeParse(rawConfig);
  if (!parsed.success) {
    for (const err of parsed.error.issues) {
      const pathStr = err.path.join(".");
      const isMinLocales =
        pathStr.includes("locales") &&
        (err.message.includes("at least 2") || err.code === "too_small");

      if (isMinLocales) {
        issues.push({
          ruleId: "FND-CAP-04",
          severity: "error",
          filePath: configFilePath,
          offendingValue: "Config has fewer than 2 locales",
          expectedValue: "At least 2 locales required",
          fix: "Add at least one more locale to foundation.config.ts",
          docAnchor: "#FND-CAP-04",
        });
      } else {
        issues.push({
          ruleId: "FND-CAP-01",
          severity: "error",
          filePath: configFilePath,
          offendingValue: `${pathStr}: ${err.message}`,
        });
      }
    }
  } else {
    const cfg = parsed.data;

    // FND-SEO-02: fail when site is unset or placeholder
    if (cfg.site === "" || cfg.site === "https://example.com") {
      issues.push({
        ruleId: "FND-SEO-02",
        severity: "error",
        filePath: configFilePath,
        offendingValue: `site is placeholder: ${cfg.site}`,
        expectedValue: "A real production URL",
        fix: "Set `site` to your actual domain in foundation.config.ts",
        docAnchor: "#FND-SEO-02",
      });
    }
  }
}

// --- FND-I18N-04: assert astro.config.mjs uses trailingSlash:"always" + build.format:"directory" ---
const astroConfigPath = resolve(resolvedTarget, "astro.config.mjs");
if (existsSync(astroConfigPath)) {
  try {
    const astroMod = await import(astroConfigPath);
    const astroCfg = (astroMod.default ?? astroMod) as {
      trailingSlash?: string;
      build?: { format?: string };
    };
    if (astroCfg.trailingSlash !== "always") {
      issues.push({
        ruleId: "FND-I18N-04",
        severity: "error",
        filePath: astroConfigPath,
        offendingValue: `trailingSlash is "${astroCfg.trailingSlash}"`,
        expectedValue: 'trailingSlash: "always"',
        fix: 'Set trailingSlash: "always" in astro.config.mjs',
        docAnchor: "#FND-I18N-04",
      });
    }
    if (astroCfg.build?.format !== "directory") {
      issues.push({
        ruleId: "FND-I18N-04",
        severity: "error",
        filePath: astroConfigPath,
        offendingValue: `build.format is "${astroCfg.build?.format}"`,
        expectedValue: 'build.format: "directory"',
        fix: 'Set build.format: "directory" in astro.config.mjs',
        docAnchor: "#FND-I18N-04",
      });
    }
  } catch (err: unknown) {
    issues.push({
      ruleId: "FND-I18N-04",
      severity: "warning",
      filePath: astroConfigPath,
      offendingValue: `Could not load astro.config.mjs to verify trailingSlash/format: ${String((err as Error)?.message || err).slice(0, 120)}`,
      fix: "Ensure astro.config.mjs is loadable",
      docAnchor: "#FND-I18N-04",
    });
  }
}

// --- FND-META-03: Check dependency versions ---
const nodeVersion = process.versions.node;
const nodeMajor = parseInt(nodeVersion.split(".")[0], 10);
// Spec supports both 20 LTS and 22 LTS; reject anything older than 20.
if (nodeMajor < 20) {
  issues.push({
    ruleId: "FND-META-03",
    severity: "error",
    offendingValue: `Node.js ${nodeVersion}`,
    expectedValue: "Node.js 20 LTS or 22 LTS",
    fix: "Upgrade Node.js — see .nvmrc",
    docAnchor: "#FND-META-03",
  });
}

function getWorkspaceVersion(pkgName: string): string | undefined {
  try {
    const pkgJson = JSON.parse(
      readFileSync(resolve(MONO_ROOT, "node_modules", pkgName, "package.json"), "utf-8"),
    );
    return pkgJson.version;
  } catch {
    return undefined;
  }
}

const depChecks: { name: string; pkg: string; minMajor: number; ruleId: string }[] = [
  { name: "Astro", pkg: "astro", minMajor: 5, ruleId: "FND-META-03" },
  { name: "Tailwind CSS", pkg: "tailwindcss", minMajor: 4, ruleId: "FND-META-03" },
  { name: "TypeScript", pkg: "typescript", minMajor: 5, ruleId: "FND-META-03" },
  { name: "Zod", pkg: "zod", minMajor: 3, ruleId: "FND-META-03" },
  { name: "Vitest", pkg: "vitest", minMajor: 3, ruleId: "FND-META-03" },
  { name: "Playwright", pkg: "@playwright/test", minMajor: 1, ruleId: "FND-META-03" },
  // Lighthouse CI is 0.x — minMajor 0 makes this a presence check.
  { name: "Lighthouse CI", pkg: "@lhci/cli", minMajor: 0, ruleId: "FND-META-03" },
];

for (const dep of depChecks) {
  const version = getWorkspaceVersion(dep.pkg);
  if (!version) {
    issues.push({
      ruleId: dep.ruleId,
      severity: "warning",
      offendingValue: `${dep.name}: not installed`,
      expectedValue: `${dep.name} ${dep.minMajor}.x installed`,
      fix: `Run pnpm add ${dep.pkg} in the appropriate workspace package`,
      docAnchor: "#FND-META-03",
    });
  } else {
    const major = parseInt(version.split(".")[0], 10);
    if (major < dep.minMajor) {
      issues.push({
        ruleId: dep.ruleId,
        severity: "error",
        offendingValue: `${dep.name}: ${version}`,
        expectedValue: `${dep.name} ${dep.minMajor}.x or later`,
        fix: `Upgrade ${dep.name} to ^${dep.minMajor}`,
        docAnchor: "#FND-META-03",
      });
    }
  }
}

// --- Output (FND-DX-04: proper exit codes) ---
if (issues.length > 0) {
  console.error(formatIssues(issues));
  const hasErrors = issues.some((i) => i.severity === "error");
  process.exit(hasErrors ? 1 : 0);
} else {
  console.log("✓ foundation:doctor — no issues found");
  process.exit(0);
}
