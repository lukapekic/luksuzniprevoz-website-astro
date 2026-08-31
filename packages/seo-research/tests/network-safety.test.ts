import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { assertPublicUrl, safeFetchText } from "../src/collect/safe-fetch.ts";
import { isAllowedByRobots } from "../src/collect/robots.ts";
import { atomicJsonWrite, cacheKey } from "../src/storage/cache.ts";

const publicLookup = vi.fn(async () => [{ address: "93.184.216.34", family: 4 }]);

describe("remote collection and artifact safety", () => {
  it("rejects local/private destinations before fetching", async () => {
    await expect(assertPublicUrl("http://127.0.0.1/private")).rejects.toThrow(/Private/);
    await expect(assertPublicUrl("http://[::ffff:127.0.0.1]/private")).rejects.toThrow(/Private/);
    await expect(
      assertPublicUrl(
        "https://internal.example/",
        vi.fn(async () => [{ address: "10.0.0.5", family: 4 }]) as never,
      ),
    ).rejects.toThrow(/public addresses/);
  });

  it("honors the most specific robots allow/disallow rule", async () => {
    const fetchImpl = vi.fn(
      async () =>
        new Response(
          "User-agent: *\nDisallow: /private/\nAllow: /private/public/\n\nUser-agent: OtherBot\nDisallow: /",
          { headers: { "content-type": "text/plain" } },
        ),
    ) as typeof fetch;
    const options = {
      lookupImpl: publicLookup as never,
      fetchImpl,
      timeoutMs: 1_000,
      maxResponseBytes: 10_000,
    };
    await expect(isAllowedByRobots("https://example.com/private/secret", options)).resolves.toBe(
      false,
    );
    await expect(
      isAllowedByRobots("https://example.com/private/public/page", options),
    ).resolves.toBe(true);
  });

  it("enforces content type and body limits", async () => {
    await expect(
      safeFetchText("https://example.com/file", {
        lookupImpl: publicLookup as never,
        fetchImpl: vi.fn(
          async () =>
            new Response("not html", { headers: { "content-type": "application/octet-stream" } }),
        ) as typeof fetch,
        timeoutMs: 1_000,
        maxResponseBytes: 100,
      }),
    ).rejects.toThrow(/content type/);
    await expect(
      safeFetchText("https://example.com/large", {
        lookupImpl: publicLookup as never,
        fetchImpl: vi.fn(
          async () => new Response("x".repeat(101), { headers: { "content-type": "text/html" } }),
        ) as typeof fetch,
        timeoutMs: 1_000,
        maxResponseBytes: 100,
      }),
    ).rejects.toThrow(/byte limit/);
  });

  it("keys every query dimension and writes JSON atomically", async () => {
    expect(cacheKey({ keyword: "a", device: "desktop" })).not.toBe(
      cacheKey({ keyword: "a", device: "mobile" }),
    );
    const directory = await mkdtemp(join(tmpdir(), "seo-research-test-"));
    const path = join(directory, "nested", "report.json");
    try {
      await atomicJsonWrite(path, { ok: true });
      expect(JSON.parse(await readFile(path, "utf8"))).toEqual({ ok: true });
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
