import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildSitemap } from "../lib/sitemap.ts";
import { isProductionBuild } from "../lib/deployment-environment.ts";

export const prerender = true;
export const GET: APIRoute = async () => {
  const pages = await getCollection("pages");
  return new Response(buildSitemap(isProductionBuild() ? pages.map((page) => page.data) : []), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
