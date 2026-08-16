/**
 * generate:redirects — FND-ENV-10, FND-I18N-07
 *
 * Generates redirect files from routes with previousSlugs.
 * Usage: pnpm generate:redirects [path/to/project] [--format json|cloudflare|vercel]
 */
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateRedirects,
  formatRedirectsJson,
  formatRedirectsCloudflare,
  formatRedirectsVercel,
} from "../packages/astro-foundation/src/seo/redirects.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const formatArg = args.find((a) => a.startsWith("--format="))?.split("=")[1] ?? "json";
const targetArg = args.find((a) => !a.startsWith("--"));
const resolvedTarget = targetArg
  ? resolve(MONO_ROOT, targetArg)
  : resolve(MONO_ROOT, "examples", "reference-site");

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
  previousSlugs?: Record<string, string[]>;
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

const redirects = generateRedirects(routes, config.site, localeCodes, defaultLocale.code);

// --- Output ---
const distDir = resolve(resolvedTarget, "dist");
mkdirSync(distDir, { recursive: true });

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

const outputPath = resolve(distDir, fileName);
writeFileSync(outputPath, output, "utf-8");

if (redirects.length === 0) {
  console.log(`✓ generate:redirects — no previousSlugs found, empty ${fileName} written`);
} else {
  console.log(`✓ generate:redirects — ${redirects.length} redirect(s) written to ${fileName}`);
  for (const r of redirects) {
    console.log(`  ${r.from} → ${r.to} (${r.status})`);
  }
}
