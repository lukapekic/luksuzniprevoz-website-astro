import { defineFoundationConfig } from "../../../packages/astro-foundation/src/index.js";

export default defineFoundationConfig({
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
  capabilities: {
    forms: false,
    legalPages: false,
    consentBanner: false,
    thirdParty: [],
    structuredData: [],
    ogImages: "static",
  },
});
