import { defineSeoResearchConfig } from "@astro-foundation/seo-research";

export const config = defineSeoResearchConfig({
  schemaVersion: 1,
  provider: {
    kind: "valueserp",
    apiKeyEnv: "VALUESERP_API_KEY",
  },
  limits: {
    maxQueriesPerRun: 12,
    maxOrganicResultsPerQuery: 20,
    maxCompetitorPagesPerQuery: 3,
    maxPagesPerDomain: 1,
    requestTimeoutMs: 20_000,
    maxResponseBytes: 1_000_000,
    cacheTtlHours: 24,
  },
  competitors: [
    {
      name: "Transfers in Belgrade",
      domain: "transfersinbelgrade.com",
      sitemapUrl: "https://www.transfersinbelgrade.com/sitemap.xml",
      trackedRoutePatterns: ["airport", "belgrade"],
    },
  ],
  targets: [
    {
      routeKey: "airportTransportation",
      intent: "transactional",
      locales: {
        sr: {
          primaryKeyword: "aerodromski prevoz Beograd",
          secondaryKeywords: [
            "transfer do aerodroma Nikola Tesla",
            "privatni aerodromski transfer",
          ],
          entities: ["Aerodrom Nikola Tesla", "praćenje leta"],
          questions: ["Gde vozač čeka putnika nakon sletanja?", "Šta se dešava ako let kasni?"],
          search: {
            languageCode: "sr",
            countryCode: "rs",
            location: "Belgrade,Serbia",
            googleDomain: "google.rs",
            device: "desktop",
            numResults: 20,
          },
        },
        en: {
          primaryKeyword: "Belgrade airport transfer",
          secondaryKeywords: ["Nikola Tesla airport transfer", "private airport transfer Belgrade"],
          entities: ["Nikola Tesla Airport", "flight tracking"],
          questions: [
            "Where will the chauffeur meet me after arrival?",
            "What happens if my flight is delayed?",
          ],
          search: {
            languageCode: "en",
            countryCode: "rs",
            location: "Belgrade,Serbia",
            googleDomain: "google.rs",
            device: "desktop",
            numResults: 20,
          },
        },
        ru: {
          primaryKeyword: "трансфер из аэропорта Белграда",
          secondaryKeywords: [
            "частный трансфер из аэропорта Белграда",
            "трансфер аэропорт Никола Тесла",
          ],
          entities: ["аэропорт Никола Тесла", "отслеживание рейса"],
          questions: [
            "Где водитель встретит меня после прилёта?",
            "Что произойдёт, если рейс задержится?",
          ],
          search: {
            languageCode: "ru",
            countryCode: "rs",
            location: "Belgrade,Serbia",
            googleDomain: "google.com",
            device: "desktop",
            numResults: 20,
          },
        },
      },
    },
  ],
});

export default config;
