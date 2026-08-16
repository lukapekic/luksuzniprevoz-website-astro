/**
 * Minimum config — 2 locales (sr, en), 3 routes (home, airport, about)
 * FND-META-08: Used for CI fast-check scenarios.
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
    ],
    missingTranslation: "omit",
    parityFloor: 1,
  },
  capabilities: {
    forms: true,
    legalPages: true,
    consentBanner: true,
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
    slugs: {
      sr: "",
      en: "",
    },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "airport",
    slugs: {
      sr: "aerodrom",
      en: "airport",
    },
    parent: "home",
    sitemap: { include: true, priority: 0.8 },
  },
  {
    key: "about",
    slugs: {
      sr: "o-nama",
      en: "about",
    },
    parent: "home",
    sitemap: { include: true, priority: 0.7 },
  },
] as const;
