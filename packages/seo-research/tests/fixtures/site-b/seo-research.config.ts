import { defineSeoResearchConfig } from "../../../src/index.ts";

const config = defineSeoResearchConfig({
  schemaVersion: 1,
  targets: [
    {
      routeKey: "serviceB",
      intent: "commercial",
      locales: {
        sr: {
          primaryKeyword: "usluga b",
          search: { languageCode: "sr", countryCode: "rs" },
        },
        en: {
          primaryKeyword: "service b",
          search: { languageCode: "en", countryCode: "rs" },
        },
        ru: {
          primaryKeyword: "услуга б",
          search: { languageCode: "ru", countryCode: "rs" },
        },
      },
    },
  ],
});

export { config };
export default config;
