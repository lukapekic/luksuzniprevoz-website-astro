import type { SeoResearchReport } from "../reports/schema.ts";
import type { SeoSuggestionInput } from "./provider.ts";

const ALLOWED_FIELD_PATTERNS = [
  /^seoTitle$/,
  /^seoDescription$/,
  /^h1$/,
  /^hero\.(title|description|supportText)$/,
  /^(overview|introSection|story)\.(body|heading\.(title|intro))$/,
  /^sections\[\d+\]\.(body|heading\.(title|intro))$/,
  /^faq\.(heading|items\[\d+\]\.(question|answer))$/,
  /^finalCta\.(heading|text)$/,
];

export function allowedSuggestionFieldPaths(report: SeoResearchReport): string[] {
  return Object.keys(report.current.source.textFields)
    .filter((path) => ALLOWED_FIELD_PATTERNS.some((pattern) => pattern.test(path)))
    .sort();
}

export function buildSuggestionInput(report: SeoResearchReport): SeoSuggestionInput {
  const allowedFieldPaths = allowedSuggestionFieldPaths(report);
  const currentValues = Object.fromEntries(
    allowedFieldPaths.map((path) => [path, report.current.source.textFields[path] ?? ""]),
  );
  return {
    reportId: report.run.id,
    project: report.run.project,
    routeKey: report.page.routeKey,
    locale: report.page.locale,
    sourcePath: report.page.sourcePath,
    sourceDigest: report.page.sourceDigest,
    allowedFieldPaths,
    currentValues,
    evidence: report.evidence,
    findings: report.findings,
    constraints: [
      "Every proposal requires human review.",
      "Do not invent prices, availability, reviews, dates, locations, service relationships, or operational facts.",
      "Do not translate keywords or content from another locale; use only this locale's evidence.",
      "Do not target components, CSS, generated files, routes, or business data.",
      "Use null proposedValue for a new factual claim that still requires verification.",
    ],
  };
}
