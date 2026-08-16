import { defineFoundationConfig } from "../../../packages/astro-foundation/src/index.js";

export default defineFoundationConfig({
  foundationVersion: "0.1.0",
  site: "https://example.com",
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
    ],
    missingTranslation: "omit",
    parityFloor: 1,
  },
});
