import type { SourcePageEvidence } from "../reports/schema.ts";
import type { DiscoveredContent } from "./discover-content.ts";

const NON_EDITORIAL_FIELDS = new Set([
  "routeKey",
  "locale",
  "pageType",
  "status",
  "translationState",
  "sourceLocale",
  "sourceDigest",
  "reviewedOn",
  "noindex",
  "scaffold",
  "targetPageType",
]);

export function flattenTextFields(
  value: unknown,
  prefix = "",
  result: Record<string, string> = {},
): Record<string, string> {
  if (typeof value === "string") {
    if (prefix && !NON_EDITORIAL_FIELDS.has(prefix)) result[prefix] = value;
    return result;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => flattenTextFields(entry, `${prefix}[${index}]`, result));
    return result;
  }
  if (value && typeof value === "object") {
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${key}` : key;
      if (!NON_EDITORIAL_FIELDS.has(key)) flattenTextFields(nested, next, result);
    }
  }
  return result;
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function buildSourcePageEvidence(content: DiscoveredContent): SourcePageEvidence {
  const frontmatter = content.frontmatter;
  const textFields = flattenTextFields(frontmatter);
  if (content.body.trim()) textFields["body"] = content.body.trim();
  const hero = frontmatter["hero"];
  const heroTitle =
    hero && typeof hero === "object" && !Array.isArray(hero)
      ? nullableString((hero as Record<string, unknown>)["title"])
      : null;
  const joined = Object.values(textFields)
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

  return {
    pageType: String(frontmatter["pageType"] ?? "unknown"),
    status: String(frontmatter["status"] ?? "draft"),
    translationState: String(frontmatter["translationState"] ?? "missing"),
    noindex: frontmatter["noindex"] === true,
    seoTitle: nullableString(frontmatter["seoTitle"]),
    seoDescription: nullableString(frontmatter["seoDescription"]),
    primaryHeading: nullableString(frontmatter["h1"]) ?? heroTitle,
    textFields,
    textExcerpt: joined.slice(0, 6_000),
  };
}
