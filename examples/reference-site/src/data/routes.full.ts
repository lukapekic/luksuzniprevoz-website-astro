/**
 * Full routes — 8 routes for 3 locales (sr, en, ru).
 * FND-META-08: Representative config.
 */
export const routes = [
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
] as const;
