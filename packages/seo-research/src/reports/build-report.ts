import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import type { lookup as dnsLookup } from "node:dns/promises";
import { z } from "zod";
import {
  analyzeContent,
  analyzeInternalLinks,
  analyzeLocaleParity,
  analyzeSerp,
  analyzeTechnical,
  buildDeterministicProposals,
} from "../analyze/index.ts";
import { collectCompetitorPage } from "../collect/competitor-page.ts";
import { collectBuiltPage, parseRenderedHtml } from "../collect/rendered-page.ts";
import { safeFetchText } from "../collect/safe-fetch.ts";
import { collectSitemap, diffSitemaps } from "../collect/sitemap.ts";
import type { SerpProvider } from "../providers/types.ts";
import { createValueSerpProvider } from "../providers/valueserp.ts";
import {
  competitorEvidenceSchema,
  seoResearchReportSchema,
  serpEvidenceSchema,
  type CompetitorEvidence,
  type EvidenceReference,
  type ResearchWarning,
  type RenderedPageEvidence,
  type SeoResearchReport,
  type SerpEvidence,
} from "./schema.ts";
import {
  buildFoundationIssues,
  findResearchTarget,
  loadSite,
  resolvePage,
} from "../site/load-site.ts";
import { cacheKey, createFileCache, atomicJsonWrite } from "../storage/cache.ts";
import { compareSeoSnapshots, createSnapshotStore } from "../storage/snapshots.ts";
import { messageFromUnknown, SeoResearchError } from "../errors.ts";

const sitemapSnapshotSchema = z
  .object({
    url: z.string().url(),
    fetchedAt: z.string().datetime(),
    entries: z.array(z.string().url()),
  })
  .strict();

export interface RunSeoResearchOptions {
  readonly repositoryRoot: string;
  readonly project: string;
  readonly routeKey: string;
  readonly locale: string;
  readonly mode?: "offline" | "built" | "live";
  readonly skipSerp?: boolean;
  readonly skipCompetitors?: boolean;
  readonly refresh?: boolean;
  readonly maxQueries?: number;
  readonly environment?: Readonly<Record<string, string | undefined>>;
  readonly fetchImpl?: typeof fetch;
  readonly lookupImpl?: typeof dnsLookup;
  readonly now?: () => Date;
  readonly serpProvider?: SerpProvider;
}

function runId(now: Date, routeKey: string, locale: string): string {
  const stamp = now.toISOString().replace(/[-:.]/g, "").replace(/Z$/, "Z");
  const suffix = createHash("sha256")
    .update(`${routeKey}:${locale}:${now.toISOString()}`)
    .digest("hex")
    .slice(0, 8);
  return `${stamp}-${suffix}`;
}

async function collectRendered(
  mode: "offline" | "built" | "live",
  projectDirectory: string,
  url: string,
  limits: { requestTimeoutMs: number; maxResponseBytes: number },
  fetchImpl?: typeof fetch,
  lookupImpl?: typeof dnsLookup,
): Promise<RenderedPageEvidence | null> {
  if (mode === "offline") return null;
  if (mode === "built") {
    try {
      return await collectBuiltPage(projectDirectory, url);
    } catch (error) {
      throw new SeoResearchError(
        `Built HTML is unavailable for ${url}. Run the selected site's production build first.`,
        "missing_built_page",
        error,
      );
    }
  }
  const response = await safeFetchText(url, {
    fetchImpl,
    lookupImpl,
    timeoutMs: limits.requestTimeoutMs,
    maxResponseBytes: limits.maxResponseBytes,
  });
  return parseRenderedHtml(response.text, url, response.url, response.status);
}

function providerForRun(
  configured: { kind: "valueserp"; apiKeyEnv: string } | undefined,
  options: RunSeoResearchOptions,
  timeoutMs: number,
  maxResponseBytes: number,
  now: () => Date,
): SerpProvider | null {
  if (options.serpProvider) return options.serpProvider;
  if (!configured) return null;
  const apiKey = (options.environment ?? process.env)[configured.apiKeyEnv];
  if (!apiKey) return null;
  return createValueSerpProvider({
    apiKey,
    fetchImpl: options.fetchImpl,
    timeoutMs,
    maxResponseBytes,
    now,
  });
}

