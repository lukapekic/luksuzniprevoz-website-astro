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
    expect(existsSync(generatedPath), "generated/types.ts must exist — run pnpm types:generate").toBe(true);
    expect(source).toContain("DO NOT EDIT");
  });

  it("exports LocaleCode", () => {
    expect(source).toMatch(/export type LocaleCode = "sr" \| "en" \| "ru"/);
  });

  it("exports RouteKey with the expected route keys", () => {
    expect(source).toMatch(/export type RouteKey = "home" \| "airport" \| "about"/);
    // All 8 reference-site routes
    for (const key of ["home", "airport", "about", "contact", "services", "pricing", "faq", "legal"]) {
      expect(source).toContain(`"${key}"`);
    }
  });

  it("exports UiStringKey", () => {
    expect(source).toMatch(/export type UiStringKey =/);
    expect(source).toContain('"home.title"');
    expect(source).toContain('"nav.menu"');
  });

  it("exports TokenName with theme tokens (FND-THEME-08)", () => {
    expect(source).toMatch(/export type TokenName =/);
    // Surface + text + space + radius tokens from the reference theme.
    expect(source).toContain('"surface-base"');
    expect(source).toContain('"text-primary"');
    expect(source).toContain('"space-4"');
    expect(source).toContain('"radius-md"');
  });

  it("TokenName token names are valid CSS-ident stems (no dots)", () => {
    // A key like "0.5" is sanitized to "0_5" (the `.` is illegal in a CSS
    // custom-property name). The TokenName literal must reflect the sanitized
    // form so `var(\`--${name}\`)` resolves.
    const m = source.match(/export type TokenName = ([^;]+);/);
    expect(m, "TokenName union not found").not.toBeNull();
    const names = m![1]!.match(/"([^"]+)"/g)!.map((s) => s.slice(1, -1));
    for (const n of names) {
      expect(n, `"${n}" contains an illegal CSS-ident char`).toMatch(/^[a-zA-Z0-9_-]+$/);
    }
    // The fractional spacing key is sanitized, not "space-0.5".
    expect(names).toContain("space-0_5");
    expect(names).not.toContain("space-0.5");
  });

  it("exports StructuredDataType, IslandEvent, RouteLocales", () => {
    expect(source).toMatch(/export type StructuredDataType =/);
    expect(source).toMatch(/export type IslandEvent =/);
    expect(source).toMatch(/export type RouteLocales =/);
  });
});
