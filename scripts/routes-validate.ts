/**
 * routes:validate — FND-I18N-04, FND-I18N-05, FND-I18N-06, FND-I18N-07, FND-I18N-09, FND-I18N-11, FND-SCALE-01
 *
 * Validates route definitions against the foundation config.
 *
 * Usage: pnpm routes:validate [path/to/project] [--json]
 */
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { FoundationConfig, FoundationIssue } from "../packages/astro-foundation/src/index.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const jsonFlag = args.includes("--json");
const targetArg = args.find((a) => !a.startsWith("--"));
const resolvedTarget = targetArg
  ? resolve(MONO_ROOT, targetArg)
  : resolve(MONO_ROOT, "site", "luksuzni-prevoz");

const issues: FoundationIssue[] = [];
const reportFilePath = resolvedTarget;

// --- Load config ---
let configFilePath: string | undefined;
let configSourceModule: string | undefined;

// If the target is a .ts file, try to load config from it directly
if (resolvedTarget.endsWith(".ts") && existsSync(resolvedTarget)) {
  configSourceModule = resolvedTarget;
} else {
  for (const p of [
    resolve(resolvedTarget, "foundation.config.ts"),
    resolve(resolvedTarget, "src/foundation.config.ts"),
  ]) {
    if (existsSync(p)) {
      configFilePath = p;
      break;
    }
  }
}

if (!configFilePath && !configSourceModule) {
  issues.push({
    ruleId: "FND-I18N-04",
    severity: "error",
    filePath: resolvedTarget,
    offendingValue: "No foundation.config.ts found",
    fix: "Create a foundation.config.ts at the project root",
  });
  outputAndExit();
}

const configImportPath = configFilePath ?? configSourceModule!;
let config: FoundationConfig;
try {
  const mod = await import(configImportPath);
  config = mod.default ?? mod["config"];
  if (!config) throw new Error("No config export found");
} catch (err: unknown) {
  const msg = String((err as Error)?.message || err);
  issues.push({
    ruleId: "FND-I18N-04",
    severity: "error",
    filePath: configImportPath,
    offendingValue: `Failed to load config: ${msg.slice(0, 200)}`,
  });
  outputAndExit();
}

const locales = config.locales.locales;
const localeCodes = locales.map((l) => l.code);
const defaultLocale = locales.find((l) => l.isDefault);
if (!defaultLocale) {
  issues.push({
    ruleId: "FND-I18N-04",
    severity: "error",
    filePath: configImportPath,
    offendingValue: "No default locale found",
  });
  outputAndExit();
}

// --- Load routes ---
type RouteInput = {
  key: string;
  slugs: Record<string, string | undefined>;
  parent?: string;
  noindex?: boolean;
  previousSlugs?: Record<string, string[]>;
};
let routes: RouteInput[] = [];

// Try loading routes from the same module (for test fixtures) or from src/data/routes.ts
if (configSourceModule) {
  try {
    const mod = await import(configSourceModule);
    routes = (mod.routes ?? []) as RouteInput[];
  } catch {
    // routes not in the module
  }
}

if (routes.length === 0) {
  const routesPath = resolve(resolvedTarget, "src/data/routes.ts");
  if (!existsSync(routesPath)) {
    issues.push({
      ruleId: "FND-I18N-04",
      severity: "error",
      filePath: "src/data/routes.ts",
      offendingValue: "Routes file not found",
      fix: "Create src/data/routes.ts with your route definitions",
    });
    outputAndExit();
  }
  try {
    const mod = await import(routesPath);
    routes = (mod.routes ?? []) as RouteInput[];
  } catch (err: unknown) {
    const msg = String((err as Error)?.message || err);
    issues.push({
      ruleId: "FND-I18N-04",
      severity: "error",
      filePath: routesPath,
      offendingValue: `Failed to load routes: ${msg.slice(0, 200)}`,
    });
    outputAndExit();
  }
}

// --- Validation functions ---

// FND-I18N-05: ASCII-normalized slugs
const asciiRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validateAsciiSlugs() {
  for (const route of routes) {
    for (const [locale, slug] of Object.entries(route.slugs)) {
      if (slug === "" || slug === undefined) continue;
      if (!asciiRegex.test(slug)) {
        issues.push({
          ruleId: "FND-I18N-05",
          severity: "error",
          filePath: reportFilePath,
          offendingValue: `Route "${route.key}", locale "${locale}" has non-ASCII slug: "${slug}"`,
          expectedValue: "Lowercase ASCII, hyphen-separated slug",
          fix: `Replace "${slug}" with an ASCII-only slug`,
          docAnchor: "#FND-I18N-05",
        });
      }
    }
  }
}

