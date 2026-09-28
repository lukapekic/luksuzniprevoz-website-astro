import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getSiteEnvironment } from "../src/lib/deployment-environment.ts";

const environment = getSiteEnvironment();
const distPath = resolve(import.meta.dirname, "../dist");
const headersPath = resolve(import.meta.dirname, "../dist/_headers");
const headers = await readFile(headersPath, "utf8");
if (!headers.startsWith("/*\n")) {
  throw new Error(
    "Expected the global Cloudflare Pages _headers rule at the start of dist/_headers",
  );
}
if (headers.includes("X-Robots-Tag:")) {
  throw new Error("Unexpected existing X-Robots-Tag in dist/_headers");
}

if (environment === "preview") {
  await writeFile(
    headersPath,
    headers.replace("/*\n", "/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n"),
  );
}

const [robots, sitemapIndex, sitemapPages, home] = await Promise.all([
  readFile(resolve(distPath, "robots.txt"), "utf8"),
  readFile(resolve(distPath, "sitemap-index.xml"), "utf8"),
  readFile(resolve(distPath, "sitemap-pages.xml"), "utf8"),
  readFile(resolve(distPath, "index.html"), "utf8"),
]);
const production = environment === "production";
if (
  robots.includes(production ? "Disallow: /" : "Allow: /") ||
  !robots.includes(production ? "Allow: /" : "Disallow: /") ||
  sitemapIndex.includes("<sitemap>") !== production ||
  sitemapPages.includes("<url>") !== production ||
  home.includes('name="robots" content="noindex') === production ||
  home.includes('rel="canonical"') !== production
) {
  throw new Error(`Inconsistent ${environment} indexing artifacts in dist/`);
}

console.log(`Finalized ${environment} Cloudflare Pages headers`);
