/**
 * OG Image Generation — FND-SEO-07
 *
 * Build-time OG image generator that creates 1200x630 social cards.
 * This module provides the full interface; the actual pixel rendering
 * can be implemented with @vercel/og, satori + resvg, or similar.
 *
 * For now, this generates an SVG-based OG card and documents
 * the PNG conversion step as a stub.
 */

// --- Types ---

export interface OgImageOptions {
  /** Page title */
  title: string;
  /** Brand name */
  brand: string;
  /** Optional eyebrow text (e.g., category, tagline) */
  eyebrow?: string;
  /** Locale code (for font selection and RTL) */
  locale: string;
  /** Output path for the generated image */
  outputPath: string;
  /** Theme colors */
  theme?: {
    background?: string;
    foreground?: string;
    accent?: string;
  };
  /**
   * Font data for PNG rendering (satori requires at least one font as an
   * ArrayBuffer). When omitted, the generator falls back to writing an SVG
   * (the consumer's image service can rasterize it, or it serves as a
   * debuggable preview). Provide a sans-serif font that covers the scripts
   * used by `locale` (validated by validateFontScriptCoverage).
   */
  font?: ArrayBuffer;
  /** Optional bold-weight font for satori (used for the title). */
  fontBold?: ArrayBuffer;
}

export interface OgCacheEntry {
  /** Content hash used as cache key */
  hash: string;
  /** Path to the generated file */
  filePath: string;
  /** Title that was used */
  title: string;
  /** Brand that was used */
  brand: string;
  /** Locale that was used */
  locale: string;
  /** Eyebrow that was used */
  eyebrow?: string;
}

export interface OgGeneratorResult {
  /** Whether the image was generated (false = served from cache) */
  generated: boolean;
  /** Path to the output file */
  filePath: string;
  /** Cache key used */
  cacheKey: string;
}

// --- Template version for cache invalidation ---

const OG_TEMPLATE_VERSION = "1";

// --- Content hashing for caching ---

/**
 * Generates a cache key from content parameters.
 * Uses simple string hashing (djb2) to avoid crypto dependency.
 */
