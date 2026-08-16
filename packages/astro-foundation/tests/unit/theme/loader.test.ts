import { describe, it, expect } from "vitest";
import { loadThemeTokens } from "../../../src/theme/loader.ts";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "..", "..", "fixtures", "theme");

describe("loadThemeTokens", () => {
  it("loads a valid theme", () => {
    const { tokens, issues } = loadThemeTokens({
      themeDir: join(fixturesDir, "version-valid"),
    });
    expect(issues).toHaveLength(0);
    expect(tokens.manifest.name).toBe("Test Theme");
    expect(tokens.palette.modes["light"]).toBeDefined();
    expect(tokens.typography.fontFamilies["sans"]).toBe("Inter, system-ui, sans-serif");
  });

  it("fails on schemaVersion mismatch (FND-THEME-03)", () => {
    const { tokens, issues } = loadThemeTokens({
      themeDir: join(fixturesDir, "version-bad-schema"),
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0]?.ruleId).toBe("FND-THEME-03");
    expect(issues[0]?.offendingValue).toContain("schemaVersion is 2");
    expect(Object.keys(tokens)).toHaveLength(0);
  });

  it("fails on missing light mode (schema validation)", () => {
    const { issues } = loadThemeTokens({
      themeDir: join(fixturesDir, "version-missing-modes"),
    });
    expect(issues.length).toBeGreaterThan(0);
    // The schema will reject the palette because it has no light mode
    const hasSchemaError = issues.some(
      (i) => i.ruleId === "FND-THEME-03" && i.severity === "error",
    );
    expect(hasSchemaError).toBe(true);
  });

  it("fails on nonexistent directory", () => {
    const { tokens, issues } = loadThemeTokens({
      themeDir: "/nonexistent/path",
    });
    expect(issues.length).toBeGreaterThan(0);
    expect(Object.keys(tokens)).toHaveLength(0);
  });
});
