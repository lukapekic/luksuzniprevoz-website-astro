import type { EvidenceReference, SeoFinding } from "../reports/schema.ts";
import type { LoadedSite } from "../site/load-site.ts";

function structuralPath(path: string): string {
  return path.replace(/\[\d+\]/g, "[]");
}

export function analyzeLocaleParity(
  site: LoadedSite,
  routeKey: string,
  locale: string,
  evidence: EvidenceReference[],
): SeoFinding[] {
  const current = site.contentByPair.get(`${routeKey}:${locale}`);
  if (!current) return [];
  const currentPaths = new Set(Object.keys(current.source.textFields).map(structuralPath));
  const missingByLocale: Record<string, string[]> = {};
  for (const configuredLocale of site.config.locales.locales) {
    if (configuredLocale.code === locale) continue;
    const sibling = site.contentByPair.get(`${routeKey}:${configuredLocale.code}`);
    if (!sibling) {
      missingByLocale[configuredLocale.code] = ["<content entry>"];
      continue;
    }
    const siblingPaths = new Set(Object.keys(sibling.source.textFields).map(structuralPath));
    const missing = [...currentPaths].filter((path) => !siblingPaths.has(path)).sort();
    if (missing.length > 0) missingByLocale[configuredLocale.code] = missing;
  }
  if (Object.keys(missingByLocale).length === 0) return [];
  evidence.push({
    id: "source:locale-parity",
    kind: "source",
    label: "Localized structural field gaps",
    value: JSON.stringify(missingByLocale),
  });
  return [
    {
      id: "finding:locale-parity",
      category: "locale-parity",
      severity: "medium",
      confidence: "high",
      summary: "Localized content structure differs across configured locales",
      detail: "Review missing structural field paths without copying or inventing translations.",
      evidenceIds: ["source:locale-parity"],
    },
  ];
}
