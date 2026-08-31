import type { SeoFinding, SeoProposal } from "../reports/schema.ts";

export function buildDeterministicProposals(
  findings: readonly SeoFinding[],
  context: {
    readonly routeKey: string;
    readonly locale: string;
    readonly sourcePath: string;
    readonly sourceDigest: string;
    readonly textFields: Readonly<Record<string, string>>;
  },
): SeoProposal[] {
  const proposals: SeoProposal[] = [];
  const duplicatedBrand = findings.find(
    (finding) => finding.ruleId === "FND-SEO-13" && finding.summary.includes("FND-SEO-13"),
  );
  const seoTitle = context.textFields["seoTitle"];
  if (duplicatedBrand && seoTitle) {
    proposals.push({
      id: "proposal:metadata:title-template-review",
      target: {
        routeKey: context.routeKey,
        locale: context.locale,
        sourcePath: context.sourcePath,
        fieldPath: "seoTitle",
      },
      currentValue: seoTitle,
      proposedValue: null,
      category: "metadata",
      severity: duplicatedBrand.severity,
      confidence: "high",
      rationale:
        "The Foundation validator indicates that the title template and authored title may duplicate the brand. An editor must choose the page-specific title after inspecting the active template.",
      evidenceIds: duplicatedBrand.evidenceIds,
      factImpact: "none",
      requiresReview: true,
      sourceDigest: context.sourceDigest,
    });
  }
  return proposals;
}
