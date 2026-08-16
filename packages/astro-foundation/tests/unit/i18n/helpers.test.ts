import { describe, it, expect } from "vitest";
import { resolveAllPaths, getBreadcrumbs, isDefaultLocale } from "../../../src/i18n/helpers.ts";
import {
  LOCALES_2,
  LOCALES_3,
  ROUTES_2,
  ROUTES_3,
  ROUTES_MISSING,
  ROUTES_CYCLE,
  DEFAULT_2,
  DEFAULT_3,
  UI_STRINGS_3,
  UI_STRINGS_CYCLE,
} from "./fixtures.ts";

describe("resolveAllPaths", () => {
  it("resolves all paths for 2-locale config", () => {
    const paths = resolveAllPaths(ROUTES_2, LOCALES_2, DEFAULT_2);
    // 3 routes × 2 locales = 6 paths
    expect(paths.size).toBe(6);
    expect(paths.get("/")).toEqual({ routeKey: "home", locale: "sr", path: "/" });
    expect(paths.get("/en/")).toEqual({ routeKey: "home", locale: "en", path: "/en/" });
    expect(paths.get("/aerodrom/")).toEqual({
      routeKey: "airport",
      locale: "sr",
      path: "/aerodrom/",
    });
    expect(paths.get("/en/airport-transportation/")).toEqual({
      routeKey: "airport",
      locale: "en",
      path: "/en/airport-transportation/",
    });
  });

  it("resolves all paths for 3-locale config", () => {
    const paths = resolveAllPaths(ROUTES_3, LOCALES_3, DEFAULT_3);
    // 7 routes × 3 locales = 21 paths
    expect(paths.size).toBe(21);
  });

  it("skips routes with missing slugs (omit strategy)", () => {
    const paths = resolveAllPaths(ROUTES_MISSING, LOCALES_2, DEFAULT_2);
    // home: sr + en = 2
    // local-only: sr only = 1 (en missing)
    // full-coverage: sr + en = 2
    expect(paths.size).toBe(5);
  });
});

describe("getBreadcrumbs", () => {
  it("resolves a simple 2-level chain (about → home)", () => {
    const crumbs = getBreadcrumbs(ROUTES_3, "about", "sr", DEFAULT_3, UI_STRINGS_3);
    expect(crumbs).toEqual([
      { routeKey: "home", label: "Početna", path: "/" },
      { routeKey: "about", label: "O nama", path: "/o-nama/" },
    ]);
  });

  it("resolves a 3-level chain (private-transfer → services → home)", () => {
    const crumbs = getBreadcrumbs(ROUTES_3, "private-transfer", "sr", DEFAULT_3, UI_STRINGS_3);
    expect(crumbs).toEqual([
      { routeKey: "home", label: "Početna", path: "/" },
      { routeKey: "services", label: "Usluge", path: "/usluge/" },
      { routeKey: "private-transfer", label: "Privatni prevoz", path: "/privatni-prevoz/" },
    ]);
  });

  it("resolves chain in non-default locale", () => {
    const crumbs = getBreadcrumbs(ROUTES_3, "private-transfer", "en", DEFAULT_3, UI_STRINGS_3);
    expect(crumbs).toEqual([
      { routeKey: "home", label: "Početna", path: "/en/" },
      { routeKey: "services", label: "Usluge", path: "/en/services/" },
      { routeKey: "private-transfer", label: "Privatni prevoz", path: "/en/private-transfer/" },
    ]);
  });

  it("returns single item for route without parent", () => {
    const crumbs = getBreadcrumbs(ROUTES_3, "airport", "sr", DEFAULT_3, UI_STRINGS_3);
    expect(crumbs).toEqual([
      { routeKey: "airport", label: "Aerodromski prevoz", path: "/aerodrom/" },
    ]);
  });

  it("returns single item for home route (which has no parent)", () => {
    const crumbs = getBreadcrumbs(ROUTES_3, "home", "sr", DEFAULT_3, UI_STRINGS_3);
    expect(crumbs).toEqual([{ routeKey: "home", label: "Početna", path: "/" }]);
  });

  it("returns empty chain when the starting route has no UI string label", () => {
    const smallStrings = new Map<string, string>([["home", "Home"]]);
    const crumbs = getBreadcrumbs(ROUTES_3, "about", "sr", DEFAULT_3, smallStrings);
    // about has no label in smallStrings, so chain is empty
    expect(crumbs).toEqual([]);
  });

  it("stops chain when an ancestor has no UI string label", () => {
    // services has label but home does not
    const partialStrings = new Map<string, string>([
      ["services", "Usluge"],
      ["private-transfer", "Privatni"],
    ]);
    const crumbs = getBreadcrumbs(ROUTES_3, "private-transfer", "sr", DEFAULT_3, partialStrings);
    // home has no label → stop; chain only has services + private-transfer
    expect(crumbs).toEqual([
      { routeKey: "services", label: "Usluge", path: "/usluge/" },
      { routeKey: "private-transfer", label: "Privatni", path: "/privatni-prevoz/" },
    ]);
  });

  // ─── Cycle detection (FND-SEO-11) ───────────────────────────────

  describe("cycle detection (FND-SEO-11)", () => {
    it("truncates chain when a parent cycle is detected", () => {
      // page-a → page-b → page-c → page-a (cycle)
      const crumbs = getBreadcrumbs(ROUTES_CYCLE, "page-a", "sr", DEFAULT_2, UI_STRINGS_CYCLE);
      // Walk: a → b → c → a(cycle). Chain before reverse: [a, b, c]. After reverse: [c, b, a]
      const keys = crumbs.map((c) => c.routeKey);
      expect(keys).toEqual(["page-c", "page-b", "page-a"]);
      // Verify no duplicates
      const unique = new Set(keys);
      expect(unique.size).toBe(keys.length);
    });

    it("detects cycle from different starting point", () => {
      const crumbs = getBreadcrumbs(ROUTES_CYCLE, "page-b", "sr", DEFAULT_2, UI_STRINGS_CYCLE);
      // Walk: b → c → a → b(cycle). Chain before reverse: [b, c, a]. After reverse: [a, c, b]
      const keys = crumbs.map((c) => c.routeKey);
      expect(keys).toEqual(["page-a", "page-c", "page-b"]);
      const unique = new Set(keys);
      expect(unique.size).toBe(keys.length);
    });
  });
});

describe("isDefaultLocale", () => {
  it("returns true for the default locale", () => {
    expect(isDefaultLocale("sr", LOCALES_3)).toBe(true);
  });

  it("returns false for a non-default locale", () => {
    expect(isDefaultLocale("en", LOCALES_3)).toBe(false);
    expect(isDefaultLocale("ru", LOCALES_3)).toBe(false);
  });

  it("returns false for unknown locale code", () => {
    expect(isDefaultLocale("de", LOCALES_3)).toBe(false);
  });
});
