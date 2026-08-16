/**
 * Full/Representative config — 3 locales (sr, en, ru), 8 routes
 * FND-META-08: Used for CI full-check scenarios.
 *
 * Routes: home, airport, about, contact, services, pricing, faq, legal
 */
import { defineFoundationConfig } from "@astro-foundation/core";

export const config = defineFoundationConfig({
  foundationVersion: "0.1.0",
  site: "https://reference-site.astro-foundation.dev",
  brand: "Reference Site",
  locales: {
    locales: [
      {
        code: "sr",
        htmlLang: "sr",
        hreflang: "sr",
        label: "Српски",
        dir: "ltr",
        isDefault: true,
        isXDefault: true,
        intl: {
          dateTimeLocale: "sr-Latn-RS",
          numberLocale: "sr-Latn-RS",
        },
      },
      {
        code: "en",
        htmlLang: "en",
        hreflang: "en",
        label: "English",
        dir: "ltr",
        isDefault: false,
        isXDefault: false,
        intl: {
          dateTimeLocale: "en-US",
          numberLocale: "en-US",
        },
      },
      {
        code: "ru",
        htmlLang: "ru",
        hreflang: "ru",
        label: "Русский",
        dir: "ltr",
        isDefault: false,
        isXDefault: false,
        intl: {
          dateTimeLocale: "ru-RU",
          numberLocale: "ru-RU",
        },
      },
    ],
    missingTranslation: "omit",
    parityFloor: 1,
  },
  capabilities: {
    forms: true,
    legalPages: true,
    consentBanner: true,
    thirdParty: [
      {
        origin: "https://www.googletagmanager.com",
        purpose: "analytics",
        strategy: "lazy",
      },
    ],
    structuredData: ["Organization", "WebSite"],
    ogImages: "static",
  },
  activeThemeVersion: "version-1",
  reviewStalenessWindowMonths: 12,
  performanceBudget: {
    maxJsKb: 50,
    maxCssKb: 40,
    maxFontFiles: 4,
    maxFontTotalKb: 150,
    maxLcpImageKb: 150,
    maxTotalRouteKb: 800,
    maxIslandsPerRoute: 3,
  },
});

export default config;

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
