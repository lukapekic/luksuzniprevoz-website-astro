import { defineSeoResearchConfig } from "../../../src/index.ts";

const config = defineSeoResearchConfig({
  schemaVersion: 1,
  limits: { maxQueriesPerRun: 3 },
  targets: [
    {
      routeKey: "serviceA",
      intent: "transactional",
      locales: {
        sr: {
          primaryKeyword: "usluga a",
          search: { languageCode: "sr", countryCode: "rs" },
        },
        en: {
          primaryKeyword: "service a",
          search: { languageCode: "en", countryCode: "rs" },
        },
        ru: {
          primaryKeyword: "услуга а",
          search: { languageCode: "ru", countryCode: "rs" },
        },
      },
    },
  ],
});

export { config };
export default config;
