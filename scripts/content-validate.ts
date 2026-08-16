/**
 * content:validate — FND-I18N-08, FND-I18N-10, FND-DATA-04, FND-DATA-05,
 * FND-LIFE-01 through FND-LIFE-09.
 *
 * Validates content files against route definitions and config. Lifecycle
 * checks (route binding, SEO schema, status, translation-state required
 * fields, source-digest staleness, locale parity) are delegated to the
 * package's `validateContent` so there is one source of truth. UI-string
 * completeness (FND-I18N-08) is checked here, as it reads JSON dictionaries.
 *
 * Usage: pnpm content:validate [path/to/project] [--json]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { FoundationConfig, FoundationIssue } from "../packages/astro-foundation/src/index.ts";
import { validateContent, type ContentFile } from "../packages/astro-foundation/src/validators/validate-content.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const jsonFlag = args.includes("--json");
const targetArg = args.find((a) => !a.startsWith("--"));
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
    ruleId: "FND-DATA-03",
    severity: "error",
    filePath: resolvedTarget,
    offendingValue: "No foundation.config.ts found",
    fix: "Create a foundation.config.ts at the project root",
  });
  outputAndExit();
}

let config: FoundationConfig;
try {
  const mod = await import(configFilePath!);
  config = mod.default ?? mod["config"];
  if (!config) throw new Error("No config export found");
} catch (err: unknown) {
  const msg = String((err as Error)?.message || err);
  issues.push({
    ruleId: "FND-DATA-03",
    severity: "error",
    filePath: configFilePath,
    offendingValue: `Failed to load config: ${msg.slice(0, 200)}`,
  });
  outputAndExit();
}

const localeCodes = config.locales.locales.map((l) => l.code);

// --- Load routes ---
const routesPath = resolve(resolvedTarget, "src/data/routes.ts");
let routes: { key: string; slugs: Record<string, string | undefined>; parent?: string }[] = [];
if (existsSync(routesPath)) {
  try {
    const mod = await import(routesPath);
    routes = (mod.routes ?? []) as typeof routes;
  } catch {
    issues.push({
      ruleId: "FND-DATA-03",
      severity: "warning",
      filePath: routesPath,
      offendingValue: "Failed to load routes.ts",
    });
  }
}

// --- Load content pages (keep raw so the package can compute source digests) ---
const pagesDir = resolve(resolvedTarget, "src/content/pages");
const contentFiles: ContentFile[] = [];

if (existsSync(pagesDir)) {
  for (const file of readdirSync(pagesDir).filter((f) => f.endsWith(".md"))) {
    const fullPath = join(pagesDir, file);
    const raw = readFileSync(fullPath, "utf-8");
    contentFiles.push({ filePath: fullPath, frontmatter: parseFrontmatter(raw), raw });
  }
}

/** Minimal frontmatter parser (YAML subset — flat key: value only). */
function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result: Record<string, unknown> = {};
  for (const line of match[1]!.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();
    if (value === "" || value === undefined) continue;
    if (typeof value === "string") {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      } else if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      }
    }
    result[key] = value;
  }
  return result;
}

// --- FND-I18N-08: UI strings completeness (JSON dictionaries, not Markdown) ---
function validateUiStrings() {
  const uiDir = resolve(resolvedTarget, "src/content/ui");
  if (!existsSync(uiDir)) return;

  const uiFiles = readdirSync(uiDir).filter((f) => f.endsWith(".json"));
  const allKeys = new Map<string, Set<string>>();
  let referenceKeys: Set<string> | undefined;

  for (const file of uiFiles) {
    const locale = file.replace(".json", "");
    const data = JSON.parse(readFileSync(join(uiDir, file), "utf-8")) as Record<string, unknown>;
    const keys = new Set(Object.keys(data));
    allKeys.set(locale, keys);
    if (localeCodes.includes(locale) && !referenceKeys) referenceKeys = keys;
  }
  if (!referenceKeys) return;

  for (const lc of localeCodes) {
    const localeKeys = allKeys.get(lc);
    if (!localeKeys) {
      issues.push({
        ruleId: "FND-I18N-08",
        severity: "error",
        filePath: uiDir,
        offendingValue: `Missing UI strings file for locale "${lc}"`,
        expectedValue: `content/ui/${lc}.json must exist`,
        fix: `Create content/ui/${lc}.json with all UI strings`,
        docAnchor: "#FND-I18N-08",
      });
      continue;
    }
    for (const key of referenceKeys) {
      if (!localeKeys.has(key)) {
        issues.push({
          ruleId: "FND-I18N-08",
          severity: "error",
          filePath: join(uiDir, `${lc}.json`),
          offendingValue: `Missing UI key: "${key}"`,
          expectedValue: "All locales must have the same set of UI string keys",
          fix: `Add "${key}" to content/ui/${lc}.json`,
          docAnchor: "#FND-I18N-08",
        });
      }
    }
  }
}

// --- Delegate lifecycle/route/seo/staleness/parity checks to the package ---
issues.push(...validateContent({ config, routes, contentFiles }));

validateUiStrings();

// --- Output ---
function outputAndExit() {
  if (jsonFlag) {
    console.log(JSON.stringify(issues, null, 2));
  } else if (issues.length > 0) {
    console.error(formatIssues(issues));
  } else {
    console.log("✓ content:validate — no issues found");
  }
  const hasErrors = issues.some((i) => i.severity === "error");
  process.exit(hasErrors ? 1 : 0);
}

outputAndExit();