export function ogContentHash(title: string, locale: string, eyebrow?: string): string {
  const raw = `${title}|${locale}|${eyebrow || ""}|v${OG_TEMPLATE_VERSION}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash + raw.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash).toString(36);
}

// --- Font script coverage validation (FND-SEO-07) ---

/**
 * Mapping of locale scripts to required Unicode ranges.
 * Used to validate that configured fonts cover the needed scripts.
 */
const LOCALE_SCRIPT_MAP: Record<string, string> = {
  sr: "Latin",
  ru: "Cyrillic",
  uk: "Cyrillic",
  bg: "Cyrillic",
  mk: "Cyrillic",
  be: "Cyrillic",
  en: "Latin",
  de: "Latin",
  fr: "Latin",
  es: "Latin",
  it: "Latin",
  pt: "Latin",
  nl: "Latin",
  pl: "Latin",
  cs: "Latin",
  sk: "Latin",
  hr: "Latin",
  sl: "Latin",
  tr: "Latin",
  ar: "Arabic",
  he: "Hebrew",
  ja: "CJK",
  ko: "CJK",
  zh: "CJK",
  th: "Thai",
  el: "Greek",
};

export interface FontCoverageIssue {
  locale: string;
  script: string;
  message: string;
}

/**
 * Validates that configured fonts cover the scripts needed by the given locales.
 * FND-SEO-07: Specifically checks Cyrillic coverage requirement.
 *
 * @param locales - Locale codes used by the site
 * @param fontScripts - Scripts that the configured font family supports
 * @returns Array of issues (empty = all covered)
 */
export function validateFontScriptCoverage(
  locales: string[],
  fontScripts: string[],
): FontCoverageIssue[] {
  const issues: FontCoverageIssue[] = [];
  const requiredScripts = new Set<string>();

  for (const locale of locales) {
    const script = LOCALE_SCRIPT_MAP[locale];
    if (script) {
      requiredScripts.add(script);
    } else {
      issues.push({
        locale,
        script: "Unknown",
        message: `Locale "${locale}" has no known script mapping; verify font coverage manually`,
      });
    }
  }

  const fontScriptSet = new Set(fontScripts.map((s) => s.toLowerCase()));
  for (const script of requiredScripts) {
    if (!fontScriptSet.has(script.toLowerCase())) {
      // Find which locale(s) need this script
      const affectedLocales = locales.filter((l) => LOCALE_SCRIPT_MAP[l] === script);
      issues.push({
        locale: affectedLocales.join(", "),
        script,
        message: `Font does not cover "${script}" script needed by locale(s): ${affectedLocales.join(", ")}`,
      });
    }
  }

  return issues;
}

// --- SVG OG card generation ---

/**
 * Generates an SVG-based OG card (1200x630).
 * This is a lightweight fallback; production sites should use
 * @vercel/og (satori) or similar for proper text rendering.
 */
export function generateOgSvg(opts: {
  title: string;
  brand: string;
  eyebrow?: string;
  theme?: { background?: string; foreground?: string; accent?: string };
}): string {
  const bg = opts.theme?.background ?? "#0F172A";
  const fg = opts.theme?.foreground ?? "#F8FAFC";
  const accent = opts.theme?.accent ?? "#38BDF8";

  // Truncate title for display
  const maxTitleLen = 50;
  const displayTitle =
    opts.title.length > maxTitleLen ? opts.title.slice(0, maxTitleLen) + "…" : opts.title;

  const yBase = opts.eyebrow ? 280 : 310;

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.85" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" rx="0"/>
  <rect x="80" y="80" width="6" height="470" fill="${accent}" rx="3"/>
  ${opts.eyebrow ? `<text x="110" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="${accent}" font-weight="500" letter-spacing="2">${escapeXml(opts.eyebrow)}</text>` : ""}
  <text x="110" y="${yBase}" font-family="system-ui, -apple-system, sans-serif" font-size="64" fill="${fg}" font-weight="700">${escapeXml(displayTitle)}</text>
  <text x="110" y="${yBase + 60}" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="${fg}" opacity="0.7">${escapeXml(opts.brand)}</text>
  <rect x="80" y="560" width="1040" height="1" fill="${fg}" opacity="0.1"/>
</svg>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// --- Main OG image generator ---

/**
 * Generates an OG image for a page (1200×630).
 *
 * Flow:
 * 1. Compute content hash from title + locale + eyebrow + template version
 * 2. Check cache (if provided)
 * 3. If a font is supplied → render a PNG via satori + @resvg/resvg-js
 *    Otherwise → write the SVG card (a debuggable preview / rasterize-on-host fallback)
 * 4. Write to the output path
 *
 * satori needs real font data (an ArrayBuffer) — system fonts don't work. The
 * caller supplies the font so the template doesn't bundle a multi-megabyte TTF.
 * validateFontScriptCoverage() checks the font covers the locale's script.
 */
export async function generateOgImage(
  opts: OgImageOptions,
  cache?: Map<string, OgCacheEntry>,
): Promise<OgGeneratorResult> {
  const cacheKey = ogContentHash(opts.title, opts.locale, opts.eyebrow);
  const hasFont = opts.font !== undefined;
  const ext = hasFont ? ".png" : ".svg";
  const filePath = opts.outputPath.endsWith(ext)
    ? opts.outputPath
    : opts.outputPath.replace(/\.[^.]+$/, "") + ext;

  // Check cache
  if (cache?.has(cacheKey)) {
    return {
      generated: false,
      filePath: (cache.get(cacheKey) as OgCacheEntry).filePath,
      cacheKey,
    };
  }

  const { writeFileSync, mkdirSync } = await import("node:fs");
  const { dirname: pathDirname } = await import("node:path");
  mkdirSync(pathDirname(filePath), { recursive: true });

  if (hasFont) {
    // Real PNG path: satori renders the card JSX → SVG, resvg rasterizes → PNG.
    const satori = (await import("satori")).default;
    const { Resvg } = await import("@resvg/resvg-js");

    const bg = opts.theme?.background ?? "#0F172A";
    const fg = opts.theme?.foreground ?? "#F8FAFC";
    const accent = opts.theme?.accent ?? "#38BDF8";
    const maxTitleLen = 50;
    const displayTitle =
      opts.title.length > maxTitleLen ? opts.title.slice(0, maxTitleLen) + "…" : opts.title;

    const fonts: Array<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }> = [
      { name: "sans", data: opts.font!, weight: 400, style: "normal" },
    ];
    if (opts.fontBold)
      fonts.push({ name: "sans", data: opts.fontBold, weight: 700, style: "normal" });

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            background: bg,
            padding: 80,
            justifyContent: "center",
          },
          children: [
            ...(opts.eyebrow
              ? [
                  {
                    type: "div",
                    props: {
                      style: { color: accent, fontSize: 24, fontWeight: 500, letterSpacing: 2 },
                      children: opts.eyebrow,
                    },
                  },
                ]
              : []),
            {
              type: "div",
              props: {
                style: {
                  color: fg,
                  fontSize: 64,
                  fontWeight: 700,
                  marginTop: opts.eyebrow ? 40 : 0,
                },
                children: displayTitle,
              },
            },
            {
              type: "div",
              props: {
                style: { color: fg, fontSize: 28, opacity: 0.7, marginTop: 30 },
                children: opts.brand,
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts,
      },
    );

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
    const pngData = resvg.render().asPng();
    writeFileSync(filePath, pngData);
  } else {
    // SVG fallback (no font supplied): the existing lightweight card.
    const svg = generateOgSvg({
      title: opts.title,
      brand: opts.brand,
      eyebrow: opts.eyebrow,
      theme: opts.theme,
    });
    writeFileSync(filePath, Buffer.from(svg, "utf-8"));
  }

  // Update cache
  const entry: OgCacheEntry = {
    hash: cacheKey,
    filePath,
    title: opts.title,
    brand: opts.brand,
    locale: opts.locale,
    eyebrow: opts.eyebrow,
  };
  cache?.set(cacheKey, entry);

  return {
    generated: true,
    filePath,
    cacheKey,
  };
}

// --- Filter pages that need OG generation ---

/**
 * Filters pages to only those that need OG image generation.
 * A page needs OG generation when:
 * - Its route has ogImages: "generated" in capabilities
 * - The page is indexable (not noindex, is published)
 */
export function pagesNeedingOgGeneration(
  pages: Array<{
    routeKey: string;
    locale: string;
    title: string;
    noindex?: boolean;
    published?: boolean;
  }>,
  routeCapabilities: Record<string, string[]>,
): Array<{ routeKey: string; locale: string; title: string }> {
  return pages.filter((page) => {
    if (page.noindex || page.published === false) return false;
    const caps = routeCapabilities[page.routeKey];
    return caps?.includes("ogImages:generated");
  });
}
