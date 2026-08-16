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

// 31 routes — exceeds FND-SCALE-01 ceiling of 30
export const routes = [
  { key: "home", slugs: { en: "", fr: "" } },
  ...Array.from({ length: 30 }, (_, i) => ({
    key: `page-${String(i + 1).padStart(2, "0")}`,
    slugs: { en: `page-${i + 1}`, fr: `page-${i + 1}` },
  })),
] as const;
