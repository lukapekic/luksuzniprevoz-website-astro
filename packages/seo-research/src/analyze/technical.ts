import { composeTitle } from "@astro-foundation/core";
import type { EvidenceReference, SeoFinding } from "../reports/schema.ts";
import type { LoadedSite } from "../site/load-site.ts";
import { resolveRoutePath } from "../site/resolve-route.ts";

function severity(value: string): "low" | "medium" | "high" {
  return value === "error" ? "high" : value === "warning" ? "medium" : "low";
}

function stringRecordsEqual(
  left: Readonly<Record<string, string>>,
  right: Readonly<Record<string, string>>,
): boolean {
  const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];
  return keys.every((key) => left[key] === right[key]);
}

export function analyzeTechnical(
  site: LoadedSite,
  routeKey: string,
  expectedUrl: string,
  locale: string,
  foundationIssues: readonly Record<string, unknown>[],
  rendered: import("../reports/schema.ts").RenderedPageEvidence | null,
  evidence: EvidenceReference[],
): SeoFinding[] {
  const findings: SeoFinding[] = [];
  for (const [index, issue] of foundationIssues.entries()) {
    const id = `foundation:${String(issue["ruleId"] ?? "unknown")}:${index + 1}`;
    evidence.push({
      id,
      kind: "foundation",
      label: String(issue["ruleId"] ?? "Foundation SEO issue"),
      value: String(issue["offendingValue"] ?? issue["fix"] ?? "Issue reported"),
    });
    findings.push({
      id: `finding:${id}`,
      category: "technical",
      severity: severity(String(issue["severity"] ?? "warning")),
      confidence: "high",
      summary: String(issue["ruleId"] ?? "Foundation SEO issue"),
      detail: String(
        issue["offendingValue"] ?? issue["fix"] ?? "Foundation SEO validation reported an issue.",
      ),
      evidenceIds: [id],
      ruleId: String(issue["ruleId"] ?? "FND-SEO"),
    });
  }
  if (!rendered) return findings;

  evidence.push({
    id: "rendered:response",
    kind: "rendered",
    label: "Rendered response",
    value: `status ${rendered.status ?? "unknown"}; final URL ${rendered.finalUrl}`,
  });
  if (rendered.status !== 200 || rendered.finalUrl !== expectedUrl) {
    findings.push({
      id: "finding:rendered:response",
      category: "technical",
      severity: "high",
      confidence: "high",
      summary: "Rendered page response differs from the canonical route",
      detail: `Expected HTTP 200 at ${expectedUrl}; observed ${rendered.status ?? "unknown"} at ${rendered.finalUrl}.`,
      evidenceIds: ["rendered:response"],
    });
  }

  const h1 = rendered.headings.filter((heading) => heading.level === 1);
  evidence.push({
    id: "rendered:h1",
    kind: "rendered",
    label: "Rendered H1 headings",
    value: h1.map((heading) => heading.text).join(" | ") || "none",
  });
  if (h1.length !== 1) {
    findings.push({
      id: "finding:rendered:h1-count",
      category: "heading",
      severity: "high",
      confidence: "high",
      summary: `Rendered page has ${h1.length} H1 headings`,
      detail: "An indexable page should render exactly one meaningful H1.",
      evidenceIds: ["rendered:h1"],
    });
  }

  const skippedHeadingLevel = rendered.headings.find(
    (heading, index) => index > 0 && heading.level > rendered.headings[index - 1]!.level + 1,
  );
  if (skippedHeadingLevel) {
    evidence.push({
      id: "rendered:heading-order",
      kind: "rendered",
      label: "Rendered heading outline",
      value: rendered.headings.map((heading) => `H${heading.level} ${heading.text}`).join(" | "),
    });
    findings.push({
      id: "finding:rendered:heading-order",
      category: "heading",
      severity: "low",
      confidence: "high",
      summary: "Rendered heading outline skips a level",
      detail: `The outline jumps to H${skippedHeadingLevel.level}. Review semantic hierarchy without choosing levels for visual size.`,
      evidenceIds: ["rendered:heading-order"],
    });
  }

  evidence.push({
    id: "rendered:canonical",
    kind: "rendered",
    label: "Rendered canonical",
    value: rendered.canonical ?? "none",
  });
  if (rendered.canonical !== expectedUrl) {
    findings.push({
      id: "finding:rendered:canonical",
      category: "technical",
      severity: "high",
      confidence: "high",
      summary: "Rendered canonical does not match the route-map URL",
      detail: `Expected ${expectedUrl}; rendered ${rendered.canonical ?? "none"}.`,
      evidenceIds: ["rendered:canonical"],
      ruleId: "FND-SEO-01",
    });
  }

  const expectedLang =
    site.config.locales.locales.find((candidate) => candidate.code === locale)?.htmlLang ?? locale;
  evidence.push({
    id: "rendered:lang",
    kind: "rendered",
    label: "Rendered document language",
    value: rendered.htmlLang ?? "none",
  });
  if (rendered.htmlLang !== expectedLang) {
    findings.push({
      id: "finding:rendered:lang",
      category: "technical",
      severity: "high",
      confidence: "high",
      summary: "Rendered document language does not match configured locale",
      detail: `Expected ${expectedLang}; rendered ${rendered.htmlLang ?? "none"}.`,
      evidenceIds: ["rendered:lang"],
      ruleId: "FND-SEO-01",
    });
  }

  const route = site.routes.find((candidate) => candidate.key === routeKey);
  const expectedHreflang = Object.fromEntries(
    site.config.locales.locales
      .filter((candidate) => route?.slugs[candidate.code] !== undefined)
      .map((candidate) => [
        candidate.hreflang,
        new URL(
          resolveRoutePath(routeKey, candidate.code, site.routes, site.defaultLocale),
          site.config.site,
        ).href,
      ]),
  );
  const xDefault = site.config.locales.locales.find(
    (candidate) => candidate.isXDefault && route?.slugs[candidate.code] !== undefined,
  );
  if (xDefault)
    expectedHreflang["x-default"] = new URL(
      resolveRoutePath(routeKey, xDefault.code, site.routes, site.defaultLocale),
      site.config.site,
    ).href;
  evidence.push({
    id: "rendered:hreflang",
    kind: "rendered",
    label: "Rendered hreflang keys",
    value: Object.keys(rendered.hreflang).sort().join(", ") || "none",
  });
  if (!stringRecordsEqual(rendered.hreflang, expectedHreflang)) {
    findings.push({
      id: "finding:rendered:hreflang",
      category: "technical",
      severity: "high",
      confidence: "high",
      summary: "Rendered hreflang links do not match configured localized routes",
      detail: `Expected ${JSON.stringify(expectedHreflang)}; rendered ${JSON.stringify(rendered.hreflang)}.`,
      evidenceIds: ["rendered:hreflang"],
      ruleId: "FND-SEO-01",
    });
  }

  const source = site.contentByPair.get(`${routeKey}:${locale}`)?.source;
  const expectedTitle = composeTitle(source?.seoTitle ?? "", site.config.brand);
  evidence.push({
    id: "rendered:metadata",
    kind: "rendered",
    label: "Source-to-rendered metadata",
    value: `title ${rendered.title ?? "none"}; description ${rendered.description ?? "none"}`,
  });
  if (rendered.title !== expectedTitle || rendered.description !== source?.seoDescription) {
    findings.push({
      id: "finding:rendered:metadata",
      category: "metadata",
      severity: "high",
      confidence: "high",
      summary: "Rendered metadata does not match the localized source and title template",
      detail: "Review Page metadata wiring and the active title composition contract.",
      evidenceIds: ["rendered:metadata", "source:page"],
    });
  }

  if (
    (rendered.robots ?? "")
      .toLocaleLowerCase()
      .split(/\s*,\s*/)
      .includes("noindex")
  ) {
    evidence.push({
      id: "rendered:robots",
      kind: "rendered",
      label: "Rendered robots directive",
      value: rendered.robots ?? "none",
    });
    findings.push({
      id: "finding:rendered:robots",
      category: "technical",
      severity: "high",
      confidence: "high",
      summary: "Indexable target renders a noindex directive",
      detail:
        "The selected research target is indexable in site authorities but the rendered page says noindex.",
      evidenceIds: ["rendered:robots"],
    });
  }

  if (rendered.invalidJsonLdCount > 0) {
    evidence.push({
      id: "rendered:jsonld-invalid",
      kind: "rendered",
      label: "Invalid JSON-LD blocks",
      value: String(rendered.invalidJsonLdCount),
    });
    findings.push({
      id: "finding:rendered:jsonld-invalid",
      category: "structured-data",
      severity: "high",
      confidence: "high",
      summary: "Rendered page contains invalid JSON-LD",
      detail: `${rendered.invalidJsonLdCount} JSON-LD block(s) could not be parsed.`,
      evidenceIds: ["rendered:jsonld-invalid"],
    });
  }

  const missingAlt = rendered.images.filter((image) => image.alt === null).length;
  const missingDimensions = rendered.images.filter(
    (image) => image.width === null || image.height === null,
  ).length;
  if (missingAlt > 0 || missingDimensions > 0) {
    evidence.push({
      id: "rendered:images",
      kind: "rendered",
      label: "Rendered image metadata",
      value: `${missingAlt} missing alt attribute; ${missingDimensions} missing explicit dimensions`,
    });
    findings.push({
      id: "finding:rendered:images",
      category: "image",
      severity: missingAlt > 0 ? "medium" : "low",
      confidence: "high",
      summary: "Rendered images need metadata review",
      detail: `${missingAlt} image(s) omit the alt attribute and ${missingDimensions} image(s) omit width or height. Empty alt attributes remain valid for decorative images.`,
      evidenceIds: ["rendered:images"],
    });
  }
  return findings;
}
