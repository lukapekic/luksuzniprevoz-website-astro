import { existsSync } from "node:fs";
import { isAbsolute, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  FoundationConfigSchema,
  composeTitle,
  validateSeo,
  type FoundationConfig,
  type FoundationIssue,
  type SeoPage,
} from "@astro-foundation/core";
import { loadSeoResearchConfig } from "../config/load-config.ts";
import type { SeoResearchConfig, SeoResearchTarget } from "../config/schema.ts";
import { SeoResearchError } from "../errors.ts";
import { discoverContent, type DiscoveredContent } from "./discover-content.ts";
import { resolveRoutePath, type ResearchRoute } from "./resolve-route.ts";
import { buildSourcePageEvidence } from "./source-page.ts";
import { sourceDigest } from "./source-digest.ts";

export interface LoadedContentPage {
  readonly content: DiscoveredContent;
  readonly source: ReturnType<typeof buildSourcePageEvidence>;
  readonly digest: string;
}

export interface LoadedSite {
  readonly repositoryRoot: string;
  readonly projectDirectory: string;
  readonly projectRelativePath: string;
  readonly config: FoundationConfig;
  readonly routes: readonly ResearchRoute[];
  readonly researchConfig: SeoResearchConfig;
  readonly contentByPair: ReadonlyMap<string, LoadedContentPage>;
  readonly defaultLocale: string;
}

function resolveProject(repositoryRoot: string, projectArgument: string): string {
  const root = resolve(repositoryRoot);
  const project = resolve(root, projectArgument);
  const fromRoot = relative(root, project);
  if (!fromRoot || fromRoot === ".") {
    throw new SeoResearchError(
      "--project must select a site directory, not the repository root",
      "invalid_project",
    );
  }
  if (fromRoot.startsWith("..") || isAbsolute(fromRoot)) {
    throw new SeoResearchError(
      "--project must resolve beneath the repository root",
      "invalid_project",
    );
  }
  return project;
}

async function importSiteModule(path: string): Promise<Record<string, unknown>> {
  if (!existsSync(path))
    throw new SeoResearchError(
      `Required site authority is missing: ${path}`,
      "missing_site_authority",
    );
  return (await import(pathToFileURL(path).href)) as Record<string, unknown>;
}

function assertResearchTargets(site: LoadedSite): void {
  const routeKeys = new Set(site.routes.map((route) => route.key));
  const configuredLocales = site.config.locales.locales.map((locale) => locale.code);
  const configuredLocaleSet = new Set(configuredLocales);

  for (const target of site.researchConfig.targets) {
    if (!routeKeys.has(target.routeKey))
      throw new SeoResearchError(
        `Research target has unknown routeKey: ${target.routeKey}`,
        "unknown_route",
      );
    const route = site.routes.find((candidate) => candidate.key === target.routeKey);
    if (!route) throw new SeoResearchError(`Route not found: ${target.routeKey}`, "unknown_route");

    for (const locale of Object.keys(target.locales)) {
      if (!configuredLocaleSet.has(locale))
        throw new SeoResearchError(
          `Research target ${target.routeKey} uses unconfigured locale: ${locale}`,
          "unknown_locale",
        );
    }
    for (const locale of configuredLocales) {
      if (route.slugs[locale] === undefined) continue;
      if (!target.locales[locale])
        throw new SeoResearchError(
          `Research target ${target.routeKey} is missing locale research for ${locale}`,
          "missing_locale_target",
        );
      if (!site.contentByPair.has(`${target.routeKey}:${locale}`))
        throw new SeoResearchError(
          `Research target ${target.routeKey}/${locale} has no content source`,
          "missing_content",
        );
    }
    const indexable =
      route.availability !== "scaffold" && !route.noindex && route.sitemap?.include !== false;
    if (!indexable && !target.includeNonIndexable) {
      throw new SeoResearchError(
        `Research target ${target.routeKey} is not indexable; set includeNonIndexable only for diagnostics`,
        "nonindexable_target",
      );
    }
  }
}

