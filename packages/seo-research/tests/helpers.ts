import { seoResearchReportSchema, type SeoResearchReport } from "../src/reports/schema.ts";

export function createReport(
  overrides: {
    readonly id?: string;
    readonly position?: number | null;
    readonly keyword?: string;
    readonly locale?: string;
    readonly sourceDigest?: string;
  } = {},
): SeoResearchReport {
  const locale = overrides.locale ?? "en";
  const position = overrides.position === undefined ? 7 : overrides.position;
  return seoResearchReportSchema.parse({
    schemaVersion: 1,
    run: {
      id: overrides.id ?? "20260101T000000Z-abc12345",
      generatedAt: "2026-01-01T00:00:00.000Z",
      packageVersion: "0.1.0",
      project: "tests/fixtures/site-a",
      mode: "offline",
      provider: position === null ? null : "valueserp",
      cache: { hits: 0, misses: 0 },
      budget: { allowed: 3, used: 0 },
    },
    page: {
      routeKey: "serviceA",
      locale,
      url: `https://site-a.example/${locale === "sr" ? "usluga-a" : `${locale}/service-a`}/`,
      sourcePath: `tests/fixtures/site-a/src/content/pages/service-a/${locale}.md`,
      sourceDigest: overrides.sourceDigest ?? "digest-a",
      published: true,
      indexable: true,
    },
    target: {
      primaryKeyword: overrides.keyword ?? "service a",
      secondaryKeywords: [],
      entities: [],
      questions: [],
      search: {
        languageCode: locale,
        countryCode: "rs",
        device: "desktop",
        numResults: 20,
      },
    },
    current: {
      source: {
        pageType: "service",
        status: "published",
        translationState: "reviewed",
        noindex: false,
        seoTitle: "Service A",
        seoDescription: "Description for service A.",
        primaryHeading: "Service A",
        textFields: {
          seoTitle: "Service A",
          seoDescription: "Description for service A.",
          "hero.title": "Service A",
        },
        textExcerpt: "Service A Description for service A.",
      },
      rendered: null,
      foundationIssues: [],
    },
    serp:
      position === null
        ? null
        : {
            keyword: overrides.keyword ?? "service a",
            fetchedAt: "2026-01-01T00:00:00.000Z",
            location: null,
            languageCode: locale,
            countryCode: "rs",
            googleDomain: null,
            device: "desktop",
            numResults: 20,
            organicResults: [
              {
                position,
                url: "https://site-a.example/en/service-a/",
                domain: "site-a.example",
                displayedUrl: null,
                title: "Service A",
                snippet: null,
              },
            ],
            ourPosition: position,
            ourUrl: "https://site-a.example/en/service-a/",
          },
    competitors: [],
    evidence: [{ id: "source:seo-title", kind: "source", label: "SEO title", value: "Service A" }],
    findings: [],
    proposals: [],
    warnings: [],
  });
}
