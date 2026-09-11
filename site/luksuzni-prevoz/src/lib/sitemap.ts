import type { LocaleCode, RouteKey } from "@astro-foundation/core";
import { getPath } from "@astro-foundation/core/i18n";
import { config } from "../../foundation.config.ts";
import { routes, getRoute } from "../data/routes.ts";
import { defaultLocale, getLocaleConfig } from "../data/locales.ts";

interface SitemapPage {
  routeKey: string;
  locale: LocaleCode;
  status: string;
  noindex?: boolean;
}

/** XML escaping belongs to serialization, after route helpers resolve URLs. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&apos;");
}

/** Build-only sitemap; the same publication gates as page generation apply. */
export function buildSitemap(pages: readonly SitemapPage[]): string {
  const indexable = pages.filter((page) => {
    const route = getRoute(page.routeKey);
    return (
      page.status === "published" &&
      !page.noindex &&
      !route.noindex &&
      route.availability === "published" &&
      route.sitemap?.include !== false
    );
  });
  const url = (page: SitemapPage): string =>
    `${config.site}${getPath(page.routeKey as RouteKey, page.locale, routes, defaultLocale)}`;
  const entries = indexable.map((page) => {
    const siblings = indexable.filter((candidate) => candidate.routeKey === page.routeKey);
    const alternates = siblings.map(
      (sibling) =>
        `<xhtml:link rel="alternate" hreflang="${escapeXml(getLocaleConfig(sibling.locale).hreflang)}" href="${escapeXml(url(sibling))}"/>`,
    );
    const xDefault = siblings.find((sibling) => getLocaleConfig(sibling.locale).isXDefault);
    if (xDefault)
      alternates.push(
        `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(url(xDefault))}"/>`,
      );
    return `<url><loc>${escapeXml(url(page))}</loc>${alternates.join("")}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join("")}</urlset>\n`;
}
