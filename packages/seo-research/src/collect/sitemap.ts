import { parse } from "parse5";
import type { SafeFetchOptions } from "./safe-fetch.ts";
import { safeFetchText } from "./safe-fetch.ts";

interface XmlNode {
  readonly nodeName: string;
  readonly tagName?: string;
  readonly value?: string;
  readonly childNodes?: readonly XmlNode[];
}

export interface SitemapSnapshot {
  readonly url: string;
  readonly fetchedAt: string;
  readonly entries: readonly string[];
}

export interface SitemapDiff {
  readonly added: readonly string[];
  readonly removed: readonly string[];
}

function text(node: XmlNode): string {
  if (node.nodeName === "#text") return node.value ?? "";
  return (node.childNodes ?? []).map(text).join("");
}

function visit(node: XmlNode, callback: (node: XmlNode) => void): void {
  callback(node);
  for (const child of node.childNodes ?? []) visit(child, callback);
}

export function parseSitemap(xml: string): {
  readonly index: boolean;
  readonly locations: readonly string[];
} {
  const document = parse(xml) as unknown as XmlNode;
  const locations = new Set<string>();
  let index = false;
  visit(document, (node) => {
    if (node.tagName?.toLowerCase() === "sitemapindex") index = true;
    if (node.tagName?.toLowerCase() === "loc") {
      const value = text(node).trim();
      try {
        locations.add(new URL(value).href);
      } catch {
        // Invalid sitemap entries are ignored and do not become fetch targets.
      }
    }
  });
  return { index, locations: [...locations].sort() };
}

export async function collectSitemap(
  sitemapUrl: string,
  options: SafeFetchOptions & { readonly now?: () => Date; readonly maxChildSitemaps?: number },
): Promise<SitemapSnapshot> {
  const response = await safeFetchText(sitemapUrl, {
    ...options,
    acceptedContentTypes: ["application/xml", "text/xml", "text/plain"],
  });
  const parsed = parseSitemap(response.text);
  const entries = new Set<string>();
  if (!parsed.index) parsed.locations.forEach((entry) => entries.add(entry));
  else {
    const childLimit = options.maxChildSitemaps ?? 20;
    for (const childUrl of parsed.locations.slice(0, childLimit)) {
      const childResponse = await safeFetchText(childUrl, {
        ...options,
        acceptedContentTypes: ["application/xml", "text/xml", "text/plain"],
      });
      const child = parseSitemap(childResponse.text);
      if (!child.index) child.locations.forEach((entry) => entries.add(entry));
    }
  }
  return {
    url: response.url,
    fetchedAt: (options.now ?? (() => new Date()))().toISOString(),
    entries: [...entries].sort(),
  };
}

export function diffSitemaps(
  previous: SitemapSnapshot | null,
  current: SitemapSnapshot,
): SitemapDiff {
  const before = new Set(previous?.entries ?? []);
  const after = new Set(current.entries);
  return {
    added: current.entries.filter((entry) => !before.has(entry)),
    removed: [...before].filter((entry) => !after.has(entry)).sort(),
  };
}
