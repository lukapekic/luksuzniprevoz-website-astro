import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

const physicalProperty =
  /(?:^|[;{]\s*)(left|right|margin-left|margin-right|padding-left|padding-right|border-left|border-right|inset-left|inset-right)\s*:/gim;
const physicalUtility =
  /\b(?:ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r)-(?:\d|\[|px\b|auto\b|full\b)[^\s"'`}]*?/g;
const spacingProperty =
  /(?:^|[;{]\s*)((?:margin|padding|gap|row-gap|column-gap)(?:-[a-z]+)?)\s*:\s*([^;}]+)/gim;
const radiusProperty = /(?:^|[;{]\s*)border-radius\s*:\s*([^;}]+)/gim;
const dimension = /(?:^|[\s,(])(?:\d*\.)?\d+(?:px|rem|em|vw|vh|svw|svh)\b/i;

export const rule = {
  id: "layout/semantic-values",
  description:
    "Direction, spacing, radius, and responsive thresholds must follow semantic design contracts.",
  severity: "P1",
  scan({ root, files, system }) {
    const findings = [];
    const breakpoints = new Set(Object.values(system?.tokens?.layout?.breakpoints ?? {}));
    for (const file of files) {
      if (!/\.(astro|css|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);
      for (const [pattern, label] of [
        [physicalProperty, "physical CSS property"],
        [physicalUtility, "physical direction utility"],
      ]) {
        pattern.lastIndex = 0;
        let match;
        while ((match = pattern.exec(text)))
          findings.push(
            makeFinding({
              ruleId: "layout/logical-direction",
              severity: "P1",
              file: rel(root, file),
              line: lineNumber(text, match.index),
              message: `${label} "${match[0].trim()}" bypasses logical direction semantics.`,
              recommendation:
                "Use the logical property or logical utility owned by the component contract.",
            }),
          );
      }

      spacingProperty.lastIndex = 0;
      let match;
      while ((match = spacingProperty.exec(text))) {
        const value = match[2].trim();
        if (
          value === "0" ||
          !dimension.test(value) ||
          /var\(--(?:space|gutter|column-gap)-/.test(value)
        )
          continue;
        findings.push(
          makeFinding({
            ruleId: "layout/raw-spacing",
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Raw spacing declaration "${match[1]}: ${value}" bypasses semantic spacing tokens.`,
            recommendation: "Use an active semantic spacing, gutter, or column-gap token.",
          }),
        );
      }

      radiusProperty.lastIndex = 0;
      while ((match = radiusProperty.exec(text))) {
        const value = match[1].trim();
        if (
          value === "0" ||
          value.endsWith("%") ||
          /var\(--radius-/.test(value) ||
          !dimension.test(value)
        )
          continue;
        findings.push(
          makeFinding({
            ruleId: "layout/raw-radius",
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Raw radius "${value}" bypasses semantic radius tokens.`,
            recommendation: "Use an active semantic radius token.",
          }),
        );
      }

      const media = /@media\s*\(\s*(?:min|max)-width\s*:\s*([^)\s]+)\s*\)/gim;
      while ((match = media.exec(text))) {
        if (breakpoints.has(match[1])) continue;
        findings.push(
          makeFinding({
            ruleId: "layout/unregistered-breakpoint",
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Responsive threshold "${match[1]}" is not registered by the active theme.`,
            recommendation:
              "Use a registered breakpoint or add a justified structural threshold to the theme source first.",
          }),
        );
      }
    }
    return findings;
  },
};
