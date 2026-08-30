import type { FormResponseBody } from "./types.ts";

export class RequestBodyError extends Error {
  readonly status: 400 | 413 | 415;
  constructor(status: 400 | 413 | 415) {
    super(`Invalid request body (${status})`);
    this.status = status;
  }
}

const RESPONSE_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
} as const;

export function jsonResponse(body: FormResponseBody, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: RESPONSE_HEADERS });
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") throw new RequestBodyError(415);

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new RequestBodyError(413);
  }

  if (!request.body) throw new RequestBodyError(400);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel();
      throw new RequestBodyError(413);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new RequestBodyError(400);
  }
}

export function requestHostnameAllowed(request: Request, configuredHosts: string): boolean {
  const expected = new Set(configuredHosts.split(",").map((host) => host.trim().toLowerCase()).filter(Boolean));
  if (expected.size === 0) return false;
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (!expected.has(url.hostname.toLowerCase())) return false;
  if (!origin) return false;
  try {
    return new URL(origin).origin.toLowerCase() === url.origin.toLowerCase();
  } catch {
    return false;
  }
}
