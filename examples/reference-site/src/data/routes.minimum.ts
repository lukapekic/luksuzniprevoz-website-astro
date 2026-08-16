/**
 * Minimum routes — 3 routes for 2 locales (sr, en).
 * FND-META-08: Minimum CI config.
 */
export const routes = [
  {
    key: "home",
    slugs: { sr: "", en: "" },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "airport",
    slugs: { sr: "aerodrom", en: "airport" },
    parent: "home",
    sitemap: { include: true, priority: 0.8 },
  },
  {
    key: "about",
    slugs: { sr: "o-nama", en: "about" },
    parent: "home",
    sitemap: { include: true, priority: 0.7 },
  },
] as const;
