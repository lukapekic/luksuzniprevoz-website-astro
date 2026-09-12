import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "parse5";
import type { RenderedPageEvidence } from "../reports/schema.ts";

interface HtmlAttribute {
  readonly name: string;
  readonly value: string;
}

interface HtmlNode {
  readonly nodeName: string;
  readonly tagName?: string;
  readonly value?: string;
  readonly attrs?: readonly HtmlAttribute[];
  readonly childNodes?: readonly HtmlNode[];
}

const SKIP_TEXT_TAGS = new Set(["script", "style", "noscript", "template", "svg"]);

function walk(node: HtmlNode, visit: (node: HtmlNode) => void): void {
  visit(node);
  for (const child of node.childNodes ?? []) walk(child, visit);
}

function attribute(node: HtmlNode, name: string): string | null {
  return (
    node.attrs?.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase())?.value ??
    null
  );
}

function textContent(node: HtmlNode, skipHidden = false): string {
  if (node.nodeName === "#text") return node.value ?? "";
  const tag = node.tagName?.toLowerCase();
  if (tag && SKIP_TEXT_TAGS.has(tag)) return "";
  if (
    skipHidden &&
    (attribute(node, "hidden") !== null || attribute(node, "aria-hidden") === "true")
  )
    return "";
  return (node.childNodes ?? []).map((child) => textContent(child, skipHidden)).join(" ");
}

function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function intAttribute(node: HtmlNode, name: string): number | null {
  const raw = attribute(node, name);
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function collectJsonLdTypes(value: unknown, result: Set<string>): void {
  if (Array.isArray(value)) {
    value.forEach((entry) => collectJsonLdTypes(entry, result));
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  const type = record["@type"];
  if (typeof type === "string") result.add(type);
  else if (Array.isArray(type))
    type
      .filter((entry): entry is string => typeof entry === "string")
      .forEach((entry) => result.add(entry));
  if (record["@graph"]) collectJsonLdTypes(record["@graph"], result);
}

export function parseRenderedHtml(
  html: string,
  requestedUrl: string,
  finalUrl = requestedUrl,
  status: number | null = null,
): RenderedPageEvidence {
  const document = parse(html) as unknown as HtmlNode;
  let htmlNode: HtmlNode | null = null;
  let title: string | null = null;
  let description: string | null = null;
  let canonical: string | null = null;
  let robots: string | null = null;
  let invalidJsonLdCount = 0;
  const hreflang: Record<string, string> = {};
  const openGraph: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  const headings: RenderedPageEvidence["headings"] = [];
  const internalLinks: RenderedPageEvidence["internalLinks"] = [];
  const images: RenderedPageEvidence["images"] = [];
  const jsonLdTypes = new Set<string>();

  walk(document, (node) => {
    const tag = node.tagName?.toLowerCase();
    if (tag === "html") htmlNode = node;
    if (tag === "title" && title === null) title = cleanText(textContent(node));
    if (tag === "meta") {
      const name = (attribute(node, "name") ?? attribute(node, "property"))?.toLowerCase();
      const content = attribute(node, "content");
      if (!name || content === null) return;
      if (name === "description" && description === null) description = content;
      else if (name === "robots" && robots === null) robots = content;
      else if (name.startsWith("og:")) openGraph[name] = content;
      else if (name.startsWith("twitter:")) twitter[name] = content;
    }
    if (tag === "link") {
      const rel = (attribute(node, "rel") ?? "").toLowerCase().split(/\s+/);
      const href = attribute(node, "href");
      if (!href) return;
      if (rel.includes("canonical") && canonical === null) canonical = href;
      if (rel.includes("alternate")) {
        const language = attribute(node, "hreflang");
        if (language) hreflang[language] = href;
      }
    }
    if (tag && /^h[1-6]$/.test(tag)) {
      headings.push({
        level: Number(tag[1]),
        text: cleanText(textContent(node, true)),
        id: attribute(node, "id"),
      });
    }
    if (tag === "a") {
      const href = attribute(node, "href");
      if (href) {
        try {
          const resolved = new URL(href, finalUrl);
          if (resolved.origin === new URL(finalUrl).origin)
            internalLinks.push({ href: resolved.href, text: cleanText(textContent(node, true)) });
        } catch {
          // Ignore invalid author-provided URLs; route/content validators surface local errors.
        }
      }
    }
    if (tag === "img") {
      const src = attribute(node, "src");
      if (src)
        images.push({
          src,
          alt: attribute(node, "alt"),
          width: intAttribute(node, "width"),
          height: intAttribute(node, "height"),
          loading: attribute(node, "loading"),
        });
    }
    if (tag === "script" && attribute(node, "type")?.toLowerCase() === "application/ld+json") {
      const raw = cleanText(textContent({ ...node, tagName: undefined }));
      if (!raw) return;
      try {
        collectJsonLdTypes(JSON.parse(raw), jsonLdTypes);
      } catch {
        invalidJsonLdCount += 1;
      }
    }
  });

  const root = htmlNode as HtmlNode | null;
  const parsedTitle = title as string | null;
  const bodyText = cleanText(textContent(document, true));
  return {
    requestedUrl,
    finalUrl,
    status,
    htmlLang: root ? attribute(root, "lang") : null,
    dir: root ? attribute(root, "dir") : null,
    title: parsedTitle && parsedTitle.length > 0 ? parsedTitle : null,
    description,
    canonical,
    robots,
    hreflang,
    openGraph,
    twitter,
    headings,
    textExcerpt: bodyText.slice(0, 6_000),
    internalLinks: internalLinks.slice(0, 500),
    images: images.slice(0, 500),
    jsonLdTypes: [...jsonLdTypes].sort(),
    invalidJsonLdCount,
  };
}

export function builtHtmlPath(projectDirectory: string, pathname: string): string {
  const relativePath = pathname.replace(/^\/+|\/+$/g, "");
  return relativePath
    ? resolve(projectDirectory, "dist", relativePath, "index.html")
    : resolve(projectDirectory, "dist", "index.html");
}

export async function collectBuiltPage(
  projectDirectory: string,
  url: string,
): Promise<RenderedPageEvidence> {
  const parsed = new URL(url);
  const filePath = builtHtmlPath(projectDirectory, parsed.pathname);
  const html = await readFile(filePath, "utf8");
  return parseRenderedHtml(html, url, url, 200);
}
