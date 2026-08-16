import { describe, it, expect } from "vitest";
import {
  ManifestSchema,
  PaletteSchema,
  ThemeTokensSchema,
  CURRENT_SCHEMA_VERSION,
} from "../../../src/theme/schema.ts";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "..", "..", "fixtures", "theme");

import { readFileSync } from "node:fs";

function readJson(dir: string, file: string): unknown {
  return JSON.parse(readFileSync(join(dir, file), "utf-8"));
}

describe("Theme schema", () => {
  describe("ManifestSchema", () => {
    it("accepts a valid manifest", () => {
      const result = ManifestSchema.safeParse({
        name: "Default",
        themeVersion: "1.0.0",
        schemaVersion: CURRENT_SCHEMA_VERSION,
        description: "A theme",
        created: "2025-01-01",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing fields", () => {
      const result = ManifestSchema.safeParse({
        name: "Default",
      });
      expect(result.success).toBe(false);
    });

    it("rejects schemaVersion mismatch (FND-THEME-03)", () => {
      const result = ManifestSchema.safeParse({
        name: "Default",
        themeVersion: "1.0.0",
        schemaVersion: 99,
        description: "A theme",
        created: "2025-01-01",
      });
      expect(result.success).toBe(false);
    });

    it("rejects extra fields (strict mode)", () => {
      const result = ManifestSchema.safeParse({
        name: "Default",
        themeVersion: "1.0.0",
        schemaVersion: CURRENT_SCHEMA_VERSION,
        description: "A theme",
        created: "2025-01-01",
        extraField: true,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("PaletteSchema", () => {
    it("accepts a palette with light mode", () => {
      const result = PaletteSchema.safeParse({
        modes: {
          light: {
            surface: { base: "#FFF", raised: "#F5F5F5", overlay: "#FFF", sunken: "#E8E8E8" },
            text: {
              primary: "#1A1A1A",
              secondary: "#4A4A4A",
              muted: "#7A7A7A",
              "on-accent": "#FFF",
            },
            focus: { ring: "#0066CC", "ring-offset": "#FFF" },
            accent: { primary: "#0066CC", secondary: "#004C99", subtle: "#E6F0FA" },
            border: { default: "#D0D0D0", strong: "#A0A0A0" },
          },
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects palette without light mode", () => {
      const result = PaletteSchema.safeParse({
        modes: {
          dark: {
            surface: { base: "#121212", raised: "#1E1E1E", overlay: "#2A2A2A", sunken: "#0A0A0A" },
            text: {
              primary: "#F0F0F0",
              secondary: "#B0B0B0",
              muted: "#808080",
              "on-accent": "#FFF",
            },
            focus: { ring: "#4DA3FF", "ring-offset": "#121212" },
            accent: { primary: "#4DA3FF", secondary: "#80BFFF", subtle: "#1A3A5C" },
            border: { default: "#3A3A3A", strong: "#5A5A5A" },
          },
        },
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty modes", () => {
      const result = PaletteSchema.safeParse({ modes: {} });
      expect(result.success).toBe(false);
    });
  });

  describe("ThemeTokensSchema with fixtures", () => {
    it("accepts the valid fixture", () => {
      const dir = join(fixturesDir, "version-valid");
      const raw = {
        manifest: readJson(dir, "manifest.json"),
        palette: readJson(dir, "palette.json"),
        typography: readJson(dir, "typography.json"),
        spacing: readJson(dir, "spacing.json"),
        radii: readJson(dir, "radii.json"),
        motion: readJson(dir, "motion.json"),
        layout: readJson(dir, "layout.json"),
      };
      const result = ThemeTokensSchema.safeParse(raw);
      expect(result.success).toBe(true);
    });

    it("rejects bad schemaVersion in fixture", () => {
      const dir = join(fixturesDir, "version-bad-schema");
      const raw = {
        manifest: readJson(dir, "manifest.json"),
        palette: readJson(dir, "palette.json"),
        typography: readJson(dir, "typography.json"),
        spacing: readJson(dir, "spacing.json"),
        radii: readJson(dir, "radii.json"),
        motion: readJson(dir, "motion.json"),
        layout: readJson(dir, "layout.json"),
      };
      const result = ThemeTokensSchema.safeParse(raw);
      expect(result.success).toBe(false);
    });

    it("rejects missing light mode in fixture", () => {
      const dir = join(fixturesDir, "version-missing-modes");
      const raw = {
        manifest: readJson(dir, "manifest.json"),
        palette: readJson(dir, "palette.json"),
        typography: readJson(dir, "typography.json"),
        spacing: readJson(dir, "spacing.json"),
        radii: readJson(dir, "radii.json"),
        motion: readJson(dir, "motion.json"),
        layout: readJson(dir, "layout.json"),
      };
      const result = ThemeTokensSchema.safeParse(raw);
      expect(result.success).toBe(false);
    });
  });
});
