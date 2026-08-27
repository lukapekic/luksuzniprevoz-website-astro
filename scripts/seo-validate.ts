/**
 * seo:validate — FND-SEO-01, FND-SEO-03, FND-SEO-04, FND-SEO-05, FND-SEO-08,
 * FND-SEO-09, FND-SEO-10, FND-SEO-11, FND-SEO-12, FND-SEO-13, FND-SEO-14
 *
 * Validates SEO data for a site.
 * Usage: pnpm seo:validate [path/to/project] [--json]
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parseFrontmatter } from "../packages/astro-foundation/src/validators/validate-content.ts";
import {
  validateSeo,
  type SeoSiteData,
  type SeoPage,
} from "../packages/astro-foundation/src/seo/validate-seo.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";
import type { FoundationIssue } from "../packages/astro-foundation/src/core/errors.ts";
import type { FoundationConfig } from "../packages/astro-foundation/src/index.ts";
import { getPath } from "../packages/astro-foundation/src/i18n/get-path.ts";
import { discoverMarkdownFiles } from "./lib/discover-content.ts";
import { composeTitle } from "../packages/astro-foundation/src/seo/seo-data.ts";

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
  } catch (error) {
    const msg = `Failed to load route map: ${String((error as Error)?.message || error).slice(0, 200)}`;
    if (jsonFlag)
      console.log(
        JSON.stringify({
          summary: { discovered: 0, validated: 0, skipped: 0, failed: 1 },
          issues: [{ ruleId: "FND-SEO-01", severity: "error", offendingValue: msg }],
        }),
      );
    else console.error(`✖ FND-SEO-01  Error: ${msg}`);
    process.exit(1);
  }
}

if (routes.length === 0) {
  const issue: FoundationIssue = {
    ruleId: "FND-SEO-01",
    severity: "error",
    filePath: relative(MONO_ROOT, routesPath),
    offendingValue: "SEO validation discovered no routes",
    fix: "Export the validated route map from src/data/routes.ts",
  };
  if (jsonFlag)
    console.log(
      JSON.stringify(
        { summary: { discovered: 0, validated: 0, skipped: 0, failed: 1 }, issues: [issue] },
        null,
        2,
      ),
    );
  else console.error(formatIssues([issue]));
  process.exit(1);
}

// --- Load content files ---
const contentDir = resolve(resolvedTarget, "src/content/pages");
const contentFiles = discoverMarkdownFiles(contentDir);

const defaultLocale = config.locales.locales.find((l) => l.isDefault);
if (!defaultLocale) throw new Error("foundation.config.ts must declare a default locale");

const navigationRouteKeys = new Set<string>(["home"]);
const navigationPath = resolve(resolvedTarget, "src/data/navigation.ts");
if (existsSync(navigationPath)) {
  const navigationModule = await import(navigationPath);
  const visit = (value: unknown, key = ""): void => {
    if (key === "routeKey" && typeof value === "string") navigationRouteKeys.add(value);
    if (Array.isArray(value)) value.forEach((item) => visit(item));
    else if (value && typeof value === "object") {
      for (const [childKey, child] of Object.entries(value as Record<string, unknown>)) {
        visit(child, childKey);
      }
    }
  };
  visit(navigationModule.navigation);
}

// --- Build page data from content files ---
const pages: SeoPage[] = [];
const discoveryIssues: FoundationIssue[] = [];
const discoveredPairs = new Set<string>();
let skippedFiles = 0;

for (const filePath of contentFiles) {
  const reportPath = relative(MONO_ROOT, filePath);
  try {
    const content = readFileSync(filePath, "utf-8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter?.routeKey || !frontmatter?.locale) {
      skippedFiles++;
      discoveryIssues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: reportPath,
        offendingValue: "Content file has missing or unparseable routeKey/locale frontmatter",
        fix: "Correct the YAML frontmatter; SEO validation never silently skips eligible content",
      });
      continue;
    }

    const routeKey = frontmatter.routeKey as string;
    const locale = frontmatter.locale as string;
    const route = routes.find((r) => r.key === routeKey);
    if (!route) {
      skippedFiles++;
      discoveryIssues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: reportPath,
        offendingValue: `Unknown routeKey "${routeKey}"`,
        fix: "Use a routeKey exported by src/data/routes.ts",
      });
      continue;
    }

    const slug = route.slugs[locale];
    if (slug === undefined) {
      skippedFiles++;
      discoveryIssues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: reportPath,
        offendingValue: `Route "${routeKey}" has no slug for locale "${locale}"`,
        fix: "Restore route/content locale parity",
      });
      continue;
    }

    const pair = `${routeKey}/${locale}`;
    if (discoveredPairs.has(pair)) {
      discoveryIssues.push({
        ruleId: "FND-SEO-03",
        severity: "error",
        filePath: reportPath,
        offendingValue: `Duplicate content entry for ${pair}`,
        fix: "Keep exactly one content source per route and locale",
      });
      continue;
    }
    discoveredPairs.add(pair);

    const routePath = getPath(
      routeKey as never,
      locale as never,
      routes,
      defaultLocale.code as never,
    );
    const url = new URL(routePath, config.site).href;

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
          const parentPath = getPath(
            parentRoute.key as never,
            locale as never,
            routes,
            defaultLocale.code as never,
          );
          chain.push({
            name: parentRoute.key, // simplified; real impl uses UI strings
            url: new URL(parentPath, config.site).href,
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
      title: composeTitle(String(frontmatter.seoTitle ?? route.key), config.brand),
      description: (frontmatter.seoDescription as string) ?? "",
      h1: (frontmatter.h1 as string) ?? undefined,
      canonical: url,
      htmlLang: localeConfig?.htmlLang,
      hreflang: route.noindex
        ? []
        : config.locales.locales
            .filter((candidate) => route.slugs[candidate.code] !== undefined)
            .map((candidate) => ({
              hreflang: candidate.hreflang,
              href: new URL(
                getPath(
                  routeKey as never,
                  candidate.code as never,
                  routes,
                  defaultLocale.code as never,
                ),
                config.site,
              ).href,
            }))
            .concat(
              config.locales.locales
                .filter(
                  (candidate) => candidate.isXDefault && route.slugs[candidate.code] !== undefined,
                )
                .map((candidate) => ({
                  hreflang: "x-default",
                  href: new URL(
                    getPath(
                      routeKey as never,
                      candidate.code as never,
                      routes,
                      defaultLocale.code as never,
                    ),
                    config.site,
                  ).href,
                })),
            ),
      og: {
        title: composeTitle(String(frontmatter.seoTitle ?? route.key), config.brand),
        description: (frontmatter.seoDescription as string) ?? "",
        image: (frontmatter.ogImage as string) ?? undefined,
        imageAlt: (frontmatter.ogImageAlt as string) ?? undefined,
      },
      structuredData: [],
      noindex: isNoindex,
      published: isPublished,
      sitemap: route.sitemap,
      breadcrumbs,
      internalLinks: [...navigationRouteKeys]
        .map((key) => routes.find((candidate) => candidate.key === key))
        .filter((candidate) => candidate?.slugs[locale] !== undefined)
        .map(
          (candidate) =>
            new URL(
              getPath(
                candidate!.key as never,
                locale as never,
                routes,
                defaultLocale.code as never,
              ),
              config.site,
            ).href,
        ),
      lastmod: (frontmatter.reviewedOn as string) ?? undefined,
      lastmodFromContent: !!(frontmatter.reviewedOn as string),
      rawTitle: (frontmatter.seoTitle as string) ?? undefined,
      brand: config.brand,
    });
  } catch (error) {
    skippedFiles++;
    discoveryIssues.push({
      ruleId: "FND-SEO-01",
      severity: "error",
      filePath: reportPath,
      offendingValue: `Failed to read or validate content: ${String((error as Error)?.message || error).slice(0, 200)}`,
      fix: "Correct the content source; SEO validation does not permit unreadable files",
    });
  }
}

if (contentFiles.length === 0) {
  discoveryIssues.push({
    ruleId: "FND-SEO-01",
    severity: "error",
    filePath: relative(MONO_ROOT, contentDir),
    offendingValue: "SEO validation discovered zero Markdown content files",
    fix: "Restore src/content/pages or correct the validator target",
  });
}

const routeKeysWithContent = new Set(pages.map((page) => page.routeKey));
for (const routeKey of routeKeysWithContent) {
  const route = routes.find((candidate) => candidate.key === routeKey)!;
  for (const locale of config.locales.locales) {
    if (route.slugs[locale.code] === undefined) continue;
    const pair = `${routeKey}/${locale.code}`;
    if (!discoveredPairs.has(pair)) {
      discoveryIssues.push({
        ruleId: "FND-SEO-01",
        severity: "error",
        filePath: relative(MONO_ROOT, contentDir),
        offendingValue: `Missing localized content for ${pair}`,
        fix: "Restore required route/locale content parity",
      });
    }
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
const issues = [...discoveryIssues, ...validateSeo(siteData)];
const summary = {
  discovered: contentFiles.length,
  validated: pages.length,
  skipped: skippedFiles,
  failed: issues.filter((issue) => issue.severity === "error").length,
};

// --- Output ---
if (jsonFlag) {
  console.log(JSON.stringify({ summary, issues }, null, 2));
} else if (issues.length > 0) {
  console.error(formatIssues(issues));
} else {
  console.log(
    `✓ seo:validate — ${summary.validated}/${summary.discovered} content files validated; no issues found`,
  );
}

const hasErrors = issues.some((i) => i.severity === "error");
process.exit(hasErrors ? 1 : 0);
