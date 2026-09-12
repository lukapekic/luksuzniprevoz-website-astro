import type { CompetitorEvidence } from "../reports/schema.ts";
import { parseRenderedHtml } from "./rendered-page.ts";
import { isAllowedByRobots } from "./robots.ts";
import { safeFetchText, type SafeFetchOptions } from "./safe-fetch.ts";

export async function collectCompetitorPage(
  url: string,
  source: "serp" | "configured",
  options: SafeFetchOptions & { readonly respectRobots?: boolean; readonly now?: () => Date },
): Promise<CompetitorEvidence | null> {
  if ((options.respectRobots ?? true) && !(await isAllowedByRobots(url, options))) return null;
  const response = await safeFetchText(url, options);
  const page = parseRenderedHtml(response.text, url, response.url, response.status);
  return {
    url: page.finalUrl,
    domain: new URL(page.finalUrl).hostname.toLowerCase(),
    fetchedAt: (options.now ?? (() => new Date()))().toISOString(),
    source,
    title: page.title,
    description: page.description,
    canonical: page.canonical,
    robots: page.robots,
    headings: page.headings.slice(0, 40),
    textExcerpt: page.textExcerpt.slice(0, 2_000),
    jsonLdTypes: page.jsonLdTypes,
  };
}
