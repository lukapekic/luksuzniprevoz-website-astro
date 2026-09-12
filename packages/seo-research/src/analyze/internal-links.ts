import type { EvidenceReference, RenderedPageEvidence, SeoFinding } from "../reports/schema.ts";

export function analyzeInternalLinks(
  rendered: RenderedPageEvidence | null,
  evidence: EvidenceReference[],
): SeoFinding[] {
  if (!rendered) return [];
  const meaningful = rendered.internalLinks.filter((link) => link.text.trim().length > 0);
  evidence.push({
    id: "rendered:internal-links",
    kind: "rendered",
    label: "Crawlable internal links",
    value: `${rendered.internalLinks.length} total; ${meaningful.length} with anchor text`,
  });
  if (rendered.internalLinks.length === 0) {
    return [
      {
        id: "finding:links:none",
        category: "internal-link",
        severity: "high",
        confidence: "high",
        summary: "Rendered page exposes no crawlable internal links",
        detail: "Review shared navigation and page relationships in the built output.",
        evidenceIds: ["rendered:internal-links"],
      },
    ];
  }
  const empty = rendered.internalLinks.length - meaningful.length;
  return empty > 0
    ? [
        {
          id: "finding:links:empty-anchor",
          category: "internal-link",
          severity: "low",
          confidence: "high",
          summary: "Some internal links have no text alternative",
          detail: `${empty} internal link(s) have empty extracted anchor text. Decorative/icon links need an accessible name.`,
          evidenceIds: ["rendered:internal-links"],
        },
      ]
    : [];
}
