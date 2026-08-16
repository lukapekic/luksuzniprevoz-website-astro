import type { LocaleCode } from "./schema.ts";
import type { RouteKey } from "../generated/types.ts";

/**
 * Minimal structural shape `getPath` needs from a route entry: a stable key
 * and a locale→slug map. Accepting this (readonly) supertype lets callers
 * pass either a Zod-validated `Route[]` or a hand-written route table whose
 * `slugs` is a plain `Record`.
 */
export type RouteRef = {
  key: string;
  slugs: Record<string, string | undefined>;
};

/**
 * Resolves the full URL path for a route in a given locale.
 * FND-I18N-03: URLs come from the route map, never from folder names.
 * FND-I18N-04: trailingSlash is always "always" — all paths end with "/".
 * FND-TYPE-02: `routeKey` is typed as the generated `RouteKey` union, so a
 * typo like `getPath("aiport", …)` is a compile error.
 *
 * @param routeKey - Stable route identifier (must be a known RouteKey)
 * @param locale - Target locale code
 * @param routes - Full route map (Zod-validated `Route[]` or compatible)
 * @param defaultLocale - Default locale code (unprefixed URLs)
 * @returns Full path like "/en/airport-transportation/" or "/aerodromski-prevoz/"
 */
export function getPath(
  routeKey: RouteKey,
  locale: LocaleCode,
  routes: readonly RouteRef[],
  defaultLocale: LocaleCode,
): string {
  const route = routes.find((r) => r.key === routeKey);
  if (!route) {
    throw new Error(`Route not found: ${routeKey}`);
  }

  const slug = route.slugs[locale];
  if (slug === undefined) {
    throw new Error(`No slug for route "${routeKey}" in locale "${locale}"`);
  }

  // FND-I18N-04: trailingSlash "always"
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  // Empty slug means root (home) — avoid double slashes
  const segment = slug === "" ? "" : `/${slug}`;
  return `${prefix}${segment}/`;
}