// FND-I18N-06: Full paths must be unique across the site
function validateUniquePaths() {
  const pathMap = new Map<string, { routeKey: string; locale: string }>();
  for (const route of routes) {
    for (const locale of localeCodes) {
      const slug = route.slugs[locale];
      if (slug === undefined) continue;

      const prefix = locale === defaultLocale.code ? "" : `/${locale}`;
      const segment = slug === "" ? "" : `/${slug}`;
      const path = `${prefix}${segment}/`;

      const existing = pathMap.get(path);
      if (existing) {
        issues.push({
          ruleId: "FND-I18N-06",
          severity: "error",
          filePath: reportFilePath,
          offendingValue: `Duplicate path "${path}" for routes "${existing.routeKey}" (${existing.locale}) and "${route.key}" (${locale})`,
          expectedValue: "Unique paths across all route × locale combinations",
          fix: "Change one of the slugs to avoid the collision",
          docAnchor: "#FND-I18N-06",
        });
      }
      pathMap.set(path, { routeKey: route.key, locale });
    }
  }
}

// FND-I18N-07: Slug changes need previousSlugs
function validatePreviousSlugs() {
  // Build the set of current live paths to detect collisions (FND-I18N-07):
  // a previous slug must not shadow any current route path, or the redirect
  // would loop / clobber a live page.
  const livePaths = new Set<string>();
  for (const route of routes) {
    for (const locale of localeCodes) {
      const slug = route.slugs[locale];
      if (slug === undefined) continue;
      const prefix = locale === defaultLocale.code ? "" : `/${locale}`;
      const segment = slug === "" ? "" : `/${slug}`;
      livePaths.add(`${prefix}${segment}/`);
    }
  }

  for (const route of routes) {
    if (route.previousSlugs) {
      for (const locale of Object.keys(route.previousSlugs)) {
        if (!localeCodes.includes(locale)) {
          issues.push({
            ruleId: "FND-I18N-07",
            severity: "error",
            filePath: reportFilePath,
            offendingValue: `Route "${route.key}" has previousSlugs for unknown locale "${locale}"`,
            expectedValue: `Locale code from config: ${localeCodes.join(", ")}`,
            fix: "Remove the unknown locale from previousSlugs",
            docAnchor: "#FND-I18N-07",
          });
        }
        for (const slug of route.previousSlugs[locale] ?? []) {
          if (!asciiRegex.test(slug)) {
            issues.push({
              ruleId: "FND-I18N-07",
              severity: "error",
              filePath: reportFilePath,
              offendingValue: `Route "${route.key}" previousSlug "${slug}" for locale "${locale}" is not ASCII`,
              expectedValue: "Lowercase ASCII, hyphen-separated",
              docAnchor: "#FND-I18N-07",
            });
          }
          // FND-I18N-07: previous slug must not collide with a current live path
          const prefix = locale === defaultLocale.code ? "" : `/${locale}`;
          const oldPath = `${prefix}/${slug}/`;
          if (livePaths.has(oldPath)) {
            issues.push({
              ruleId: "FND-I18N-07",
              severity: "error",
              filePath: reportFilePath,
              offendingValue: `Route "${route.key}" previousSlug "${slug}" for locale "${locale}" collides with current live path "${oldPath}"`,
              expectedValue: "Previous slugs must not shadow any current route path",
              fix: "Rename the current route that owns this path, or choose a different previous slug",
              docAnchor: "#FND-I18N-07",
            });
          }
        }
      }
    }
  }
}

// FND-I18N-09: Missing translation strategy is set correctly
function validateMissingTranslation() {
  const strategy = config.locales.missingTranslation;
  if (!strategy) {
    issues.push({
      ruleId: "FND-I18N-09",
      severity: "error",
      filePath: reportFilePath,
      offendingValue: "missingTranslation strategy is not set",
      expectedValue: "One of: omit, fallback, notFound",
      fix: "Set locales.missingTranslation in foundation.config.ts",
      docAnchor: "#FND-I18N-09",
    });
  } else if (strategy === "fallback" && !config.locales.fallbackLocale) {
    issues.push({
      ruleId: "FND-I18N-09",
      severity: "error",
      filePath: reportFilePath,
      offendingValue: "missingTranslation is 'fallback' but no fallbackLocale is set",
      expectedValue: "fallbackLocale must be set when using 'fallback' strategy",
      fix: "Set locales.fallbackLocale in foundation.config.ts",
      docAnchor: "#FND-I18N-09",
    });
  }
}

