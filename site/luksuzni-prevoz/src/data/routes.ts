import type { LocaleCode } from "@astro-foundation/core/i18n";

/**
 * Route table — FND-I18N-03 / FND-I18N-04 / FND-TYPE-02.
 *
 * URLs come from this map, never from folder names. `routes:validate` reads
 * the derived `routes` array; `types:generate` builds the `RouteKey` union
 * from its `.key` values. `RouteKey` is then used to type every `getPath()`
 * call and every `NavItem.routeKey`, so a typo is a compile error.
 *
 * Authoring shape: the canonical source is `routeMap` — an object keyed by
 * stable route id, carrying `kind` (page | service | hub) and `parent`
 * (null for top-level). `kind` is site-local signal: hubs are collection
 * index pages, services are leaf pages; it drives nav grouping, breadcrumbs,
 * and which template a route renders. The foundation's `RouteRef` only needs
 * `key` + `slugs` (+ optional `parent`), so the derived `routes` array
 * carries `kind` through as an optional field that validators ignore.
 */

export type RouteKind = "page" | "service" | "hub";

export interface RouteEntry {
  kind: RouteKind;
  parent: string | null;
  slugs: Record<LocaleCode, string>;
}

/**
 * Structural shape compatible with `getPath(routes: readonly RouteRef[])`
 * without `as const` (which would freeze slug keys into literals and break
 * `Record` indexing). `RouteKey` is generated from these `.key` values.
 */
export interface RouteDef {
  key: string;
  kind: RouteKind;
  slugs: Record<LocaleCode, string>;
  parent?: string;
  noindex?: boolean;
  sitemap?: { include?: boolean; priority?: number };
  previousSlugs?: Record<LocaleCode, string[]>;
}

/** Sitemap priority by route kind (home overrides to 1.0). */
function sitemapFor(key: string, kind: RouteKind): { include: boolean; priority: number } {
  if (key === "home") return { include: true, priority: 1.0 };
  switch (kind) {
    case "hub":
      return { include: true, priority: 0.8 };
    case "service":
      return { include: true, priority: 0.7 };
    default:
      return { include: true, priority: 0.6 };
  }
}

/**
 * Canonical route map — the source of truth.
 * Slugs are ASCII-transliterated (FND-I18N-05) and unique per locale
 * (FND-I18N-06). Empty slug = site root (home).
 */
export const routeMap: Record<string, RouteEntry> = {
  home: {
    kind: "page",
    parent: null,
    slugs: { sr: "", en: "", ru: "" },
  },
  privateChauffeur: {
    kind: "service",
    parent: null,
    slugs: { sr: "privatni-vozac", en: "private-chauffeur", ru: "lichnyy-voditel" },
  },
  airportTransportation: {
    kind: "service",
    parent: null,
    slugs: { sr: "aerodromski-prevoz", en: "airport-transportation", ru: "transfer-iz-aeroporta" },
  },
  businessTransportation: {
    kind: "hub",
    parent: null,
    slugs: { sr: "poslovni-prevoz", en: "business-transportation", ru: "biznes-transfer" },
  },
  corporateTransportation: {
    kind: "service",
    parent: "businessTransportation",
    slugs: { sr: "korporativni-prevoz", en: "corporate-transportation", ru: "korporativnyy-transfer" },
  },
  delegationTransportation: {
    kind: "service",
    parent: "businessTransportation",
    slugs: { sr: "prevoz-delegacija", en: "delegation-transportation", ru: "transfer-delegatsiy" },
  },
  conferenceCongressTransportation: {
    kind: "service",
    parent: "businessTransportation",
    slugs: {
      sr: "prevoz-za-konferencije-i-kongrese",
      en: "conference-congress-transportation",
      ru: "transfer-dlya-konferentsiy-i-kongressov",
    },
  },
  specialEvents: {
    kind: "hub",
    parent: null,
    slugs: { sr: "prevoz-za-specijalne-dogadjaje", en: "special-events", ru: "transport-dlya-osobykh-meropriyatiy" },
  },
  weddingTransportation: {
    kind: "service",
    parent: "specialEvents",
    slugs: { sr: "prevoz-za-vencanja", en: "wedding-transportation", ru: "svadebnyy-transfer" },
  },
  promTransportation: {
    kind: "service",
    parent: "specialEvents",
    slugs: { sr: "prevoz-za-maturu", en: "prom-transportation", ru: "transfer-na-vypusknoy" },
  },
  vipTransportation: {
    kind: "service",
    parent: "specialEvents",
    slugs: { sr: "vip-prevoz", en: "vip-transportation", ru: "vip-transfer" },
  },
  fleet: {
    kind: "page",
    parent: null,
    slugs: { sr: "vozila", en: "fleet", ru: "avtopark" },
  },
  pricing: {
    kind: "page",
    parent: null,
    slugs: { sr: "cene", en: "pricing", ru: "tseny" },
  },
  about: {
    kind: "page",
    parent: null,
    slugs: { sr: "o-nama", en: "about-us", ru: "o-nas" },
  },
  contact: {
    kind: "page",
    parent: null,
    slugs: { sr: "kontakt", en: "contact", ru: "kontakty" },
  },
};

/** Derived array — what the foundation consumes (`routes:validate`, `types:generate`, `getPath`). */
export const routes: RouteDef[] = Object.entries(routeMap).map(([key, entry]) => ({
  key,
  kind: entry.kind,
  slugs: entry.slugs,
  ...(entry.parent !== null ? { parent: entry.parent } : {}),
  sitemap: sitemapFor(key, entry.kind),
}));

/** Lookup helper for components/pages. */
export function getRoute(key: string): RouteEntry {
  const entry = routeMap[key];
  if (!entry) throw new Error(`Route not found: ${key}`);
  return entry;
}

/** Children of a hub, in declaration order. */
export function childrenOf(parentKey: string): RouteDef[] {
  return routes.filter((r) => r.parent === parentKey);
}
