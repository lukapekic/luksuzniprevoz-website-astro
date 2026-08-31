import { describe, expect, it, vi } from "vitest";
import { createValueSerpProvider, findDomainPosition } from "../src/providers/valueserp.ts";
import type { SerpSearchRequest } from "../src/providers/types.ts";

const request: SerpSearchRequest = {
  siteDomain: "site-a.example",
  target: {
    primaryKeyword: "service a",
    secondaryKeywords: [],
    entities: [],
    questions: [],
    search: {
      languageCode: "en",
      countryCode: "rs",
      location: "Belgrade,Serbia",
      googleDomain: "google.rs",
      device: "desktop",
      numResults: 20,
    },
  },
};

describe("ValueSERP provider", () => {
  it("normalizes organic results and matches subdomains safely", async () => {
    const fetchImpl = vi.fn(async (input: string | URL | Request) => {
      const url = new URL(String(input));
      expect(url.searchParams.get("api_key")).toBe("secret-key");
      expect(url.searchParams.get("q")).toBe("service a");
      return new Response(
        JSON.stringify({
          organic_results: [
            { link: "https://competitor.example/page", title: "Competitor" },
            { position: 4, link: "https://www.site-a.example/en/service-a/", title: "Site A" },
          ],
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    });
    const provider = createValueSerpProvider({
      apiKey: "secret-key",
      fetchImpl: fetchImpl as typeof fetch,
      now: () => new Date("2026-01-01T00:00:00.000Z"),
    });

    const result = await provider.search(request);
    expect(result.ourPosition).toBe(4);
    expect(result.organicResults[0]?.position).toBe(1);
    expect(findDomainPosition(result.organicResults, "site-a.example").url).toContain(
      "www.site-a.example",
    );
  });

  it("retries rate limits without exposing the API key in errors", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(new Response("limited", { status: 429 }))
      .mockResolvedValueOnce(new Response("still broken", { status: 500 }));
    const provider = createValueSerpProvider({
      apiKey: "never-print-this",
      fetchImpl: fetchImpl as typeof fetch,
      maxRetries: 1,
      sleep: async () => undefined,
    });

    let message = "";
    try {
      await provider.search(request);
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(message).toContain("HTTP 500");
    expect(message).not.toContain("never-print-this");
  });
});
