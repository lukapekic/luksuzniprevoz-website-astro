/**
 * og:generate — FND-SEO-07.
 *
 * Generates OG images (1200×630) for every indexable route × locale combination
 * on the target site. Emits PNGs when a font is available (satori + resvg);
 * otherwise SVG previews. Files are written to dist/og/<locale>/<route>.{png|svg}.
 *
 * A font is loaded from src/theme/fonts/ if present (place a `sans.ttf` and
 * optional `sans-bold.ttf` there). Without a font, SVG previews are written
 * (FND-SEO-08: the file-exists validator still passes; a host image service
 * can rasterize them, or they serve as a visual check).
 *
 * Usage: pnpm og:generate [path/to/project]
 */
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateOgImage,
  validateFontScriptCoverage,
} from "../packages/astro-foundation/src/seo/og.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const targetArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const resolvedTarget = targetArg
  ? resolve(MONO_ROOT, targetArg)
  : resolve(MONO_ROOT, "site", "luksuzni-prevoz");

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
let config: {
  capabilities: { ogImages: string };
  site: string;
  brand: string;
  locales: { locales: Array<{ code: string }> };
};
try {
  const mod = await import(configFilePath);
  config = (mod.default ?? mod["config"]) as typeof config;
  if (!config) throw new Error("No config export found");
} catch (err: unknown) {
  console.error(`✖ Failed to load config: ${String((err as Error)?.message || err).slice(0, 200)}`);
  process.exit(1);
}

if (config.capabilities.ogImages !== "generated") {
  console.log('⊘ og:generate skipped — capabilities.ogImages is not "generated"');
  process.exit(0);
}

// --- Load routes ---
const routesPath = resolve(resolvedTarget, "src/data/routes.ts");
let routes: Array<{ key: string; slugs: Record<string, string | undefined>; noindex?: boolean }> =
  [];
if (existsSync(routesPath)) {
  const mod = await import(routesPath);
  routes = (mod.routes ?? []) as typeof routes;
}

// --- Load a font (optional) ---
const fontsDir = resolve(resolvedTarget, "src/theme/fonts");
function loadFont(name: string): ArrayBuffer | undefined {
  const p = join(fontsDir, name);
  if (!existsSync(p)) return undefined;
  try {
    const buf = readFileSync(p);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    return undefined;
  }
}
const font = loadFont("sans.ttf");
const fontBold = loadFont("sans-bold.ttf");

if (!font) {
  console.warn("⚠ No font at src/theme/fonts/sans.ttf — writing SVG previews (not PNGs).");
  console.warn("  Place a sans-serif TTF there to enable PNG generation (satori + resvg).");
}

// --- Font script coverage (FND-SEO-07) ---
const localeCodes = config.locales.locales.map((l) => l.code);
const fontIssues = validateFontScriptCoverage(localeCodes, ["Latin"]);
if (fontIssues.length > 0) {
  console.warn("⚠ Font script coverage issues:");
  for (const issue of fontIssues) console.warn(`  ${issue.locale}: ${issue.message}`);
}

// --- Resolve active theme version from the project's foundation.config.ts ---
// Each site MUST select its own theme — there is no shared fallback.
let activeThemeVersion: string | undefined;
for (const p of [
  resolve(resolvedTarget, "foundation.config.ts"),
  resolve(resolvedTarget, "src", "foundation.config.ts"),
]) {
  if (!existsSync(p)) continue;
  try {
    const mod = await import(p);
    const cfg = (mod.default ?? mod["config"]) as { activeThemeVersion?: string };
    if (cfg?.activeThemeVersion) {
      activeThemeVersion = cfg.activeThemeVersion;
      break;
    }
  } catch {
    /* continue to error below */
  }
}
if (!activeThemeVersion) {
  console.error(
    `✖ Cannot resolve active theme: no foundation.config.ts with activeThemeVersion found for ${resolvedTarget}.\n` +
      `  Each site must define activeThemeVersion in its own foundation.config.ts.`,
  );
  process.exit(1);
}

// --- Theme colors (from the active theme's palette) ---
// Supports two palette schemas:
//   - Flat semantic tokens (Luxury site V1/V2): { background, textPrimary, accent }
//   - Nested modes.light (legacy V1): { modes: { light: { surface: { base }, text: { primary }, accent: { primary } } } }
let theme: { background?: string; foreground?: string; accent?: string } = {};
const palettePath = resolve(
  resolvedTarget,
  "src/theme/versions",
  activeThemeVersion,
  "palette.json",
);
if (existsSync(palettePath)) {
  try {
    const palette = JSON.parse(readFileSync(palettePath, "utf-8"));
    // Flat semantic token schema (Luxury site V1/V2)
    if (palette.background && palette.textPrimary && palette.accent) {
      theme = {
        background: palette.background,
        foreground: palette.textPrimary,
        accent: palette.accent,
      };
    }
    // Nested modes.light schema (legacy V1 palette)
    else if (palette.modes?.light) {
      const light = palette.modes.light;
      theme = {
        background: light.surface?.base,
        foreground: light.text?.primary,
        accent: light.accent?.primary,
      };
    }
  } catch {
    /* fall back to defaults */
  }
}

// --- Enumerate pages and generate ---
const ogDir = resolve(resolvedTarget, "dist/og");
mkdirSync(ogDir, { recursive: true });
let generated = 0;
let skipped = 0;

for (const route of routes) {
  if (route.noindex) {
    skipped++;
    continue;
  }
  for (const locale of config.locales.locales) {
    if (route.slugs[locale.code] === undefined) continue;

    // Derive a title from the UI dictionary key <routeKey>.title.
    const titleKey = `${route.key}.title`;
    let title = titleKey;
    const uiFile = resolve(resolvedTarget, "src/content/ui", `${locale.code}.json`);
    if (existsSync(uiFile)) {
      try {
        const dict = JSON.parse(readFileSync(uiFile, "utf-8"));
        if (dict[titleKey]) title = dict[titleKey];
      } catch {
        /* keep fallback */
      }
    }

    const outPath = join(ogDir, locale.code, `${route.key}.${font ? "png" : "svg"}`);
    const result = await generateOgImage({
      title,
      brand: config.brand,
      locale: locale.code,
      outputPath: outPath,
      theme,
      font,
      fontBold,
    });
    if (result.generated) generated++;
  }
}

console.log(
  `✓ og:generate — ${generated} image(s) written to dist/og/ (${font ? "PNG" : "SVG preview"}), ${skipped} noindex route(s) skipped.`,
);
