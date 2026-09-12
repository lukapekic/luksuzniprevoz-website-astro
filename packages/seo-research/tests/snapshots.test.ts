import { describe, expect, it } from "vitest";
import { diffSitemaps, parseSitemap } from "../src/collect/sitemap.ts";
import { compareSeoSnapshots } from "../src/storage/snapshots.ts";
import { createReport } from "./helpers.ts";

describe("historical comparison", () => {
  it("computes positive movement only for comparable snapshots", () => {
    expect(
      compareSeoSnapshots(createReport({ position: 9 }), createReport({ id: "next", position: 4 })),
    ).toEqual({ comparable: true, positionDelta: 5 });
    expect(
      compareSeoSnapshots(
        createReport({ keyword: "service a" }),
        createReport({ id: "next", keyword: "different query" }),
      ),
    ).toEqual({ comparable: false, positionDelta: null });
  });

  it("parses URL sets and reports complete sitemap additions/removals", () => {
    const parsed = parseSitemap(`<?xml version="1.0"?><urlset>
      <url><loc>https://example.com/b/</loc></url>
      <url><loc>https://example.com/a/</loc></url>
    </urlset>`);
    expect(parsed).toEqual({
      index: false,
      locations: ["https://example.com/a/", "https://example.com/b/"],
    });
    expect(
      diffSitemaps(
        {
          url: "https://example.com/sitemap.xml",
          fetchedAt: "2026-01-01T00:00:00.000Z",
          entries: ["https://example.com/a/", "https://example.com/old/"],
        },
        {
          url: "https://example.com/sitemap.xml",
          fetchedAt: "2026-01-02T00:00:00.000Z",
          entries: parsed.locations,
        },
      ),
    ).toEqual({
      added: ["https://example.com/b/"],
      removed: ["https://example.com/old/"],
    });
  });
});