export async function loadSite(
  repositoryRoot: string,
  projectArgument: string,
): Promise<LoadedSite> {
  const projectDirectory = resolveProject(repositoryRoot, projectArgument);
  const foundationModule = await importSiteModule(
    resolve(projectDirectory, "foundation.config.ts"),
  );
  const config = FoundationConfigSchema.parse(
    foundationModule["default"] ?? foundationModule["config"],
  );
  const routeModule = await importSiteModule(resolve(projectDirectory, "src/data/routes.ts"));
  if (!Array.isArray(routeModule["routes"]))
    throw new SeoResearchError("src/data/routes.ts must export routes", "invalid_routes");
  const routes = routeModule["routes"] as ResearchRoute[];
  if (routes.length === 0) throw new SeoResearchError("Route map is empty", "invalid_routes");
  const researchConfig = await loadSeoResearchConfig(projectDirectory);
  const content = await discoverContent(resolve(projectDirectory, "src/content/pages"));
  const contentByPair = new Map<string, LoadedContentPage>();
  for (const entry of content) {
    const routeKey = String(entry.frontmatter["routeKey"] ?? "");
    const locale = String(entry.frontmatter["locale"] ?? "");
    if (!routeKey || !locale)
      throw new SeoResearchError(
        `Content is missing routeKey/locale: ${entry.filePath}`,
        "invalid_content",
      );
    const key = `${routeKey}:${locale}`;
    if (contentByPair.has(key))
      throw new SeoResearchError(`Duplicate content pair: ${key}`, "duplicate_content");
    contentByPair.set(key, {
      content: entry,
      source: buildSourcePageEvidence(entry),
      digest: sourceDigest(entry.raw),
    });
  }
  const defaultLocale = config.locales.locales.find((locale) => locale.isDefault)?.code;
  if (!defaultLocale)
    throw new SeoResearchError("foundation.config.ts has no default locale", "invalid_site_config");

  const site: LoadedSite = {
    repositoryRoot: resolve(repositoryRoot),
    projectDirectory,
    projectRelativePath: relative(resolve(repositoryRoot), projectDirectory),
    config,
    routes,
    researchConfig,
    contentByPair,
    defaultLocale,
  };
  assertResearchTargets(site);
  return site;
}

export function findResearchTarget(site: LoadedSite, routeKey: string): SeoResearchTarget {
  const target = site.researchConfig.targets.find((candidate) => candidate.routeKey === routeKey);
  if (!target)
    throw new SeoResearchError(
      `Route is not configured for SEO research: ${routeKey}`,
      "unconfigured_target",
    );
  return target;
}

export function resolvePage(site: LoadedSite, routeKey: string, locale: string) {
  const route = site.routes.find((candidate) => candidate.key === routeKey);
  if (!route) throw new SeoResearchError(`Unknown route: ${routeKey}`, "unknown_route");
  const localeConfig = site.config.locales.locales.find((candidate) => candidate.code === locale);
  if (!localeConfig) throw new SeoResearchError(`Unknown locale: ${locale}`, "unknown_locale");
  const loadedContent = site.contentByPair.get(`${routeKey}:${locale}`);
  if (!loadedContent)
    throw new SeoResearchError(`Missing content for ${routeKey}/${locale}`, "missing_content");
  const path = resolveRoutePath(routeKey, locale, site.routes, site.defaultLocale);
  const url = new URL(path, site.config.site).href;
  const published = loadedContent.source.status === "published";
  const indexable =
    published &&
    route.availability !== "scaffold" &&
    !route.noindex &&
    !loadedContent.source.noindex &&
    route.sitemap?.include !== false;
  return { route, localeConfig, loadedContent, path, url, published, indexable };
}

export function buildFoundationIssues(
  site: LoadedSite,
  routeKey: string,
  locale: string,
): FoundationIssue[] {
  const page = resolvePage(site, routeKey, locale);
  const hreflang = site.config.locales.locales
    .filter((candidate) => page.route.slugs[candidate.code] !== undefined)
    .map((candidate) => ({
      hreflang: candidate.hreflang,
      href: new URL(
        resolveRoutePath(routeKey, candidate.code, site.routes, site.defaultLocale),
        site.config.site,
      ).href,
    }));
  const xDefault = site.config.locales.locales.find(
    (candidate) => candidate.isXDefault && page.route.slugs[candidate.code] !== undefined,
  );
  if (xDefault)
    hreflang.push({
      hreflang: "x-default",
      href: new URL(
        resolveRoutePath(routeKey, xDefault.code, site.routes, site.defaultLocale),
        site.config.site,
      ).href,
    });

  const seoPage: SeoPage = {
    routeKey,
    locale,
    url: page.url,
    title: composeTitle(page.loadedContent.source.seoTitle ?? "", site.config.brand),
    description: page.loadedContent.source.seoDescription ?? "",
    h1: page.loadedContent.source.primaryHeading ?? undefined,
    canonical: page.indexable ? page.url : undefined,
    htmlLang: page.localeConfig.htmlLang,
    hreflang: page.indexable ? hreflang : [],
    og: {
      title: composeTitle(page.loadedContent.source.seoTitle ?? "", site.config.brand),
      description: page.loadedContent.source.seoDescription ?? undefined,
    },
    structuredData: [],
    noindex: !page.indexable,
    published: page.published,
    sitemap: page.route.sitemap ? { include: page.route.sitemap.include !== false } : undefined,
    breadcrumbs: [
      { name: page.loadedContent.source.primaryHeading ?? routeKey, url: page.url, routeKey },
    ],
    rawTitle: page.loadedContent.source.seoTitle ?? undefined,
    brand: site.config.brand,
  };
  return validateSeo({
    site: site.config.site,
    brand: site.config.brand,
    capabilities: site.config.capabilities.structuredData,
    pages: [seoPage],
  }).filter((issue) => issue.ruleId !== "FND-SEO-09");
}
