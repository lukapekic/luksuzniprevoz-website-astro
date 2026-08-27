/**
 * SEO helpers for the production site.
 * Builds SeoData objects from content and config.
 * FND-SEO-13: Title template "{title} | {brand}"
 */

import type { SeoData } from "@astro-foundation/core/seo";
import type { Route, Locale } from "@astro-foundation/core/i18n";
import { buildHreflangSet, getBreadcrumbs, getPath } from "@astro-foundation/core/i18n";
import type { BreadcrumbItem, LocaleCode } from "@astro-foundation/core/i18n";
import type { RouteKey } from "@astro-foundation/core";
import { config } from "../../foundation.config.ts";
import { routes } from "../data/routes.ts";
import { defaultLocale, getLocaleConfig } from "../data/locales.ts";
import { navLabelMap } from "../data/navigation.ts";

interface PageSeoOptions {
  routeKey: RouteKey;
  locale: LocaleCode;
  title: string;
  description: string;
  noindex?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  structuredData?: object[];
}

/** Cast routes to the expected Route[] type for core functions */
const typedRoutes = routes as unknown as Route[];
const typedLocales = config.locales.locales as unknown as Locale[];

/**
 * Build full SeoData with locale info, hreflang, canonical, etc.
 */
export function buildPageSeo(opts: PageSeoOptions): SeoData {
  const { routeKey, locale, title, description, noindex, ogImage, ogImageAlt, structuredData } =
    opts;

  const localeConfig = getLocaleConfig(locale);
  const path = getPath(routeKey, locale, typedRoutes, defaultLocale);
  const canonical = noindex ? undefined : `${config.site}${path}`;

  // Build hreflang links (relative paths for use in <head>)
  const hreflang = noindex
    ? []
    : buildHreflangSet(routeKey, locale, typedRoutes, typedLocales, defaultLocale).map((link) => ({
        hreflang: link.hreflang,
        href: link.href,
      }));

  return {
    title,
    description,
    canonical,
    noindex,
    ogImage,
    ogImageAlt,
    locale: { htmlLang: localeConfig.htmlLang, dir: localeConfig.dir },
    hreflang,
    structuredData: noindex ? undefined : structuredData,
    brand: config.brand,
  };
}

/**
 * Build breadcrumb data for a given route.
 */
export function buildBreadcrumbs(routeKey: RouteKey, locale: LocaleCode): BreadcrumbItem[] {
  return getBreadcrumbs(typedRoutes, routeKey, locale, defaultLocale, navLabelMap(locale));
}
