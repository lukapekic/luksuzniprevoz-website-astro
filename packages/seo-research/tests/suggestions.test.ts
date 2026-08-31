import { describe, expect, it } from "vitest";
import { validateSuggestionFile } from "../src/suggestions/validate.ts";

const context = {
  reportId: "report-a",
  project: "site/a",
  routeKey: "serviceA",
  locale: "en",
  sourcePath: "site/a/src/content/pages/service-a/en.md",
  sourceDigest: "digest-a",
  allowedFieldPaths: new Set(["seoTitle"]),
  evidenceIds: new Set(["source:seo-title"]),
};

function suggestion(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    reportId: "report-a",
    project: "site/a",
    proposals: [
      {
        id: "proposal-a",
        target: {
          routeKey: "serviceA",
          locale: "en",
          sourcePath: "site/a/src/content/pages/service-a/en.md",
          fieldPath: "seoTitle",
        },
        currentValue: "Service A",
        proposedValue: "Service A in Belgrade",
        category: "metadata",
        severity: "medium",
        confidence: "medium",
        rationale: "The query and source evidence support an editorial review.",
        evidenceIds: ["source:seo-title"],
        factImpact: "none",
        requiresReview: true,
        sourceDigest: "digest-a",
        ...overrides,
      },
    ],
  };
}

describe("suggestion validation", () => {
  it("accepts a current evidence-backed field proposal", () => {
    expect(validateSuggestionFile(suggestion(), context).proposals).toHaveLength(1);
  });

  it("rejects stale content, unapproved fields, and unknown evidence", () => {
    expect(() => validateSuggestionFile(suggestion({ sourceDigest: "stale" }), context)).toThrow(
      /Stale proposal/,
    );
    expect(() =>
      validateSuggestionFile(
        suggestion({
          target: { ...suggestion().proposals[0]!.target, fieldPath: "business.price" },
        }),
        context,
      ),
    ).toThrow(/not allowed/);
    expect(() => validateSuggestionFile(suggestion({ evidenceIds: ["unknown"] }), context)).toThrow(
      /Unknown evidence/,
    );
  });

  it("requires unresolved new claims to remain non-publishable", () => {
    expect(() => validateSuggestionFile(suggestion({ factImpact: "new-claim" }), context)).toThrow(
      /must not contain publishable/,
    );
    expect(
      validateSuggestionFile(suggestion({ factImpact: "new-claim", proposedValue: null }), context)
        .proposals[0]?.proposedValue,
    ).toBeNull();
  });
});
