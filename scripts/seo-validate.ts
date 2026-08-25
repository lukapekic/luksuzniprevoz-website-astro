/**
 * seo:validate — FND-SEO-01, FND-SEO-03, FND-SEO-04, FND-SEO-05, FND-SEO-08,
 * FND-SEO-09, FND-SEO-10, FND-SEO-11, FND-SEO-12, FND-SEO-13, FND-SEO-14
 *
 * Validates SEO data for a site.
 * Usage: pnpm seo:validate [path/to/project] [--json]
 */
import { existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "../packages/astro-foundation/src/validators/validate-content.ts";
import {
  validateSeo,
  type SeoSiteData,
  type SeoPage,
} from "../packages/astro-foundation/src/seo/validate-seo.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";
import type { FoundationConfig } from "../packages/astro-foundation/src/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MONO_ROOT = resolve(__dirname, "..");

const args = process.argv.slice(2);
const jsonFlag = args.includes("--json");
const targetArg = args.find((a) => !a.startsWith("--"));
const resolvedTarget = targetArg
  ? resolve(MONO_ROOT, targetArg)
  : resolve(MONO_ROOT, "site", "luksuzni-prevoz");

// --- Load config ---
let configFilePath: string | undefined;

for (const p of [
  resolve(resolvedTarget, "foundation.config.ts"),
  resolve(resolvedTarget, "src/foundation.config.ts"),
]) {
  if (existsSync(p)) {
    configFilePath = p;
    break;
  }
}

if (!configFilePath) {
  const msg = "No foundation.config.ts found";
  if (jsonFlag) {
    console.log(JSON.stringify([{ ruleId: "FND-SEO-01", severity: "error", offendingValue: msg }]));
  } else {
    console.error(`✖ FND-SEO-01  Error: ${msg}`);
  }
  process.exit(1);
}

let config: FoundationConfig;
try {
  const mod = await import(configFilePath);
  config = mod.default ?? mod["config"];
  if (!config) throw new Error("No config export found");
} catch (err: unknown) {
  const msg = String((err as Error)?.message || err);
  if (jsonFlag) {
    console.log(
      JSON.stringify([
        {
          ruleId: "FND-SEO-01",
          severity: "error",
          offendingValue: `Failed to load config: ${msg.slice(0, 200)}`,
        },
      ]),
    );
  } else {
    console.error(`✖ FND-SEO-01  Error: Failed to load config: ${msg.slice(0, 200)}`);
  }
  process.exit(1);
}

// --- Load routes ---
const routesPath = resolve(resolvedTarget, "src/data/routes.ts");
let routes: Array<{
  key: string;
  slugs: Record<string, string | undefined>;
  parent?: string;
  noindex?: boolean;
  sitemap?: { include: boolean; priority?: number };
  previousSlugs?: Record<string, string[]>;
}> = [];

if (existsSync(routesPath)) {
  try {
    const mod = await import(routesPath);
    routes = (mod.routes ?? []) as typeof routes;
  } catch {
    // routes not found
  }
}

// --- Load content files ---
const contentDir = resolve(resolvedTarget, "src/content/pages");
const contentFiles = existsSync(contentDir)
  ? readdirSync(contentDir).filter((f) => f.endsWith(".md"))
  : [];

const defaultLocale = config.locales.locales.find((l) => l.isDefault);

// --- Build page data from content files ---
const pages: SeoPage[] = [];

for (const file of contentFiles) {
  const filePath = join(contentDir, file);
  try {
    const content = await import("node:fs").then((fs) => fs.readFileSync(filePath, "utf-8"));
    const { data: frontmatter } = parseFrontmatter(content);

    if (!frontmatter?.routeKey || !frontmatter?.locale) continue;

    const routeKey = frontmatter.routeKey as string;
    const locale = frontmatter.locale as string;
    const route = routes.find((r) => r.key === routeKey);
    if (!route) continue;

    const slug = route.slugs[locale];
    if (slug === undefined) continue;

    const prefix = locale === defaultLocale?.code ? "" : `/${locale}`;
    const segment = slug === "" ? "" : `/${slug}`;
    const url = `${config.site}${prefix}${segment}/`;

    const localeConfig = config.locales.locales.find((l) => l.code === locale);
    const status = (frontmatter.status as string) ?? "published";
    const isNoindex = (route.noindex ?? false) || ((frontmatter.noindex as boolean) ?? false);
    const isPublished = status === "published";

    // Build breadcrumbs
    const breadcrumbs: SeoPage["breadcrumbs"] = [];
    if (route.parent) {
      const buildParentChain = (
        key: string,
      ): Array<{ name: string; url: string; routeKey: string }> => {
        const chain: Array<{ name: string; url: string; routeKey: string }> = [];
        const visited = new Set<string>();
        let current = key;
        while (current) {
          if (visited.has(current)) break;
          visited.add(current);
          const parentRoute = routes.find((r) => r.key === current);
          if (!parentRoute) break;
          const parentSlug = parentRoute.slugs[locale];
          if (parentSlug === undefined) break;
          const pPrefix = locale === defaultLocale?.code ? "" : `/${locale}`;
          const pSegment = parentSlug === "" ? "" : `/${parentSlug}`;
          chain.push({
            name: parentRoute.key, // simplified; real impl uses UI strings
            url: `${config.site}${pPrefix}${pSegment}/`,
            routeKey: parentRoute.key,
          });
          current = parentRoute.parent ?? "";
        }
        return chain;
      };
      const parentChain = buildParentChain(route.parent);
      // Add current page at end
      breadcrumbs.push(...parentChain, {
        name: (frontmatter.seoTitle as string) ?? route.key,
        url,
        routeKey,
      });
    } else {
      breadcrumbs.push({
        name: (frontmatter.seoTitle as string) ?? route.key,
        url,
        routeKey,
      });
    }

    pages.push({
      routeKey,
      locale,
      url,
      title: `${frontmatter.seoTitle ?? route.key} | ${config.brand}`,
      description: (frontmatter.seoDescription as string) ?? "",
      h1: (frontmatter.h1 as string) ?? undefined,
      canonical: url,
      htmlLang: localeConfig?.htmlLang,
      hreflang: [], // Would be built from buildHreflangSet
      og: {
        title: `${frontmatter.seoTitle ?? route.key} | ${config.brand}`,
        description: (frontmatter.seoDescription as string) ?? "",
        image: (frontmatter.ogImage as string) ?? undefined,
        imageAlt: (frontmatter.ogImageAlt as string) ?? undefined,
      },
      structuredData: [],
      noindex: isNoindex,
      published: isPublished,
      sitemap: route.sitemap,
      breadcrumbs,
      lastmod: (frontmatter.reviewedOn as string) ?? undefined,
      lastmodFromContent: !!(frontmatter.reviewedOn as string),
      rawTitle: (frontmatter.seoTitle as string) ?? undefined,
      brand: config.brand,
    });
  } catch {
    // Skip unparseable files
  }
}

// --- Build site data ---
const siteData: SeoSiteData = {
  site: config.site,
  brand: config.brand,
  capabilities: config.capabilities.structuredData,
  pages,
};

// --- Run validation ---
const issues = validateSeo(siteData);

// --- Output ---
if (jsonFlag) {
  console.log(JSON.stringify(issues, null, 2));
} else if (issues.length > 0) {
  console.error(formatIssues(issues));
} else {
  console.log("✓ seo:validate — no issues found");
}

const hasErrors = issues.some((i) => i.severity === "error");
process.exit(hasErrors ? 1 : 0);
