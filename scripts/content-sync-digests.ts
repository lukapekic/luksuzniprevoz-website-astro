/**
 * content:sync-digests — FND-LIFE-07 helper.
 *
 * Recomputes the source digest for every route and writes the current value
 * into each translation's `sourceDigest` frontmatter field. Use this after
 * re-translating a stale entry (set translationState back to reviewed) so the
 * stored digest matches the source again.
 *
 * Idempotent: re-running only updates sourceDigest lines. It does NOT change
 * translationState — demoting a stale translation to "draft" remains a human
 * decision.
 *
 * Usage: pnpm content:sync-digests [path/to/project]
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  computeSourceDigest,
  extractBody,
  parseFrontmatter,
} from "../packages/astro-foundation/src/validators/validate-content.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");
const DEFAULT_LOCALE_FALLBACK = "sr";

const targetArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const resolvedTarget = targetArg
  ? resolve(MONO_ROOT, targetArg)
  : resolve(MONO_ROOT, "site", "luksuzni-prevoz");

const pagesDir = resolve(resolvedTarget, "src/content/pages");
if (!existsSync(pagesDir)) {
  console.error(`No content pages directory at ${pagesDir}`);
  process.exit(1);
}

interface Entry {
  path: string;
  raw: string;
  fm: Record<string, unknown>;
  fmText: string;
  body: string;
}

function parse(raw: string): { fm: Record<string, unknown>; fmText: string; body: string } {
  // Use the package's YAML parser for `fm` so nested editorial frontmatter
  // (hero/sections/faq/…) digests correctly; `computeSourceDigest` needs the
  // real structured object, not a flattened approximation. `fmText` is kept as
  // the raw YAML block for line-level field updates (sourceLocale/sourceDigest
  // are flat top-level fields).
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, fmText: "", body: raw };
  const fmText = m[1] ?? "";
  const body = extractBody(raw);
  const fm = parseFrontmatter(raw);
  return { fm, fmText, body };
}

const entries: Entry[] = [];
if (existsSync(pagesDir)) {
  const visit = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) {
        visit(p);
        continue;
      }
      if (!entry.endsWith(".md")) continue;
      const raw = readFileSync(p, "utf-8");
      const { fm, fmText, body } = parse(raw);
      entries.push({ path: p, raw, fm, fmText, body });
    }
  };
  visit(pagesDir);
}

// Group by routeKey; the source is the default-locale entry with no sourceLocale.
const configPath = [resolve(resolvedTarget, "foundation.config.ts"), resolve(resolvedTarget, "src/foundation.config.ts")].find(existsSync);
let defaultLocale = DEFAULT_LOCALE_FALLBACK;
if (configPath) {
  try {
    const mod = await import(configPath);
    const cfg = mod.default ?? mod.config;
    defaultLocale = cfg?.locales?.locales?.find((l: { isDefault: boolean }) => l.isDefault)?.code ?? DEFAULT_LOCALE_FALLBACK;
  } catch {
    // fall back to the constant
  }
}

const byRoute = new Map<string, Entry[]>();
for (const e of entries) {
  const rk = String(e.fm["routeKey"] ?? "");
  if (!rk) continue;
  if (!byRoute.has(rk)) byRoute.set(rk, []);
  byRoute.get(rk)!.push(e);
}

function setFmField(fmText: string, key: string, value: string): string {
  const lines = fmText.split("\n");
  let found = false;
  const out = lines.map((line) => {
    if (line.trim().startsWith(`${key}:`)) {
      found = true;
      return `${key}: ${value}`;
    }
    return line;
  });
  if (!found) {
    let insertAt = 1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i]!.trim().startsWith("locale:")) {
        insertAt = i + 1;
        break;
      }
    }
    out.splice(insertAt, 0, `${key}: ${value}`);
  }
  return out.join("\n");
}

let updated = 0;
for (const [, files] of byRoute) {
  const source = files.find(
    (e) => e.fm["sourceLocale"] === undefined || String(e.fm["sourceLocale"]) === String(e.fm["locale"]),
  );
  if (!source) continue;
  const digest = computeSourceDigest(source.fm, extractBody(source.raw));

  for (const e of files) {
    const locale = String(e.fm["locale"] ?? "");
    if (locale === defaultLocale && e.fm["sourceLocale"] === undefined) continue; // source itself
    const newFm = setFmField(setFmField(e.fmText, "sourceLocale", defaultLocale), "sourceDigest", digest);
    if (newFm !== e.fmText) {
      writeFileSync(e.path, `---\n${newFm}\n---\n${e.body}`);
      updated++;
    }
  }
}

console.log(`✓ content:sync-digests — ${updated} file(s) updated.`);
