/**
 * WCAG 2.1 relative luminance and contrast ratio calculations.
 * Used for FND-THEME-06 / FND-A11Y-04 semantic validation.
 */

import type { FoundationIssue } from "../core/errors.ts";
import type { ThemeTokens, ModeColors } from "./schema.ts";

// ── WCAG relative luminance (https://www.w3.org/TR/WCAG21/#dfn-relative-luminance) ──

/** Convert a hex color string to sRGB [r, g, b] in [0, 1]. */
export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const r = Number.parseInt(full.slice(0, 2), 16) / 255;
  const g = Number.parseInt(full.slice(2, 4), 16) / 255;
  const b = Number.parseInt(full.slice(4, 6), 16) / 255;
  return [r, g, b];
}

/** Convert sRGB component to linear light. */
function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate WCAG 2.1 relative luminance for a hex color.
 * Returns a value in [0, 1].
 */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

/**
 * Calculate WCAG 2.1 contrast ratio between two hex colors.
 * Returns a value >= 1 (1:1 = no contrast, 21:1 = max).
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Semantic validation (FND-THEME-06, FND-A11Y-04) ──

interface ContrastCheck {
  fg: string;
  bg: string;
  minRatio: number;
  label: string;
  ruleId: string;
  severity: "error" | "warning";
}

/**
 * Validate a single color mode's contrast ratios.
 * FND-THEME-06: text.primary >= 4.5:1, text.secondary >= 4.5:1, text.muted >= 3:1
 * Focus ring >= 3:1, border >= 3:1
 */
export function validateModeContrast(mode: string, colors: ModeColors): FoundationIssue[] {
  const issues: FoundationIssue[] = [];

  const checks: ContrastCheck[] = [
    {
      fg: colors.text.primary,
      bg: colors.surface.base,
      minRatio: 4.5,
      label: "text.primary on surface.base",
      ruleId: "FND-A11Y-04",
      severity: "error",
    },
    {
      fg: colors.text.secondary,
      bg: colors.surface.base,
      minRatio: 4.5,
      label: "text.secondary on surface.base",
      ruleId: "FND-A11Y-04",
      severity: "error",
    },
    {
      fg: colors.text.muted,
      bg: colors.surface.base,
      minRatio: 3.0,
      label: "text.muted on surface.base (large text)",
      ruleId: "FND-A11Y-04",
      severity: "error",
    },
    {
      fg: colors.focus.ring,
      bg: colors.surface.base,
      minRatio: 3.0,
      label: "focus.ring on surface.base",
      ruleId: "FND-THEME-06",
      severity: "error",
    },
    {
      fg: colors.border.default,
      bg: colors.surface.base,
      minRatio: 3.0,
      label: "border.default on surface.base",
      ruleId: "FND-A11Y-04",
      severity: "warning",
    },
  ];

  // For dark mode, validate focus ring against ring-offset
  if (mode === "dark") {
    checks.push({
      fg: colors.focus.ring,
      bg: colors.focus["ring-offset"],
      minRatio: 3.0,
      label: "focus.ring on focus.ring-offset (dark mode)",
      ruleId: "FND-THEME-06",
      severity: "error",
    });
  }

  for (const check of checks) {
    const ratio = contrastRatio(check.fg, check.bg);
    if (ratio < check.minRatio) {
      issues.push({
        ruleId: check.ruleId,
        severity: check.severity,
        offendingValue: `${mode} mode: ${check.label} has ratio ${ratio.toFixed(2)}:1 (minimum ${check.minRatio}:1)`,
        expectedValue: `Contrast ratio >= ${check.minRatio}:1`,
        docAnchor: "WCAG 2.1 SC 1.4.3 / SC 1.4.11",
      });
    }
  }

  return issues;
}

/**
 * Run semantic validation on all modes in the theme.
 * FND-THEME-06: validates contrast, focus visibility
 * FND-THEME-11: reports WCAG constraint violations
 */
export function validateThemeSemantics(tokens: ThemeTokens): FoundationIssue[] {
  const issues: FoundationIssue[] = [];

  for (const [modeName, colors] of Object.entries(tokens.palette.modes)) {
    const modeIssues = validateModeContrast(modeName, colors);
    issues.push(...modeIssues);
  }

  return issues;
}
