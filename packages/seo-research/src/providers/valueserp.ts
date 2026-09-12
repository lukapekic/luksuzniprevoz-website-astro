import { z } from "zod";
import { ProviderError, messageFromUnknown } from "../errors.ts";
import {
  serpEvidenceSchema,
  type SerpEvidence,
  type SerpOrganicResult,
} from "../reports/schema.ts";
import type { SerpProvider, SerpSearchRequest } from "./types.ts";

const valueSerpOrganicSchema = z
  .object({
    position: z.number().int().positive().optional(),
    link: z.string().url(),
    displayed_link: z.string().optional(),
    title: z.string().optional(),
    snippet: z.string().optional(),
  })
  .passthrough();

const valueSerpResponseSchema = z
  .object({
    organic_results: z.array(z.unknown()).optional(),
  })
  .passthrough();

export interface ValueSerpClientOptions {
  readonly apiKey: string;
  readonly fetchImpl?: typeof fetch;
  readonly timeoutMs?: number;
  readonly maxResponseBytes?: number;
  readonly maxRetries?: number;
  readonly now?: () => Date;
  readonly sleep?: (milliseconds: number) => Promise<void>;
}

const VALUE_SERP_ENDPOINT = "https://api.valueserp.com/search";

function domainFromUrl(url: string): string {
  return new URL(url).hostname.toLowerCase();
}

export function normalizeDomain(domain: string): string {
  const withProtocol = /^[a-z]+:\/\//i.test(domain) ? domain : `https://${domain}`;
  return new URL(withProtocol).hostname.toLowerCase();
}

export function findDomainPosition(
  organicResults: readonly SerpOrganicResult[],
  domain: string,
): { readonly position: number | null; readonly url: string | null } {
  const normalized = normalizeDomain(domain);
  const match = organicResults.find((result) => {
    const hostname = domainFromUrl(result.url);
    return hostname === normalized || hostname.endsWith(`.${normalized}`);
  });
  return { position: match?.position ?? null, url: match?.url ?? null };
}

function normalizeResponse(
  raw: unknown,
  request: SerpSearchRequest,
  fetchedAt: string,
): SerpEvidence {
  const parsed = valueSerpResponseSchema.parse(raw);
  const organicResults: SerpOrganicResult[] = [];
  for (const [index, entry] of (parsed.organic_results ?? []).entries()) {
    const result = valueSerpOrganicSchema.safeParse(entry);
    if (!result.success) continue;
    organicResults.push({
      position: result.data.position ?? index + 1,
      url: result.data.link,
      domain: domainFromUrl(result.data.link),
      displayedUrl: result.data.displayed_link ?? null,
      title: result.data.title ?? null,
      snippet: result.data.snippet ?? null,
    });
  }
  const own = findDomainPosition(organicResults, request.siteDomain);
  const search = request.target.search;
  return serpEvidenceSchema.parse({
    keyword: request.target.primaryKeyword,
    fetchedAt,
    location: search.location ?? null,
    languageCode: search.languageCode,
    countryCode: search.countryCode,
    googleDomain: search.googleDomain ?? null,
    device: search.device,
    numResults: search.numResults,
    organicResults,
    ourPosition: own.position,
    ourUrl: own.url,
  });
}

function buildRequestUrl(apiKey: string, request: SerpSearchRequest): URL {
  const search = request.target.search;
  const url = new URL(VALUE_SERP_ENDPOINT);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("q", request.target.primaryKeyword);
  url.searchParams.set("output", "json");
  url.searchParams.set("num", String(search.numResults));
  url.searchParams.set("device", search.device);
  url.searchParams.set("hl", search.languageCode);
  url.searchParams.set("gl", search.countryCode);
  if (search.location) url.searchParams.set("location", search.location);
  if (search.googleDomain) url.searchParams.set("google_domain", search.googleDomain);
  return url;
}

function retryDelay(response: Response, attempt: number): number {
  const header = response.headers.get("retry-after");
  if (header) {
    const seconds = Number(header);
    if (Number.isFinite(seconds)) return Math.max(0, Math.min(seconds * 1_000, 30_000));
    const date = Date.parse(header);
    if (Number.isFinite(date)) return Math.max(0, Math.min(date - Date.now(), 30_000));
  }
  return Math.min(500 * 2 ** attempt, 5_000);
}

export function createValueSerpProvider(options: ValueSerpClientOptions): SerpProvider {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 20_000;
  const maxResponseBytes = options.maxResponseBytes ?? 1_000_000;
  const maxRetries = options.maxRetries ?? 2;
  const now = options.now ?? (() => new Date());
  const sleep =
    options.sleep ??
    ((milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)));

  return {
    id: "valueserp",
    async search(request): Promise<SerpEvidence> {
      for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        try {
          const response = await fetchImpl(buildRequestUrl(options.apiKey, request), {
            signal: controller.signal,
          });
          const rawText = await response.text();
          if (new TextEncoder().encode(rawText).byteLength > maxResponseBytes) {
            throw new ProviderError(
              "ValueSERP response exceeds configured size limit",
              response.status,
            );
          }
          if (!response.ok) {
            const retryable = response.status === 429 || response.status >= 500;
            if (retryable && attempt < maxRetries) {
              await sleep(retryDelay(response, attempt));
              continue;
            }
            throw new ProviderError(
              `ValueSERP request failed: HTTP ${response.status}`,
              response.status,
            );
          }
          let raw: unknown;
          try {
            raw = JSON.parse(rawText);
          } catch (error) {
            throw new ProviderError("ValueSERP returned invalid JSON", response.status, error);
          }
          return normalizeResponse(raw, request, now().toISOString());
        } catch (error) {
          if (error instanceof ProviderError) throw error;
          if (attempt < maxRetries) {
            await sleep(Math.min(500 * 2 ** attempt, 5_000));
            continue;
          }
          throw new ProviderError(
            `ValueSERP request failed: ${messageFromUnknown(error)}`,
            null,
            error,
          );
        } finally {
          clearTimeout(timeout);
        }
      }
      throw new ProviderError("ValueSERP request failed after retries", null);
    },
  };
}
