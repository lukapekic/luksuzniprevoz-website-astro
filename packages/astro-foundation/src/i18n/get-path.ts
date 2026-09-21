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
  /** Optional full path segments for routes whose canonical URL is nested. */
  pathSegments?: Record<string, readonly string[] | undefined>;
};

/** Resolve the locale-owned path segments while keeping `slugs` authoritative. */
export function getRoutePathSegments(route: RouteRef, locale: LocaleCode): string[] {
  const slug = route.slugs[locale];
  if (slug === undefined) {
    throw new Error(`No slug for route "${route.key}" in locale "${locale}"`);
  }
  if (slug === "") return [];

  const configured = route.pathSegments?.[locale];
  if (!configured) return [slug];
  if (configured.length === 0 || configured.at(-1) !== slug) {
    throw new Error(
      `Route "${route.key}" pathSegments for locale "${locale}" must end with slug "${slug}"`,
    );
  }
  return [...configured];
}

/** Resolve one route record without requiring a generated RouteKey cast. */
export function resolveRoutePath(
  route: RouteRef,
  locale: LocaleCode,
  defaultLocale: LocaleCode,
): string {
  const prefix = locale === defaultLocale ? [] : [locale];
  const segments = [...prefix, ...getRoutePathSegments(route, locale)];
  return segments.length === 0 ? "/" : `/${segments.join("/")}/`;
}

/**
 * Resolves the full URL path for a route in a given locale.
 * FND-I18N-03: URLs come from the route map, never from folder names.
 * FND-I18N-04: trailingSlash is always "always" — all paths end with "/".
 * FND-TYPE-02: `routeKey` is typed as the generated `RouteKey` union, so a
 * typo like `getPath("destinaton", …)` is a compile error.
 *
 * @param routeKey - Stable route identifier (must be a known RouteKey)
 * @param locale - Target locale code
 * @param routes - Full route map (Zod-validated `Route[]` or compatible)
 * @param defaultLocale - Default locale code (unprefixed URLs)
 * @returns Full path like "/en/destination-transportation/" or "/destinacija/"
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

  return resolveRoutePath(route, locale, defaultLocale);
}
