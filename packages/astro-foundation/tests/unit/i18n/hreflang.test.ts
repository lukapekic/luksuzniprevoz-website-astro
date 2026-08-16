import { describe, it, expect } from "vitest";
import { buildHreflangSet } from "../../../src/i18n/helpers.ts";
import {
  LOCALES_2,
  LOCALES_3,
  ROUTES_2,
  ROUTES_3,
  ROUTES_MISSING,
  DEFAULT_2,
  DEFAULT_3,
} from "./fixtures.ts";

describe("buildHreflangSet", () => {
  // ─── Self-referencing link ──────────────────────────────────────

  describe("self-referencing link", () => {
    it("includes a link for the current locale", () => {
      const links = buildHreflangSet("airport", "sr", ROUTES_2, LOCALES_2, DEFAULT_2);
      expect(links.some((l) => l.hreflang === "sr")).toBe(true);
    });
  });

  // ─── Reciprocal links ───────────────────────────────────────────

  describe("reciprocal links (FND-I18N-11)", () => {
    it("includes all locales for a 2-locale route", () => {
      const links = buildHreflangSet("airport", "sr", ROUTES_2, LOCALES_2, DEFAULT_2);
      const hreflangs = links.map((l) => l.hreflang);
      expect(hreflangs).toContain("sr");
      expect(hreflangs).toContain("en");
    });

    it("includes all locales for a 3-locale route", () => {
      const links = buildHreflangSet("airport", "en", ROUTES_3, LOCALES_3, DEFAULT_3);
      const hreflangs = links.map((l) => l.hreflang);
      expect(hreflangs).toContain("sr");
      expect(hreflangs).toContain("en");
      expect(hreflangs).toContain("ru");
    });

    it("all links have trailing slashes", () => {
      const links = buildHreflangSet("airport", "sr", ROUTES_3, LOCALES_3, DEFAULT_3);
      for (const link of links) {
        expect(link.href.endsWith("/")).toBe(true);
      }
    });
  });

  // ─── x-default ──────────────────────────────────────────────────

  describe("x-default", () => {
    it("includes x-default pointing to default locale's path", () => {
      const links = buildHreflangSet("airport", "en", ROUTES_2, LOCALES_2, DEFAULT_2);
      const xDefault = links.find((l) => l.hreflang === "x-default");
      expect(xDefault).toBeDefined();
      expect(xDefault!.href).toBe("/aerodrom/");
    });

    it("x-default href matches the default locale's resolved path", () => {
      const links = buildHreflangSet("airport", "en", ROUTES_3, LOCALES_3, DEFAULT_3);
      const xDefault = links.find((l) => l.hreflang === "x-default");
      expect(xDefault).toBeDefined();
      expect(xDefault!.href).toBe("/aerodrom/");
    });
  });

  // ─── Non-indexable routes excluded ───────────────────────────────

  describe("non-indexable routes excluded", () => {
    it("returns empty array for noindex route", () => {
      const links = buildHreflangSet("shared-ride", "sr", ROUTES_3, LOCALES_3, DEFAULT_3);
      expect(links).toEqual([]);
    });
  });

  // ─── Missing translations ────────────────────────────────────────

  describe("missing translations (omit strategy)", () => {
    it("excludes locales where slug is missing", () => {
      // 'local-only' has sr slug but not en
      const links = buildHreflangSet("local-only", "sr", ROUTES_MISSING, LOCALES_2, DEFAULT_2);
      const hreflangs = links.map((l) => l.hreflang);
      // Should have sr + x-default, but NOT en
      expect(hreflangs).toContain("sr");
      expect(hreflangs).not.toContain("en");
    });
  });

  // ─── Nonexistent route ───────────────────────────────────────────

  describe("nonexistent route", () => {
    it("returns empty array for unknown route key", () => {
      const links = buildHreflangSet("nonexistent", "sr", ROUTES_2, LOCALES_2, DEFAULT_2);
      expect(links).toEqual([]);
    });
  });
});
