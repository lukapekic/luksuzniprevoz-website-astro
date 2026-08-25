import { defineFoundationConfig } from "@astro-foundation/core";

/**
 * Luksuzni Prevoz — site configuration.
 *
 * Identity (brand, site, locales) is authoritative here.
 */
export const config = defineFoundationConfig({
  foundationVersion: "0.1.0",
  site: "https://luksuzniprevoz.rs",
  brand: "Luksuzni Prevoz",
  locales: {
    locales: [
      {
        code: "sr",
        htmlLang: "sr",
        hreflang: "sr",
        label: "Srpski",
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
  activeThemeVersion: "version-2",
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

// Routes live in src/data/routes.ts and are validated by routes:validate.
// RouteKey is generated from that map by types:generate.
