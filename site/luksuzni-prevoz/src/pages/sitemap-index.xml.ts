import type { APIRoute } from "astro";
import { config } from "../../foundation.config.ts";
import { escapeXml } from "../lib/sitemap.ts";

export const prerender = true;
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${escapeXml(config.site)}/sitemap-pages.xml</loc></sitemap></sitemapindex>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
