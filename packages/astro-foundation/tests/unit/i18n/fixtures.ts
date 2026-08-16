import type { Route, Locale } from "../../../src/i18n/schema.ts";

// ─── 2-locale fixtures (sr default, en) ───────────────────────────────

export const LOCALES_2: Locale[] = [
  {
    code: "sr",
    htmlLang: "sr",
    hreflang: "sr",
    label: "Српски",
    dir: "ltr",
    isDefault: true,
    isXDefault: true,
    intl: { dateTimeLocale: "sr-Latn-RS", numberLocale: "sr-Latn-RS" },
  },
  {
    code: "en",
    htmlLang: "en",
    hreflang: "en",
    label: "English",
    dir: "ltr",
    isDefault: false,
    isXDefault: false,
    intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
  },
];

export const ROUTES_2: Route[] = [
  {
    key: "home",
    slugs: { sr: "", en: "" },
    sitemap: { include: true },
  },
  {
    key: "airport",
    slugs: { sr: "aerodrom", en: "airport-transportation" },
    sitemap: { include: true },
  },
  {
    key: "about",
    slugs: { sr: "o-nama", en: "about" },
    sitemap: { include: true },
  },
];

export const DEFAULT_2 = "sr" as const;

// ─── 3-locale fixtures (sr default, en, ru) ───────────────────────────

export const LOCALES_3: Locale[] = [
  ...LOCALES_2,
  {
    code: "ru",
    htmlLang: "ru",
    hreflang: "ru",
    label: "Русский",
    dir: "ltr",
    isDefault: false,
    isXDefault: false,
    intl: { dateTimeLocale: "ru-RU", numberLocale: "ru-RU" },
  },
];

export const ROUTES_3: Route[] = [
  {
    key: "home",
    slugs: { sr: "", en: "", ru: "" },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "airport",
    slugs: { sr: "aerodrom", en: "airport-transportation", ru: "aehroport" },
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
    sitemap: { include: true, priority: 0.9 },
  },
  {
    key: "private-transfer",
    slugs: { sr: "privatni-prevoz", en: "private-transfer", ru: "chastnyj-transfer" },
    parent: "services",
    sitemap: { include: true },
  },
  {
    key: "shared-ride",
    slugs: { sr: "deljeni-prevoz", en: "shared-ride", ru: "sov mestnyj-transport" },
    parent: "services",
    noindex: true,
    sitemap: { include: false },
  },
];

export const DEFAULT_3 = "sr" as const;

// ─── Missing translations (omit strategy) ────────────────────────────

export const ROUTES_MISSING: Route[] = [
  {
    key: "home",
    slugs: { sr: "", en: "" },
    sitemap: { include: true },
  },
  {
    key: "local-only",
    slugs: { sr: "samo-srpski" },
    // en slug is missing — should be omitted under "omit" strategy
    sitemap: { include: true },
  },
  {
    key: "full-coverage",
    slugs: { sr: "puno", en: "full" },
    sitemap: { include: true },
  },
];

// ─── Parent chain with cycle (FND-SEO-11) ─────────────────────────────

export const ROUTES_CYCLE: Route[] = [
  {
    key: "page-a",
    slugs: { sr: "stranica-a", en: "page-a" },
    parent: "page-b",
    sitemap: { include: true },
  },
  {
    key: "page-b",
    slugs: { sr: "stranica-b", en: "page-b" },
    parent: "page-c",
    sitemap: { include: true },
  },
  {
    key: "page-c",
    slugs: { sr: "stranica-c", en: "page-c" },
    parent: "page-a",
    // Cycle: a → b → c → a
    sitemap: { include: true },
  },
];

// ─── UI strings for breadcrumbs ───────────────────────────────────────

export const UI_STRINGS_3 = new Map<string, string>([
  ["home", "Početna"],
  ["airport", "Aerodromski prevoz"],
  ["about", "O nama"],
  ["contact", "Kontakt"],
  ["services", "Usluge"],
  ["private-transfer", "Privatni prevoz"],
  ["shared-ride", "Deljeni prevoz"],
]);

export const UI_STRINGS_CYCLE = new Map<string, string>([
  ["page-a", "Stranica A"],
  ["page-b", "Stranica B"],
  ["page-c", "Stranica C"],
]);
