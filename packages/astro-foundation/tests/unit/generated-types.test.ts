import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// tests/unit/ → packages/astro-foundation/src/generated/types.ts
const generatedPath = resolve(__dirname, "../../src/generated/types.ts");

/**
 * Guards the generated types file (FND-TYPE-01/03/04). The file is machine-
 * owned; these tests assert it exists, parses, and exports the expected union
 * types so a broken or stale generation is caught in CI (alongside the drift
 * check in quality:page).
 */
describe("generated/types.ts (FND-TYPE-01/03/04)", () => {
  const source = existsSync(generatedPath) ? readFileSync(generatedPath, "utf-8") : "";

  it("exists and is marked machine-owned", () => {
    expect(
      existsSync(generatedPath),
      "generated/types.ts must exist — run pnpm types:generate",
    ).toBe(true);
    expect(source).toContain("DO NOT EDIT");
  });

  it("exports LocaleCode", () => {
    expect(source).toMatch(/export type LocaleCode = "sr" \| "en" \| "ru"/);
  });

  // Site-agnostic: the generated types are regenerated per target site
  // (default site/luksuzni-prevoz), so this test asserts STRUCTURAL invariants
  // (unions exist, are non-empty, "home" is always a route, every token name is
  // a valid CSS-ident stem) rather than a specific site's keys/tokens. This
  // keeps the gate green regardless of which site the types were generated from.
  it("exports RouteKey as a non-empty union that includes home", () => {
    expect(source).toMatch(/export type RouteKey =/);
    expect(source).toContain('"home"'); // every site has a home route
    // The union must list at least two keys (a non-trivial route map).
    const m = source.match(/export type RouteKey = ([^;]+);/);
    expect(m, "RouteKey union not found").not.toBeNull();
    const keys = m![1]!.match(/"([^"]+)"/g)!.map((s) => s.slice(1, -1));
    expect(keys.length, "RouteKey union must be non-empty").toBeGreaterThan(1);
  });

  it("exports UiStringKey", () => {
    expect(source).toMatch(/export type UiStringKey =/);
    expect(source).toContain('"home.title"');
    expect(source).toContain('"nav.menu"');
  });

  it("exports a non-empty TokenName union (FND-THEME-08)", () => {
    expect(source).toMatch(/export type TokenName =/);
    const m = source.match(/export type TokenName = ([^;]+);/);
    expect(m, "TokenName union not found").not.toBeNull();
    const names = m![1]!.match(/"([^"]+)"/g)!.map((s) => s.slice(1, -1));
    expect(names.length, "TokenName union must be non-empty").toBeGreaterThan(0);
  });

  it("TokenName token names are valid CSS-ident stems (no dots)", () => {
    // A key like "0.5" is sanitized to "0_5" (the `.` is illegal in a CSS
    // custom-property name). The TokenName literal must reflect the sanitized
    // form so `var(\`--${name}\`)` resolves. The regex below enforces this for
    // EVERY token name site-agnostically: any unsanitized `.` (or other
    // illegal char) fails the allowed-char set, subsuming the old
    // "space-0_5" / not-"space-0.5" concrete example.
    const m = source.match(/export type TokenName = ([^;]+);/);
    expect(m, "TokenName union not found").not.toBeNull();
    const names = m![1]!.match(/"([^"]+)"/g)!.map((s) => s.slice(1, -1));
    expect(names.length, "TokenName union must be non-empty").toBeGreaterThan(0);
    for (const n of names) {
      expect(n, `"${n}" contains an illegal CSS-ident char`).toMatch(/^[a-zA-Z0-9_-]+$/);
    }
  });

  it("exports StructuredDataType, IslandEvent, RouteLocales", () => {
    expect(source).toMatch(/export type StructuredDataType =/);
    expect(source).toMatch(/export type IslandEvent =/);
    expect(source).toMatch(/export type RouteLocales =/);
  });
});
