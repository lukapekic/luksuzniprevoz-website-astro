import { defineFoundationConfig } from "../../../packages/astro-foundation/src/index.js";

export const config = defineFoundationConfig({
  foundationVersion: "0.1.0",
  site: "https://test-site.example.dev",
  brand: "Test Site",
  locales: {
    locales: [
      {
        code: "en",
        htmlLang: "en",
        hreflang: "en",
        label: "English",
        dir: "ltr",
        isDefault: true,
        isXDefault: true,
        intl: {
          dateTimeLocale: "en-US",
          numberLocale: "en-US",
        },
      },
      {
        code: "sr",
        htmlLang: "sr",
        hreflang: "sr",
        label: "Српски",
        dir: "ltr",
        isDefault: false,
        isXDefault: false,
        intl: {
          dateTimeLocale: "sr-Latn-RS",
          numberLocale: "sr-Latn-RS",
        },
      },
    ],
    missingTranslation: "omit",
    parityFloor: 1,
  },
});

export default config;

// Cyrillic slug — not ASCII
export const routes = [
  {
    key: "home",
    slugs: { en: "", sr: "" },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "about",
    slugs: { en: "about", sr: "о-нами" },
    parent: "home",
  },
] as const;
