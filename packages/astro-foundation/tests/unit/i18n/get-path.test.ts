import { describe, it, expect } from "vitest";
import { getPath } from "../../../src/i18n/get-path.ts";
import { ROUTES_2, ROUTES_3, ROUTES_MISSING, DEFAULT_2, DEFAULT_3 } from "./fixtures.ts";

describe("getPath", () => {
  // ─── Valid route resolution ──────────────────────────────────────

  describe("valid route resolution (2-locale)", () => {
    it("resolves a simple route in the default locale (unprefixed)", () => {
      const result = getPath("destination", "sr", ROUTES_2, DEFAULT_2);
      expect(result).toBe("/destinacija/");
    });

    it("resolves a simple route in a non-default locale (prefixed)", () => {
      const result = getPath("destination", "en", ROUTES_2, DEFAULT_2);
      expect(result).toBe("/en/destination-transportation/");
    });

    it("resolves the home route (empty slug) in default locale", () => {
      const result = getPath("home", "sr", ROUTES_2, DEFAULT_2);
      expect(result).toBe("/");
    });

    it("resolves the home route in non-default locale", () => {
      const result = getPath("home", "en", ROUTES_2, DEFAULT_2);
      expect(result).toBe("/en/");
    });

    it("resolves the about page", () => {
      expect(getPath("about", "sr", ROUTES_2, DEFAULT_2)).toBe("/o-nama/");
      expect(getPath("about", "en", ROUTES_2, DEFAULT_2)).toBe("/en/about/");
    });
  });

  // ─── 3-locale config ─────────────────────────────────────────────

  describe("3-locale config (sr default, en, ru)", () => {
    it("resolves all three locales for destination route", () => {
      expect(getPath("destination", "sr", ROUTES_3, DEFAULT_3)).toBe("/destinacija/");
      expect(getPath("destination", "en", ROUTES_3, DEFAULT_3)).toBe(
        "/en/destination-transportation/",
      );
      expect(getPath("destination", "ru", ROUTES_3, DEFAULT_3)).toBe("/ru/napravlenie/");
    });

    it("resolves locale-owned multi-segment routes", () => {
      const routes = [
        ...ROUTES_3,
        {
          key: "nested-destination",
          slugs: { sr: "novi-sad", en: "novi-sad", ru: "novi-sad" },
          pathSegments: {
            sr: ["rute", "novi-sad"],
            en: ["routes", "novi-sad"],
            ru: ["marshruty", "novi-sad"],
          },
        },
      ];

      expect(getPath("nested-destination", "sr", routes, DEFAULT_3)).toBe("/rute/novi-sad/");
      expect(getPath("nested-destination", "en", routes, DEFAULT_3)).toBe("/en/routes/novi-sad/");
      expect(getPath("nested-destination", "ru", routes, DEFAULT_3)).toBe(
        "/ru/marshruty/novi-sad/",
      );
    });

    it("resolves nested route (private-transfer)", () => {
      expect(getPath("private-transfer", "sr", ROUTES_3, DEFAULT_3)).toBe("/privatni-prevoz/");
      expect(getPath("private-transfer", "en", ROUTES_3, DEFAULT_3)).toBe("/en/private-transfer/");
    });
  });

  // ─── Trailing slash (FND-I18N-04) ────────────────────────────────

  describe("trailing slash (FND-I18N-04)", () => {
    it("all paths end with /", () => {
      const paths = [
        getPath("home", "sr", ROUTES_2, DEFAULT_2),
        getPath("home", "en", ROUTES_2, DEFAULT_2),
        getPath("destination", "sr", ROUTES_2, DEFAULT_2),
        getPath("destination", "en", ROUTES_2, DEFAULT_2),
        getPath("about", "sr", ROUTES_2, DEFAULT_2),
        getPath("about", "en", ROUTES_2, DEFAULT_2),
      ];
      for (const p of paths) {
        expect(p.endsWith("/")).toBe(true);
      }
    });
  });

  // ─── ASCII-only paths (FND-I18N-06 / SlugSegmentSchema) ──────────

  describe("ASCII-only paths", () => {
    it("all resolved paths contain only ASCII characters and /", () => {
      const paths = [
        getPath("destination", "sr", ROUTES_2, DEFAULT_2),
        getPath("destination", "en", ROUTES_2, DEFAULT_2),
        getPath("destination", "ru", ROUTES_3, DEFAULT_3),
      ];
      for (const p of paths) {
        expect(/^\/[\x20-\x7E]*\/$/.test(p)).toBe(true);
      }
    });
  });

  // ─── Error cases ─────────────────────────────────────────────────

  describe("error cases", () => {
    it("throws on missing route key", () => {
      expect(() => getPath("nonexistent", "sr", ROUTES_2, DEFAULT_2)).toThrow(
        /Route not found: nonexistent/,
      );
    });

    it("throws on missing locale slug", () => {
      // 'local-only' has no 'en' slug
      expect(() => getPath("local-only", "en", ROUTES_MISSING, DEFAULT_2)).toThrow(
        /No slug for route "local-only" in locale "en"/,
      );
    });

    it("throws when pathSegments do not end with the localized slug", () => {
      const routes = [
        ...ROUTES_2,
        {
          key: "broken-nested",
          slugs: { sr: "novi-sad", en: "novi-sad" },
          pathSegments: { sr: ["rute", "wrong"], en: ["routes", "wrong"] },
        },
      ];

      expect(() => getPath("broken-nested", "sr", routes, DEFAULT_2)).toThrow(
        /must end with slug "novi-sad"/,
      );
    });
  });
});
