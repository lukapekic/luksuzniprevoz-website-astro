import type { LocaleSearchTarget } from "../config/schema.ts";
import type { EvidenceReference, SeoFinding, SourcePageEvidence } from "../reports/schema.ts";

function normalize(value: string): string {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function analyzeContent(
  source: SourcePageEvidence,
  target: LocaleSearchTarget,
  evidence: EvidenceReference[],
): SeoFinding[] {
  const findings: SeoFinding[] = [];
  const primary = normalize(target.primaryKeyword);
  const title = normalize(source.seoTitle ?? "");
  const h1 = normalize(source.primaryHeading ?? "");
  evidence.push({
    id: "source:seo-title",
    kind: "source",
    label: "Source SEO title",
    value: source.seoTitle ?? "none",
  });
  evidence.push({
    id: "source:primary-heading",
    kind: "source",
    label: "Source primary heading",
    value: source.primaryHeading ?? "none",
  });
  if (primary && !title.includes(primary) && !h1.includes(primary)) {
    findings.push({
      id: "finding:content:primary-topic",
      category: "metadata",
      severity: "medium",
      confidence: "medium",
      summary:
        "Configured primary query is not an exact phrase in the SEO title or primary heading",
      detail:
        "Treat this as a localized editorial review signal, not an instruction to keyword-stuff. Inflection and natural phrasing may make the current copy preferable.",
      evidenceIds: ["source:seo-title", "source:primary-heading"],
    });
  }

  const text = normalize(source.textExcerpt);
  const missing = [...target.entities, ...target.secondaryKeywords].filter(
    (value) => !text.includes(normalize(value)),
  );
  if (missing.length > 0) {
    evidence.push({
      id: "source:coverage",
      kind: "source",
      label: "Configured topics not found verbatim",
      value: missing.join(" | "),
    });
    findings.push({
      id: "finding:content:coverage",
      category: "content-coverage",
      severity: "low",
      confidence: "low",
      summary: "Configured supporting topics need editorial coverage review",
      detail: `${missing.length} configured phrase/entity value(s) were not found verbatim. Locale morphology and synonyms require human review.`,
      evidenceIds: ["source:coverage"],
    });
  }
  return findings;
}
