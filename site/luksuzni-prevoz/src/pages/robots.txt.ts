/**
 * robots.txt endpoint — FND-ENV-02.
 *
 * Emits a disallow-all robots.txt in non-production environments (so preview
 * branches are never crawled) and a permissive sitemap-referencing one in
 * production. The production/non-production split is driven by the
 * `PROD_ROBOTS` env var so the build is deterministic for a given environment:
 * set `PROD_ROBOTS=1` when building for the production deploy.
 */
import type { APIRoute } from "astro";

const isProd = import.meta.env.PROD_ROBOTS === "1" || process.env.PROD_ROBOTS === "1";

const body = isProd
  ? `# Production robots.txt — allow crawling, reference the sitemap.
User-agent: *
Allow: /

Sitemap: https://reference-site.astro-foundation.dev/sitemap-index.xml
`
  : `# Non-production robots.txt — disallow all crawling (FND-ENV-02).
User-agent: *
Disallow: /
`;

export const GET: APIRoute = () =>
  new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
