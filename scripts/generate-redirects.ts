/**
 * generate:redirects — FND-ENV-10, FND-I18N-07
 *
 * Generates redirect files from route previousSlugs plus an optional typed
 * src/data/legacy-urls.ts migration ledger.
 * Usage: pnpm generate:redirects [path/to/project] [--format=json|cloudflare|vercel] [--check]
 */
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateRedirects,
  assertRedirectsValid,
  formatRedirectsJson,
  formatRedirectsCloudflare,
  formatRedirectsVercel,
} from "../packages/astro-foundation/src/seo/redirects.ts";
import { resolveRoutePath } from "../packages/astro-foundation/src/i18n/get-path.ts";
import type { RedirectEntry } from "../packages/astro-foundation/src/seo/redirects.ts";
import { loadWorkspaceConfig, resolveWorkspaceProject } from "./lib/workspace-config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const workspace = loadWorkspaceConfig(MONO_ROOT);
const formatArg =
  args.find((a) => a.startsWith("--format="))?.split("=")[1] ??
  (workspace.redirects.enabled ? workspace.redirects.format : "json");
const checkOnly = args.includes("--check");
const targetArg = args.find((a) => !a.startsWith("--"));
const resolvedTarget = resolveWorkspaceProject(MONO_ROOT, targetArg);

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
  console.error("✖ No foundation.config.ts found");
  process.exit(1);
}

let config: { site: string; locales: { locales: Array<{ code: string; isDefault: boolean }> } };
try {
  const mod = await import(configFilePath);
  config = (mod.default ?? mod["config"]) as typeof config;
  if (!config) throw new Error("No config export found");
} catch (err: unknown) {
  const msg = String((err as Error)?.message || err);
  console.error(`✖ Failed to load config: ${msg.slice(0, 200)}`);
  process.exit(1);
}

// --- Load routes ---
const routesPath = resolve(resolvedTarget, "src/data/routes.ts");
let routes: Array<{
  key: string;
  slugs: Record<string, string | undefined>;
  pathSegments?: Record<string, readonly string[] | undefined>;
  previousSlugs?: Record<string, string[]>;
  availability?: "published" | "scaffold";
}> = [];

if (existsSync(routesPath)) {
  try {
    const mod = await import(routesPath);
    routes = (mod.routes ?? []) as typeof routes;
  } catch {
    // routes not found
  }
}

// --- Generate redirects ---
const localeCodes = config.locales.locales.map((l) => l.code);
const defaultLocale = config.locales.locales.find((l) => l.isDefault);
if (!defaultLocale) {
  console.error("✖ No default locale found");
  process.exit(1);
}

const redirects: RedirectEntry[] = generateRedirects(
  routes,
  config.site,
  localeCodes,
  defaultLocale.code,
);

// --- Optional site-owned legacy migration ledger ---
const legacyPath = resolve(resolvedTarget, "src/data/legacy-urls.ts");
if (existsSync(legacyPath)) {
  const legacy = (await import(legacyPath)) as {
    legacyRedirectRules?: Array<{
      from: string;
      target: { routeKey: string; locale: string; fragment?: string };
      reason: string;
    }>;
    pendingLegacyRedirects?: Array<{
      from: string;
      target: { routeKey: string; locale: string; fragment?: string };
      blockedBy: string;
    }>;
    legacyValidFragmentsByRoute?: Record<string, Set<string>>;
  };

  const sourceVariants = (source: string): string[] => {
    if (!source.startsWith("/") || source.includes("?") || source.includes("#")) {
      throw new Error(`Invalid legacy redirect source: ${source}`);
    }
    if (source === "/") return [source];
    return source.endsWith("/") ? [source, source.slice(0, -1)] : [source, `${source}/`];
  };

  for (const rule of legacy.legacyRedirectRules ?? []) {
    const targetRoute = routes.find((candidate) => candidate.key === rule.target.routeKey);
    if (!targetRoute)
      throw new Error(`Legacy redirect target route does not exist: ${rule.target.routeKey}`);
    if (targetRoute.availability !== "published") {
      throw new Error(
        `Legacy redirect target is not published: ${rule.from} → ${rule.target.routeKey}`,
      );
    }
    if (!localeCodes.includes(rule.target.locale)) {
      throw new Error(`Legacy redirect target locale is not configured: ${rule.target.locale}`);
    }
    if (
      rule.target.fragment &&
      !legacy.legacyValidFragmentsByRoute?.[rule.target.routeKey]?.has(rule.target.fragment)
    ) {
      throw new Error(
        `Legacy redirect fragment does not exist on its target: #${rule.target.fragment}`,
      );
    }
    const baseTarget = resolveRoutePath(targetRoute, rule.target.locale, defaultLocale.code);
    const destination = rule.target.fragment ? `${baseTarget}#${rule.target.fragment}` : baseTarget;
    for (const from of sourceVariants(rule.from)) {
      redirects.push({ from, to: destination, status: 301 });
    }
  }

  for (const pending of legacy.pendingLegacyRedirects ?? []) {
    const targetRoute = routes.find((candidate) => candidate.key === pending.target.routeKey);
    if (!targetRoute)
      throw new Error(`Pending legacy redirect target does not exist: ${pending.target.routeKey}`);
    if (targetRoute.availability === "published") {
      throw new Error(
        `Pending redirect target is now published; promote its rule: ${pending.from} → ${pending.target.routeKey}`,
      );
    }
  }
}

assertRedirectsValid(redirects);

// --- Output ---
const outputDir =
  formatArg === "cloudflare" ? resolve(resolvedTarget, "public") : resolve(resolvedTarget, "dist");
mkdirSync(outputDir, { recursive: true });

let output: string;
let fileName: string;

switch (formatArg) {
  case "cloudflare":
    output = formatRedirectsCloudflare(redirects);
    fileName = "_redirects";
    break;
  case "vercel":
    output = formatRedirectsVercel(redirects);
    fileName = "vercel.json";
    break;
  case "json":
  default:
    output = formatRedirectsJson(redirects);
    fileName = "redirects.json";
    break;
}

const outputPath = resolve(outputDir, fileName);
const normalizedOutput = output.length > 0 ? `${output}\n` : "";
if (checkOnly) {
  const current = existsSync(outputPath) ? readFileSync(outputPath, "utf-8") : "";
  if (current !== normalizedOutput) {
    console.error(`✖ generate:redirects --check — ${fileName} is missing or stale`);
    process.exit(1);
  }
} else {
  writeFileSync(outputPath, normalizedOutput, "utf-8");
}

if (checkOnly) {
  console.log(
    `✓ generate:redirects --check — ${redirects.length} redirect(s), ${fileName} is current`,
  );
} else if (redirects.length === 0) {
  console.log(`✓ generate:redirects — no previousSlugs found, empty ${fileName} written`);
} else {
  console.log(`✓ generate:redirects — ${redirects.length} redirect(s) written to ${fileName}`);
  for (const r of redirects) {
    console.log(`  ${r.from} → ${r.to} (${r.status})`);
  }
}