async function loadJsonFile<T>(filePath: string, schema: z.ZodType<T>): Promise<T | null> {
  try {
    return schema.parse(JSON.parse(await readFile(filePath, "utf8")));
  } catch {
    return null;
  }
}

export async function runSeoResearch(options: RunSeoResearchOptions): Promise<SeoResearchReport> {
  const now = options.now ?? (() => new Date());
  const generatedAt = now();
  const mode = options.mode ?? "built";
  const site = await loadSite(options.repositoryRoot, options.project);
  const target = findResearchTarget(site, options.routeKey);
  const localeTarget = target.locales[options.locale];
  if (!localeTarget)
    throw new SeoResearchError(
      `No research target for ${options.routeKey}/${options.locale}`,
      "missing_locale_target",
    );
  const page = resolvePage(site, options.routeKey, options.locale);
  if (!page.indexable && !target.includeNonIndexable)
    throw new SeoResearchError(
      `Target ${options.routeKey}/${options.locale} is not indexable`,
      "nonindexable_target",
    );
  const limits = site.researchConfig.limits;
  const allowedBudget = Math.min(
    limits.maxQueriesPerRun,
    options.maxQueries ?? limits.maxQueriesPerRun,
  );
  if (!options.skipSerp && allowedBudget < 1)
    throw new SeoResearchError("SEO research query budget is exhausted", "query_budget");
  const stateRoot = resolve(site.projectDirectory, ".seo-research");
  const cache = createFileCache(join(stateRoot, "cache"), now);
  let cacheHits = 0;
  let cacheMisses = 0;
  let queriesUsed = 0;
  const warnings: ResearchWarning[] = [];
  const sitemapEvidence: EvidenceReference[] = [];

  const rendered = await collectRendered(
    mode,
    site.projectDirectory,
    page.url,
    limits,
    options.fetchImpl,
    options.lookupImpl,
  );
  const foundationIssues = buildFoundationIssues(site, options.routeKey, options.locale);

  let serp: SerpEvidence | null = null;
  if (!options.skipSerp) {
    const key = cacheKey({
      provider: "valueserp",
      keyword: localeTarget.primaryKeyword,
      search: localeTarget.search,
      siteDomain: new URL(site.config.site).hostname,
    });
    if (!options.refresh)
      serp = await cache.get("serp", key, limits.cacheTtlHours, serpEvidenceSchema);
    if (serp) cacheHits += 1;
    else {
      cacheMisses += 1;
      if (mode === "offline")
        warnings.push({
          code: "offline_serp_cache_miss",
          stage: "serp",
          message: "Offline mode has no valid cached ValueSERP result for this query.",
          retryable: false,
        });
      else {
        const provider = providerForRun(
          site.researchConfig.provider,
          options,
          limits.requestTimeoutMs,
          limits.maxResponseBytes,
          now,
        );
        if (!provider)
          warnings.push({
            code: "serp_provider_unavailable",
            stage: "serp",
            message: "ValueSERP is not configured or its API key environment variable is missing.",
            retryable: false,
          });
        else {
          queriesUsed += 1;
          try {
            serp = await provider.search({
              target: localeTarget,
              siteDomain: new URL(site.config.site).hostname,
            });
            serp = {
              ...serp,
              organicResults: serp.organicResults.slice(0, limits.maxOrganicResultsPerQuery),
            };
            await cache.set("serp", key, serp);
          } catch (error) {
            warnings.push({
              code: "serp_request_failed",
              stage: "serp",
              message: messageFromUnknown(error),
              retryable: true,
            });
          }
        }
      }
    }
  }

  const competitors: CompetitorEvidence[] = [];
  const candidateUrls: Array<{ url: string; source: "serp" | "configured" }> = [];
  const ownDomain = new URL(site.config.site).hostname.toLowerCase();
  for (const organic of serp?.organicResults ?? []) {
    if (organic.domain === ownDomain || organic.domain.endsWith(`.${ownDomain}`)) continue;
    candidateUrls.push({ url: organic.url, source: "serp" });
  }

  if (!options.skipCompetitors) {
    for (const configured of site.researchConfig.competitors) {
      if (!configured.sitemapUrl || mode === "offline") continue;
      try {
        const currentSitemap = await collectSitemap(configured.sitemapUrl, {
          fetchImpl: options.fetchImpl,
          lookupImpl: options.lookupImpl,
          timeoutMs: limits.requestTimeoutMs,
          maxResponseBytes: limits.maxResponseBytes,
          now,
        });
        const sitemapPath = join(stateRoot, "snapshots", "sitemaps", `${configured.domain}.json`);
        const previous = await loadJsonFile(sitemapPath, sitemapSnapshotSchema);
        const diff = diffSitemaps(previous, currentSitemap);
        await atomicJsonWrite(sitemapPath, currentSitemap);
        const evidenceValue = `${currentSitemap.entries.length} URLs; ${diff.added.length} added; ${diff.removed.length} removed`;
        sitemapEvidence.push({
          id: `snapshot:sitemap:${configured.domain}`,
          kind: "snapshot",
          label: `Competitor sitemap snapshot — ${configured.name}`,
          value: evidenceValue,
        });
        const matches = currentSitemap.entries.filter(
          (entry) =>
            configured.trackedRoutePatterns.length > 0 &&
            configured.trackedRoutePatterns.some((pattern) =>
              new URL(entry).pathname.includes(pattern),
            ),
        );
        matches
          .slice(0, limits.maxPagesPerDomain)
          .forEach((url) => candidateUrls.push({ url, source: "configured" }));
      } catch (error) {
        warnings.push({
          code: "sitemap_fetch_failed",
          stage: "competitor",
          message: `${configured.domain}: ${messageFromUnknown(error)}`,
          retryable: true,
        });
      }
    }

    const seenUrls = new Set<string>();
    const perDomain = new Map<string, number>();
    for (const candidate of candidateUrls) {
      if (competitors.length >= limits.maxCompetitorPagesPerQuery) break;
      let normalized: string;
      let domain: string;
      try {
        const url = new URL(candidate.url);
        url.hash = "";
        normalized = url.href;
        domain = url.hostname.toLowerCase();
      } catch {
        continue;
      }
      if (seenUrls.has(normalized) || (perDomain.get(domain) ?? 0) >= limits.maxPagesPerDomain)
        continue;
      seenUrls.add(normalized);
      const key = cacheKey({ url: normalized, extractor: 1 });
      let collected = !options.refresh
        ? await cache.get("competitors", key, limits.cacheTtlHours, competitorEvidenceSchema)
        : null;
      if (collected) cacheHits += 1;
      else {
        cacheMisses += 1;
        if (mode === "offline") continue;
        try {
          collected = await collectCompetitorPage(normalized, candidate.source, {
            fetchImpl: options.fetchImpl,
            lookupImpl: options.lookupImpl,
            timeoutMs: limits.requestTimeoutMs,
            maxResponseBytes: limits.maxResponseBytes,
            now,
          });
          if (collected) await cache.set("competitors", key, collected);
          else
            warnings.push({
              code: "competitor_robots_disallow",
              stage: "competitor",
              message: `Robots policy disallows collection from ${domain}.`,
              retryable: false,
            });
        } catch (error) {
          warnings.push({
            code: "competitor_fetch_failed",
            stage: "competitor",
            message: `${domain}: ${messageFromUnknown(error)}`,
            retryable: true,
          });
        }
      }
      if (collected) {
        competitors.push(collected);
        perDomain.set(domain, (perDomain.get(domain) ?? 0) + 1);
      }
    }
  }

  const evidence: EvidenceReference[] = [
    {
      id: "source:page",
      kind: "source",
      label: "Localized content source",
      value: relative(site.repositoryRoot, page.loadedContent.content.filePath),
    },
    {
      id: "source:digest",
      kind: "source",
      label: "Localized content digest",
      value: page.loadedContent.digest,
    },
    ...sitemapEvidence,
  ];
  for (const [index, competitor] of competitors.entries()) {
    evidence.push({
      id: `competitor:${index + 1}`,
      kind: "competitor",
      label: competitor.title ?? competitor.domain,
      value: `${competitor.url} — ${competitor.headings
        .map((heading) => heading.text)
        .slice(0, 8)
        .join(" | ")}`,
    });
  }
  const foundationRecords = foundationIssues as unknown as Record<string, unknown>[];
  const findings = [
    ...analyzeTechnical(
      site,
      options.routeKey,
      page.url,
      options.locale,
      foundationRecords,
      rendered,
      evidence,
    ),
    ...analyzeSerp(serp, page.url, evidence),
    ...analyzeContent(page.loadedContent.source, localeTarget, evidence),
    ...analyzeInternalLinks(rendered, evidence),
    ...analyzeLocaleParity(site, options.routeKey, options.locale, evidence),
  ];
  const sourcePath = relative(site.repositoryRoot, page.loadedContent.content.filePath);
  const proposals = buildDeterministicProposals(findings, {
    routeKey: options.routeKey,
    locale: options.locale,
    sourcePath,
    sourceDigest: page.loadedContent.digest,
    textFields: page.loadedContent.source.textFields,
  });
  let report = seoResearchReportSchema.parse({
    schemaVersion: 1,
    run: {
      id: runId(generatedAt, options.routeKey, options.locale),
      generatedAt: generatedAt.toISOString(),
      packageVersion: "0.1.0",
      project: site.projectRelativePath,
      mode,
      provider: serp ? "valueserp" : null,
      cache: { hits: cacheHits, misses: cacheMisses },
      budget: { allowed: allowedBudget, used: queriesUsed },
    },
    page: {
      routeKey: options.routeKey,
      locale: options.locale,
      url: page.url,
      sourcePath,
      sourceDigest: page.loadedContent.digest,
      published: page.published,
      indexable: page.indexable,
    },
    target: localeTarget,
    current: { source: page.loadedContent.source, rendered, foundationIssues },
    serp,
    competitors,
    evidence,
    findings,
    proposals,
    warnings,
  });
  const snapshotStore = createSnapshotStore(join(stateRoot, "snapshots", "reports"));
  const previous = await snapshotStore.loadLatestComparable(report);
  if (previous) {
    const comparison = compareSeoSnapshots(previous, report);
    const snapshotEvidence: EvidenceReference = {
      id: "snapshot:position-change",
      kind: "snapshot",
      label: "Comparable organic position change",
      value:
        comparison.positionDelta === null
          ? "A comparable snapshot exists, but both runs do not contain a matched position."
          : `${previous.serp?.ourPosition ?? "not found"} → ${report.serp?.ourPosition ?? "not found"} (delta ${comparison.positionDelta})`,
    };
    report = seoResearchReportSchema.parse({
      ...report,
      evidence: [...report.evidence, snapshotEvidence],
      findings:
        comparison.positionDelta === null || comparison.positionDelta === 0
          ? report.findings
          : [
              ...report.findings,
              {
                id: "finding:snapshot:position-change",
                category: "serp",
                severity: "low",
                confidence: "high",
                summary:
                  comparison.positionDelta > 0
                    ? "Organic position improved against the comparable snapshot"
                    : "Organic position declined against the comparable snapshot",
                detail: `The matched position changed by ${comparison.positionDelta} under identical query dimensions. Rankings are time- and location-specific observations.`,
                evidenceIds: [snapshotEvidence.id],
              },
            ],
    });
  }
  await atomicJsonWrite(
    join(stateRoot, "runs", `${report.page.routeKey}-${report.page.locale}-${report.run.id}.json`),
    report,
  );
  await snapshotStore.save(report);
  return report;
}
