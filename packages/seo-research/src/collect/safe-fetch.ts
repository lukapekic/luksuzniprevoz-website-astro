import { isIP } from "node:net";
import { lookup as dnsLookup } from "node:dns/promises";
import { ProviderError } from "../errors.ts";

export interface SafeFetchOptions {
  readonly fetchImpl?: typeof fetch;
  readonly lookupImpl?: typeof dnsLookup;
  readonly timeoutMs: number;
  readonly maxResponseBytes: number;
  readonly maxRedirects?: number;
  readonly userAgent?: string;
  readonly acceptedContentTypes?: readonly string[];
}

function isPrivateIpv4(address: string): boolean {
  const octets = address.split(".").map(Number);
  const first = octets[0] ?? -1;
  const second = octets[1] ?? -1;
  const third = octets[2] ?? -1;
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && ((second === 0 && (third === 0 || third === 2)) || second === 168)) ||
    (first === 198 && (second === 18 || second === 19 || (second === 51 && third === 100))) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  );
}

function ipv4FromMappedIpv6(address: string): string | null {
  const suffix = address.toLowerCase().replace(/^::ffff:/, "");
  if (suffix === address.toLowerCase()) return null;
  if (isIP(suffix) === 4) return suffix;
  const groups = suffix.split(":");
  if (groups.length !== 2) return null;
  const high = Number.parseInt(groups[0] ?? "", 16);
  const low = Number.parseInt(groups[1] ?? "", 16);
  if (![high, low].every((value) => Number.isInteger(value) && value >= 0 && value <= 0xffff))
    return null;
  return `${high >> 8}.${high & 0xff}.${low >> 8}.${low & 0xff}`;
}

function isPrivateIpv6(address: string): boolean {
  const normalized = address.toLowerCase();
  const mappedIpv4 = ipv4FromMappedIpv6(normalized);
  if (mappedIpv4) return isPrivateIpv4(mappedIpv4);
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb") ||
    normalized.startsWith("ff") ||
    normalized.startsWith("2001:db8:")
  );
}

export function isPrivateAddress(address: string): boolean {
  const version = isIP(address);
  return version === 4 ? isPrivateIpv4(address) : version === 6 ? isPrivateIpv6(address) : false;
}

export async function assertPublicUrl(
  rawUrl: string,
  lookupImpl: typeof dnsLookup = dnsLookup,
): Promise<URL> {
  const url = new URL(rawUrl);
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  if (!["http:", "https:"].includes(url.protocol))
    throw new ProviderError(`Unsupported URL protocol for ${url.hostname}`, null);
  if (url.username || url.password)
    throw new ProviderError(
      `URLs with embedded credentials are not allowed: ${url.hostname}`,
      null,
    );
  if (hostname.toLowerCase() === "localhost")
    throw new ProviderError("Localhost destinations are not allowed", null);
  if (isIP(hostname)) {
    if (isPrivateAddress(hostname))
      throw new ProviderError(`Private network destination is not allowed: ${hostname}`, null);
    return url;
  }
  const addresses = await lookupImpl(hostname, { all: true });
  if (addresses.length === 0 || addresses.some((entry) => isPrivateAddress(entry.address))) {
    throw new ProviderError(
      `Destination does not resolve exclusively to public addresses: ${url.hostname}`,
      null,
    );
  }
  return url;
}

async function readBoundedBody(response: Response, maxBytes: number): Promise<string> {
  const declaredLength = Number(response.headers.get("content-length") ?? "0");
  if (declaredLength > maxBytes)
    throw new ProviderError(`Response exceeds ${maxBytes} byte limit`, response.status);
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new ProviderError(`Response exceeds ${maxBytes} byte limit`, response.status);
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export async function safeFetchText(
  rawUrl: string,
  options: SafeFetchOptions,
): Promise<{
  readonly url: string;
  readonly status: number;
  readonly contentType: string;
  readonly text: string;
}> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const lookupImpl = options.lookupImpl ?? dnsLookup;
  const maxRedirects = options.maxRedirects ?? 3;
  let current = await assertPublicUrl(rawUrl, lookupImpl);

  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs);
    let response: Response;
    try {
      response = await fetchImpl(current, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9",
          "User-Agent": options.userAgent ?? "AstroFoundationSeoResearch/0.1",
        },
      });
    } finally {
      clearTimeout(timeout);
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location)
        throw new ProviderError(
          `Redirect from ${current.hostname} has no Location header`,
          response.status,
        );
      if (redirectCount === maxRedirects)
        throw new ProviderError(`Redirect limit exceeded for ${current.hostname}`, response.status);
      await response.body?.cancel();
      current = await assertPublicUrl(new URL(location, current).href, lookupImpl);
      continue;
    }
    if (!response.ok)
      throw new ProviderError(
        `Fetch failed for ${current.hostname}: HTTP ${response.status}`,
        response.status,
      );
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const accepted = options.acceptedContentTypes ?? ["text/html", "application/xhtml+xml"];
    if (!accepted.some((value) => contentType.includes(value)))
      throw new ProviderError(
        `Unsupported response content type from ${current.hostname}`,
        response.status,
      );
    return {
      url: current.href,
      status: response.status,
      contentType,
      text: await readBoundedBody(response, options.maxResponseBytes),
    };
  }
  throw new ProviderError(`Redirect limit exceeded for ${current.hostname}`, null);
}
