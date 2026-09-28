/**
 * robots.txt endpoint — FND-ENV-02.
 *
 * Emits a disallow-all robots.txt in non-production environments (so preview
 * branches are never crawled) and a permissive sitemap-referencing one in
 * production. The production/non-production split is driven by the
 * `SITE_ENVIRONMENT` build variable selects production or preview.
 */
import type { APIRoute } from "astro";
import { config } from "../../foundation.config.ts";
import { isProductionBuild } from "../lib/deployment-environment.ts";

const isProd = isProductionBuild();

const body = isProd
  ? `# Production robots.txt — allow crawling, reference the sitemap.
User-agent: *
Allow: /

Sitemap: ${config.site}/sitemap-index.xml
`
  : `# Non-production robots.txt — disallow all crawling (FND-ENV-02).
User-agent: *
Disallow: /
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