// FND-I18N-11: hreflang sets are reciprocal and self-inclusive
function validateHreflangReciprocity() {
  const xDefaultLocale = locales.find((l) => l.isXDefault);

  for (const route of routes) {
    if (route.noindex) continue;

    const availableLocales = localeCodes.filter((lc) => route.slugs[lc] !== undefined);

    if (availableLocales.length > 1) {
      // Every linked locale must have a resolvable hreflang value, or the
      // reciprocal link is broken (the partner page cannot link back).
      const hreflangValues = availableLocales.map((lc) => {
        const localeConfig = locales.find((l) => l.code === lc);
        return localeConfig?.hreflang;
      });
      const unique = new Set(hreflangValues);
      if (unique.size !== hreflangValues.length) {
        issues.push({
          ruleId: "FND-I18N-11",
          severity: "error",
          filePath: reportFilePath,
          offendingValue: `Route "${route.key}" has duplicate hreflang values across locales`,
          expectedValue: "Unique hreflang values for each locale",
          docAnchor: "#FND-I18N-11",
        });
      }
      for (const lc of availableLocales) {
        const loc = locales.find((l) => l.code === lc);
        if (!loc || !loc.hreflang) {
          issues.push({
            ruleId: "FND-I18N-11",
            severity: "error",
            filePath: reportFilePath,
            offendingValue: `Route "${route.key}" locale "${lc}" has no hreflang value; reciprocity broken`,
            expectedValue: "Every locale defines an hreflang value",
            fix: "Set hreflang on the locale in foundation.config.ts",
            docAnchor: "#FND-I18N-11",
          });
        }
      }
    }

    // FND-I18N-11: x-default is opt-in via isXDefault. If a locale is marked
    // isXDefault, it must actually have a slug for this route, or the x-default
    // link (which points at that locale) would be a dead link.
    if (xDefaultLocale && route.slugs[xDefaultLocale.code] === undefined) {
      issues.push({
        ruleId: "FND-I18N-11",
        severity: "warning",
        filePath: reportFilePath,
        offendingValue: `Route "${route.key}" — isXDefault locale "${xDefaultLocale.code}" has no slug; x-default omitted for this route`,
        expectedValue: "The isXDefault locale has a slug for every multi-locale route",
        fix: `Add a slug for locale "${xDefaultLocale.code}" to route "${route.key}", or unset isXDefault`,
        docAnchor: "#FND-I18N-11",
      });
    }
  }
}

// FND-SCALE-01: Scale envelope — warn at 80% route ceiling, fail above 30 per locale
const ROUTE_CEILING = 30;
const WARN_THRESHOLD = Math.floor(ROUTE_CEILING * 0.8);
function validateScaleEnvelope() {
  for (const locale of localeCodes) {
    const count = routes.filter((r) => r.slugs[locale] !== undefined).length;
    if (count > ROUTE_CEILING) {
      issues.push({
        ruleId: "FND-SCALE-01",
        severity: "error",
        filePath: reportFilePath,
        offendingValue: `Locale "${locale}" has ${count} routes (ceiling: ${ROUTE_CEILING})`,
        expectedValue: `Maximum ${ROUTE_CEILING} routes per locale`,
        fix: "Consider splitting into sub-sites or restructuring navigation",
        docAnchor: "#FND-SCALE-01",
      });
    } else if (count >= WARN_THRESHOLD) {
      issues.push({
        ruleId: "FND-SCALE-01",
        severity: "warning",
        filePath: reportFilePath,
        offendingValue: `Locale "${locale}" has ${count} routes (approaching ceiling: ${ROUTE_CEILING})`,
        expectedValue: `Below ${WARN_THRESHOLD} routes per locale for comfort`,
        docAnchor: "#FND-SCALE-01",
      });
    }
  }
}

// --- Run all validations ---
validateAsciiSlugs();
validateUniquePaths();
validatePreviousSlugs();
validateMissingTranslation();
validateHreflangReciprocity();
validateScaleEnvelope();

// --- Output (FND-DX-02: aggregate, FND-DX-03: --json, FND-DX-04: exit codes) ---
function outputAndExit() {
  if (jsonFlag) {
    console.log(JSON.stringify(issues, null, 2));
  } else if (issues.length > 0) {
    console.error(formatIssues(issues));
  } else {
    console.log("✓ routes:validate — no issues found");
  }

  const hasErrors = issues.some((i) => i.severity === "error");
  process.exit(hasErrors ? 1 : 0);
}

outputAndExit();
