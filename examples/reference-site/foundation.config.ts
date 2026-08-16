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

// Routes are defined separately and validated by routes:validate
export const routes = [
  {
    key: "home",
    slugs: {
      sr: "",
      en: "",
      ru: "",
    },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "airport",
    slugs: {
      sr: "aerodrom",
      en: "airport",
      ru: "aehroport",
    },
    sitemap: { include: true, priority: 0.8 },
  },
  {
    key: "about",
    slugs: {
      sr: "o-nama",
      en: "about",
      ru: "o-nas",
    },
    sitemap: { include: true, priority: 0.7 },
  },
] as const;
