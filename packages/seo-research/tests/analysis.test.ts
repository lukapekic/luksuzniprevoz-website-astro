import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzeContent } from "../src/analyze/content.ts";
import { analyzeTechnical } from "../src/analyze/technical.ts";
import { parseRenderedHtml } from "../src/collect/rendered-page.ts";
import type { EvidenceReference, SourcePageEvidence } from "../src/reports/schema.ts";
import { loadSite } from "../src/site/load-site.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

describe("deterministic analysis", () => {
  it("flags localized topic gaps without proposing keyword stuffing", () => {
    const source: SourcePageEvidence = {
      pageType: "service",
      status: "published",
      translationState: "reviewed",
      noindex: false,
      seoTitle: "Executive ride",
      seoDescription: "A clear service description.",
      primaryHeading: "Travel in comfort",
      textFields: { seoTitle: "Executive ride", "hero.title": "Travel in comfort" },
      textExcerpt: "A clear service description.",
    };
    const evidence: EvidenceReference[] = [];
    const findings = analyzeContent(
      source,
      {
        primaryKeyword: "service a",
        secondaryKeywords: ["flight tracking"],
        entities: ["Nikola Tesla Airport"],
        questions: [],
        search: {
          languageCode: "en",
          countryCode: "rs",
          device: "desktop",
          numResults: 20,
        },
      },
      evidence,
    );

    expect(findings.map((finding) => finding.id)).toEqual([
      "finding:content:primary-topic",
      "finding:content:coverage",
    ]);
    expect(findings[0]?.detail).toContain("not an instruction to keyword-stuff");
  });

  it("reports rendered canonical, language, hreflang, and H1 defects", async () => {
    const site = await loadSite(repositoryRoot, "packages/seo-research/tests/fixtures/site-a");
    const rendered = parseRenderedHtml(
      "<html lang='sr'><head><link rel='canonical' href='https://wrong.example/'></head><body><h1>One</h1><h1>Two</h1></body></html>",
      "https://site-a.example/en/service-a/",
    );
    const evidence: EvidenceReference[] = [];
    const findings = analyzeTechnical(
      site,
      "serviceA",
      "https://site-a.example/en/service-a/",
      "en",
      [],
      rendered,
      evidence,
    );

    expect(findings.map((finding) => finding.id)).toEqual(
      expect.arrayContaining([
        "finding:rendered:h1-count",
        "finding:rendered:canonical",
        "finding:rendered:lang",
        "finding:rendered:hreflang",
      ]),
    );
  });
});
