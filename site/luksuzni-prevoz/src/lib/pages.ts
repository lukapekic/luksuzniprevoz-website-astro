/**
 * Shared static-path builder for leaf (non-home) content pages.
 *
 * The leaf content is rendered by two route files so the default-locale URLs
 * can be UNPREFIXED while non-default locales keep their `/locale/` prefix
 * (the routing invariant every other layer — getPath, hreflang, canonical,
 * internal links, validators — already models):
 *
 *   pages/[...slug].astro            → default locale (sr)  → /kontakt/
 *   pages/[locale]/[...slug].astro   → non-default (en, ru)  → /en/contact/
 *
 * Both call this helper, passing their locale set and the `prefixed` flag that
 * selects the param shape their route expects. Keeping the content-loading +
 * FND-LIFE-02 status filter + route/slug resolution in one place prevents the
 * two route files from drifting (astro-architecture.md: route file → shared
 * loader/resolver → shared page component).
 *
 * FND-I18N-03: URLs come from the route map (the slug is the route's localized
 * slug from routes.ts), never from folder names. Home (slug "") is handled by
 * the home route files, never here.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { routes } from "../data/routes.ts";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

/** Props forwarded to LeafPage by both leaf route files. */
export interface LeafPageProps {
  routeKey: RouteKey;
  locale: LocaleCode;
  content: CollectionEntry<"pages">;
}

/**
 * Build `getStaticPaths` items for leaf pages, filtered to `allowedLocales`.
 *
 * @param allowedLocales - Locales this route file owns (sr for the unprefixed
 *   catch-all; en, ru for the prefixed [locale] route).
 * @param prefixed - `true` for `[locale]/[...slug].astro` (params: locale + slug);
 *   `false` for the root `[...slug].astro` (params: slug only).
 */
export async function buildLeafStaticPaths(
  allowedLocales: LocaleCode[],
  options: { prefixed: boolean },
): Promise<Array<{ params: Record<string, string>; props: LeafPageProps }>> {
  const { prefixed } = options;
  const pages = await getCollection("pages");
  const items: Array<{ params: Record<string, string>; props: LeafPageProps }> = [];

  for (const page of pages) {
    const { routeKey, locale, status } = page.data;
    if (!allowedLocales.includes(locale)) continue;

    // FND-LIFE-02: production builds emit only `published`. In dev/preview,
    // draft and in-review pages ARE emitted (so reviewers can see them) but
    // are marked noindex so they never reach a search index.
    const isScaffold = page.data.pageType === "scaffold" && page.data.scaffold === true;
    if (import.meta.env.PROD && status !== "published" && !isScaffold) continue;

    const route = routes.find((r) => r.key === routeKey);
    if (!route) continue;

    const slug = route.slugs[locale];
    if (slug === undefined || slug === "") continue; // home handled by the home route

    items.push({
      params: prefixed ? { locale, slug } : { slug },
      // routeKey is a valid key (content:validate binds it to the route map);
      // cast the string to the generated RouteKey union at this boundary.
      props: { routeKey: routeKey as RouteKey, locale, content: page },
    });
  }

  return items;
}
