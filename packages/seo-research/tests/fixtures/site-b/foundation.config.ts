const config = {
  foundationVersion: "0.1.0",
  site: "https://site-b.example",
  brand: "Site B",
  locales: {
    locales: [
      {
        code: "sr",
        htmlLang: "sr-Latn",
        hreflang: "sr-Latn",
        label: "Srpski",
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
        intl: { dateTimeLocale: "en-GB", numberLocale: "en-GB" },
      },
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
    ],
    missingTranslation: "omit",
    parityFloor: 1,
  },
  capabilities: {
    forms: false,
    legalPages: false,
    consentBanner: false,
    thirdParty: [],
    structuredData: ["Organization", "WebSite"],
    ogImages: "static",
  },
  activeThemeVersion: "version-test",
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
};

export { config };
export default config;
