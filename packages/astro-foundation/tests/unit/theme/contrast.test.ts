import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  validateModeContrast,
} from "../../../src/theme/validate-theme.ts";
import type { ModeColors } from "../../../src/theme/schema.ts";

describe("WCAG contrast calculations", () => {
  describe("hexToRgb", () => {
    it("parses 6-digit hex", () => {
      const result = hexToRgb("#FF0000");
      expect(result).toEqual([1, 0, 0]);
    });

    it("parses 3-digit hex", () => {
      const result = hexToRgb("#F00");
      expect(result).toEqual([1, 0, 0]);
    });

    it("handles black and white", () => {
      expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
      expect(hexToRgb("#FFF")).toEqual([1, 1, 1]);
    });
  });

  describe("relativeLuminance", () => {
    it("black is 0", () => {
      expect(relativeLuminance("#000000")).toBe(0);
    });

    it("white is 1", () => {
      expect(relativeLuminance("#FFFFFF")).toBe(1);
    });

    it("is in [0, 1]", () => {
      const l = relativeLuminance("#0066CC");
      expect(l).toBeGreaterThan(0);
      expect(l).toBeLessThan(1);
    });
  });

  describe("contrastRatio", () => {
    it("same color is 1:1", () => {
      expect(contrastRatio("#000000", "#000000")).toBe(1);
    });

    it("black vs white is 21:1", () => {
      expect(contrastRatio("#000000", "#FFFFFF")).toBe(21);
    });

    it("order doesn't matter", () => {
      const a = contrastRatio("#FFFFFF", "#1A1A1A");
      const b = contrastRatio("#1A1A1A", "#FFFFFF");
      expect(a).toBe(b);
    });

    it("#1A1A1A on #FFFFFF has high contrast", () => {
      const ratio = contrastRatio("#1A1A1A", "#FFFFFF");
      expect(ratio).toBeGreaterThan(12);
    });
  });

  describe("validateModeContrast", () => {
    const validLightMode: ModeColors = {
      surface: { base: "#FFFFFF", raised: "#F5F5F5", overlay: "#FFFFFF", sunken: "#E8E8E8" },
      text: { primary: "#1A1A1A", secondary: "#4A4A4A", muted: "#7A7A7A", "on-accent": "#FFFFFF" },
      focus: { ring: "#0066CC", "ring-offset": "#FFFFFF" },
      accent: { primary: "#0066CC", secondary: "#4C99CC", subtle: "#E6F0FA" },
      border: { default: "#767676", strong: "#5A5A5A" },
    };

    it("passes for a valid light mode", () => {
      const issues = validateModeContrast("light", validLightMode);
      expect(issues).toHaveLength(0);
    });

    it("fails when text.primary has low contrast", () => {
      const badMode = {
        ...validLightMode,
        text: {
          ...validLightMode.text,
          primary: "#C0C0C0", // too light on white
        },
      };
      const issues = validateModeContrast("light", badMode);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]?.offendingValue).toContain("text.primary on surface.base");
    });

    it("fails when focus.ring has low contrast", () => {
      const badMode = {
        ...validLightMode,
        focus: {
          ...validLightMode.focus,
          ring: "#E0E0E0", // too light on white
        },
      };
      const issues = validateModeContrast("light", badMode);
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]?.offendingValue).toContain("focus.ring on surface.base");
    });

    it("validates focus.ring against ring-offset in dark mode", () => {
      const darkMode: ModeColors = {
        surface: { base: "#121212", raised: "#1E1E1E", overlay: "#2A2A2A", sunken: "#0A0A0A" },
        text: {
          primary: "#F0F0F0",
          secondary: "#B0B0B0",
          muted: "#808080",
          "on-accent": "#FFFFFF",
        },
        focus: { ring: "#1A1A1A", "ring-offset": "#1E1E1E" }, // terrible: ring same as offset
        accent: { primary: "#4DA3FF", secondary: "#80BFFF", subtle: "#1A3A5C" },
        border: { default: "#3A3A3A", strong: "#5A5A5A" },
      };
      const issues = validateModeContrast("dark", darkMode);
      expect(issues.some((i) => i.offendingValue?.includes("ring-offset"))).toBe(true);
    });

    it("passes for a valid dark mode", () => {
      const validDark: ModeColors = {
        surface: { base: "#121212", raised: "#1E1E1E", overlay: "#2A2A2A", sunken: "#0A0A0A" },
        text: {
          primary: "#F0F0F0",
          secondary: "#B0B0B0",
          muted: "#808080",
          "on-accent": "#FFFFFF",
        },
        focus: { ring: "#4DA3FF", "ring-offset": "#121212" },
        accent: { primary: "#4DA3FF", secondary: "#80BFFF", subtle: "#1A3A5C" },
        border: { default: "#6A6A6A", strong: "#8A8A8A" },
      };
      const issues = validateModeContrast("dark", validDark);
      expect(issues).toHaveLength(0);
    });
  });
});
