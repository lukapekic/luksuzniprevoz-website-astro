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
        code: "fr",
        htmlLang: "fr",
        hreflang: "fr",
        label: "Français",
        dir: "ltr",
        isDefault: false,
        isXDefault: false,
        intl: {
          dateTimeLocale: "fr-FR",
          numberLocale: "fr-FR",
        },
      },
    ],
    missingTranslation: "omit",
    parityFloor: 1,
  },
});

export default config;

// Two routes have the same slug in the same locale → collision
export const routes = [
  {
    key: "home",
    slugs: { en: "", fr: "" },
    sitemap: { include: true, priority: 1.0 },
  },
  {
    key: "about",
    slugs: { en: "about", fr: "a-propos" },
    parent: "home",
  },
  {
    key: "about-us",
    slugs: { en: "about", fr: "a-propos" },
    parent: "home",
  },
] as const;
