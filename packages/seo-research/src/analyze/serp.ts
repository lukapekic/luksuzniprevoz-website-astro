import type { EvidenceReference, SeoFinding, SerpEvidence } from "../reports/schema.ts";

function normalizedPath(url: string): string {
  return new URL(url).pathname.replace(/\/+$/, "/");
}

export function analyzeSerp(
  serp: SerpEvidence | null,
  expectedUrl: string,
  evidence: EvidenceReference[],
): SeoFinding[] {
  if (!serp) return [];
  evidence.push({
    id: "serp:position",
    kind: "serp",
    label: "Current organic position",
    value:
      serp.ourPosition === null
        ? `Not present in first ${serp.numResults}`
        : String(serp.ourPosition),
  });
  const findings: SeoFinding[] = [];
  if (serp.ourPosition === null) {
    findings.push({
      id: "finding:serp:not-found",
      category: "serp",
      severity: "medium",
      confidence: "high",
      summary: "Target site is absent from the collected organic result window",
      detail: `No matching site URL appeared in the first ${serp.numResults} organic results for the configured query dimensions.`,
      evidenceIds: ["serp:position"],
    });
  } else if (serp.ourUrl && normalizedPath(serp.ourUrl) !== normalizedPath(expectedUrl)) {
    evidence.push({
      id: "serp:ranking-url",
      kind: "serp",
      label: "Ranking site URL",
      value: serp.ourUrl,
    });
    findings.push({
      id: "finding:serp:ranking-url",
      category: "serp",
      severity: "high",
      confidence: "high",
      summary: "A different site URL ranks for the target query",
      detail: `Expected target ${expectedUrl}, but ValueSERP matched ${serp.ourUrl}. Review intent overlap or cannibalization before changing content.`,
      evidenceIds: ["serp:position", "serp:ranking-url"],
    });
  }
  return findings;
}
