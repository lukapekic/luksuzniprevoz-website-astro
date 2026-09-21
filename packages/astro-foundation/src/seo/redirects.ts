/**
 * Redirect generator — FND-ENV-10, FND-I18N-07
 *
 * Generates redirects from routes with previousSlugs.
 * Supports multiple output formats: JSON, _redirects (Cloudflare), vercel.json.
 */
import { resolveRoutePath } from "../i18n/get-path.ts";

export interface RedirectEntry {
  /** Source path (old URL) */
  from: string;
  /** Target path (new URL) */
  to: string;
  /** HTTP status code */
  status: 301;
}

export interface RouteWithPreviousSlugs {
  key: string;
  slugs: Record<string, string | undefined>;
  pathSegments?: Record<string, readonly string[] | undefined>;
  previousSlugs?: Record<string, string[]>;
}

const canonicalRedirectPath = (value: string): string => {
  const path = value.split(/[?#]/, 1)[0] ?? value;
  if (path === "/") return path;
  return `${path.replace(/\/+$/, "")}/`;
};

/**
 * Rejects ambiguous or inefficient redirect sets before deployment.
 * Slash/no-slash source variants are treated as the same URL when checking
 * self-loops and chains, while exact duplicate Cloudflare rules remain errors.
 */
export function assertRedirectsValid(redirects: readonly RedirectEntry[]): void {
  const exactSources = new Set<string>();
  const canonicalSources = new Set(redirects.map((redirect) => canonicalRedirectPath(redirect.from)));

  for (const redirect of redirects) {
    if (exactSources.has(redirect.from)) {
      throw new Error(`Duplicate redirect source: ${redirect.from}`);
    }
    exactSources.add(redirect.from);

    const sourcePath = canonicalRedirectPath(redirect.from);
    const targetPath = canonicalRedirectPath(redirect.to);
    if (sourcePath === targetPath) {
      throw new Error(`Redirect loop: ${redirect.from} → ${redirect.to}`);
    }
    if (canonicalSources.has(targetPath)) {
      throw new Error(`Redirect chain: ${redirect.from} → ${redirect.to}`);
    }
  }
}

/**
 * Generates redirect entries from routes that have previousSlugs.
 *
 * @param routes - Route definitions with previousSlugs
 * @param site - Base site URL (e.g., "https://example.com")
 * @param localeCodes - All locale codes
 * @param defaultLocaleCode - The default locale code (no prefix in URL)
 */
export function generateRedirects(
  routes: RouteWithPreviousSlugs[],
  site: string,
  localeCodes: string[],
  defaultLocaleCode: string,
): RedirectEntry[] {
  void site;
  const redirects: RedirectEntry[] = [];

  for (const route of routes) {
    if (!route.previousSlugs) continue;

    for (const locale of localeCodes) {
      const currentSlug = route.slugs[locale];
      if (currentSlug === undefined) continue;

      const prevSlugs = route.previousSlugs[locale];
      if (!prevSlugs || prevSlugs.length === 0) continue;

      const toUrl = resolveRoutePath(route, locale, defaultLocaleCode);
      const prefix = locale === defaultLocaleCode ? "" : `/${locale}`;

      for (const prevSlug of prevSlugs) {
        const prevSegment = prevSlug === "" ? "" : `/${prevSlug}`;
        const fromUrl = `${prefix}${prevSegment}/`;

        redirects.push({
          from: fromUrl,
          to: toUrl,
          status: 301,
        });
      }
    }
  }

  return redirects;
}

/**
 * Formats redirects as a JSON array.
 * Output format: { redirects: RedirectEntry[] }
 */
export function formatRedirectsJson(redirects: RedirectEntry[]): string {
  return JSON.stringify({ redirects }, null, 2);
}

/**
 * Formats redirects for Cloudflare _redirects file.
 * Format: /from /to 301
 */
export function formatRedirectsCloudflare(redirects: RedirectEntry[]): string {
  return redirects.map((r) => `${r.from} ${r.to} ${r.status}`).join("\n");
}

/**
 * Formats redirects for Vercel vercel.json.
 * Format: { redirects: [{ source, destination, permanent }] }
 */
export function formatRedirectsVercel(redirects: RedirectEntry[]): string {
  const vercelRedirects = redirects.map((r) => ({
    source: r.from,
    destination: r.to,
    permanent: r.status === 301,
  }));
  return JSON.stringify({ redirects: vercelRedirects }, null, 2);
}
