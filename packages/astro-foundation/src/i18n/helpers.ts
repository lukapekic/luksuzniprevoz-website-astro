import type { Route, LocaleCode, Locale } from "./schema.ts";
import type { RouteKey } from "../generated/types.ts";
import { getPath } from "./get-path.ts";

/** A single resolved path entry. */
export interface ResolvedPath {
  routeKey: string;
  locale: LocaleCode;
  path: string;
}

/** A single hreflang link. */
export interface HreflangLink {
  hreflang: string;
  href: string;
}

/** A single breadcrumb entry. */
export interface BreadcrumbItem {
  routeKey: string;
  label: string;
  path: string;
}

/**
 * Resolves all possible paths for every route × locale combination.
 *
 * @returns Map keyed by full path string → { routeKey, locale, path }
 */
export function resolveAllPaths(
  routes: Route[],
  locales: Locale[],
  defaultLocale: LocaleCode,
): Map<string, ResolvedPath> {
  const result = new Map<string, ResolvedPath>();

  for (const route of routes) {
    for (const locale of locales) {
      const slug = route.slugs[locale.code];
      // Skip routes that don't have a slug for this locale (omit strategy)
      if (slug === undefined) continue;

      const path = getPath(route.key as RouteKey, locale.code, routes, defaultLocale);
      result.set(path, { routeKey: route.key, locale: locale.code, path });
    }
  }

  return result;
}

/**
 * Builds the full set of reciprocal hreflang links for a route.
 * FND-I18N-11: every indexable page has a full set of reciprocal hreflang links.
 *
 * - Self-referencing link for the current locale
 * - Links for every other locale that has a slug for this route
 * - x-default pointing to the default locale's path
 * - Routes with noindex: true are excluded entirely
 *
 * @param routeKey - The route to build hreflang links for
 * @param currentLocale - The locale of the current page
 * @param routes - Full route map
 * @param locales - All configured locales
 * @param defaultLocale - Default locale code
 */
export function buildHreflangSet(
  routeKey: string,
  currentLocale: LocaleCode,
  routes: Route[],
  locales: Locale[],
  defaultLocale: LocaleCode,
): HreflangLink[] {
  const route = routes.find((r) => r.key === routeKey);
  if (!route) return [];

  // FND-I18N-11: non-indexable routes excluded
  if (route.noindex) return [];

  const links: HreflangLink[] = [];

  for (const locale of locales) {
    const slug = route.slugs[locale.code];
    if (slug === undefined) continue;

    const hreflangValue = locale.hreflang;
    const path = getPath(route.key as RouteKey, locale.code, routes, defaultLocale);
    links.push({ hreflang: hreflangValue, href: path });
  }

  // FND-I18N-11: x-default is emitted only when a locale is marked isXDefault.
  // It points to that locale's path (falling back to the default locale if the
  // isXDefault locale has no slug for this route). If no locale is isXDefault,
  // no x-default link is emitted — emitting it unconditionally violates the
  // spec's opt-in contract and can produce a dead link when the default locale
  // lacks a slug.
  const xDefaultLocale = locales.find((l) => l.isXDefault);
  if (xDefaultLocale) {
    const xDefaultLocaleCode =
      route.slugs[xDefaultLocale.code] !== undefined
        ? xDefaultLocale.code
        : defaultLocale;
    // Only emit x-default if the resolved locale actually has this route.
    if (route.slugs[xDefaultLocaleCode] !== undefined) {
      const xDefaultHref = getPath(route.key as RouteKey, xDefaultLocaleCode, routes, defaultLocale);
      if (!links.some((l) => l.hreflang === "x-default")) {
        links.push({ hreflang: "x-default", href: xDefaultHref });
      }
    }
  }

  return links;
}

/**
 * Resolves the parent chain for breadcrumbs.
 * FND-SEO-11: cycle detection — if a cycle is detected, the chain is
 * truncated at the point of the cycle.
 *
 * @param routes - Full route map
 * @param routeKey - The route to build breadcrumbs for
 * @param locale - Target locale
 * @param defaultLocale - Default locale code
 * @param uiStrings - Map of routeKey → label for breadcrumb display text
 * @returns Array of breadcrumb items from root ancestor to the current route
 */
export function getBreadcrumbs(
  routes: Route[],
  routeKey: string,
  locale: LocaleCode,
  defaultLocale: LocaleCode,
  uiStrings: Map<string, string>,
): BreadcrumbItem[] {
  const chain: BreadcrumbItem[] = [];
  const visited = new Set<string>();

  let currentKey: string | undefined = routeKey;

  while (currentKey !== undefined) {
    // FND-SEO-11: cycle detection
    if (visited.has(currentKey)) {
      break;
    }
    visited.add(currentKey);

    const route = routes.find((r) => r.key === currentKey);
    if (!route) break;

    // Skip routes that don't have a slug for this locale
    const slug = route.slugs[locale];
    if (slug === undefined) break;

    const path = getPath(route.key as RouteKey, locale, routes, defaultLocale);
    const label = uiStrings.get(currentKey);
    if (label === undefined) break;

    chain.push({ routeKey: currentKey, label, path });

    currentKey = route.parent;
  }

  // Reverse so root ancestor comes first
  chain.reverse();
  return chain;
}

/**
 * Checks if a locale code is the default locale.
 */
export function isDefaultLocale(locale: LocaleCode, locales: Locale[]): boolean {
  return locales.some((l) => l.code === locale && l.isDefault === true);
}
