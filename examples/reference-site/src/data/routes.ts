import type { LocaleCode } from "@astro-foundation/core/i18n";

/**
 * Route table. Typed with a structural `RouteRef`-compatible shape so it is
 * assignable to `getPath(routes: readonly RouteRef[])` without `as const`
 * (which would freeze the slug keys into literals and break `Record` indexing).
 * `RouteKey` is generated from these `.key` values by `types:generate`.
 */
interface RouteDef {
  key: string;
  slugs: Record<LocaleCode, string>;
  parent?: string;
  noindex?: boolean;
  sitemap?: { include?: boolean; priority?: number };
  previousSlugs?: Record<LocaleCode, string[]>;
}

export const routes: RouteDef[] = [
  {
    key: "home",
    slugs: { sr: "", en: "", ru: "" },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "airport",
    slugs: { sr: "aerodrom", en: "airport", ru: "aeroport" },
    parent: "home",
    sitemap: { include: true, priority: 0.8 },
  },
  {
    key: "about",
    slugs: { sr: "o-nama", en: "about", ru: "o-nas" },
    parent: "home",
    sitemap: { include: true, priority: 0.7 },
  },
  {
    key: "contact",
    slugs: { sr: "kontakt", en: "contact", ru: "kontakty" },
    parent: "home",
    sitemap: { include: true, priority: 0.6 },
  },
  {
    key: "services",
    slugs: { sr: "usluge", en: "services", ru: "uslugi" },
    parent: "home",
    sitemap: { include: true, priority: 0.7 },
  },
  {
    key: "pricing",
    slugs: { sr: "cene", en: "pricing", ru: "tseny" },
    parent: "home",
    sitemap: { include: true, priority: 0.6 },
  },
  {
    key: "faq",
    slugs: { sr: "cesta-pitanja", en: "faq", ru: "chastye-voprosy" },
    parent: "home",
    sitemap: { include: true, priority: 0.5 },
  },
  {
    key: "legal",
    slugs: { sr: "pravne-informacije", en: "legal", ru: "pravovaya-informatsiya" },
    parent: "home",
    sitemap: { include: false },
  },
];
