import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

const forbiddenPalette =
  /\b(?:bg|text|border|ring|outline|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g;
const arbitrary =
  /\b(?:bg|text|border|ring|outline|shadow|rounded|max-w|min-w|max-h|min-h|w|h|gap|p[trblxy]?|m[trblxy]?)-\[([^\]]+)\]/g;

export const rule = {
  id: "tailwind/non-semantic-utility",
  description: "Tailwind v4 utilities must not bypass the project token system.",
  severity: "P2",
  scan({ root, files }) {
    const findings = [];
    for (const file of files) {
      if (!/\.(astro|ts|tsx|js|jsx|css)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);

      let match;
      while ((match = forbiddenPalette.exec(text))) {
        findings.push(
          makeFinding({
            ruleId: rule.id,
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Tailwind palette utility "${match[0]}" bypasses the active semantic palette.`,
            recommendation: "Use the semantic CSS-variable/token utility defined by the project.",
          }),
        );
      }

      while ((match = arbitrary.exec(text))) {
        const value = match[1];
        if (/var\(--[a-z0-9-_]+\)/i.test(value)) continue;
        if (/^(?:calc|clamp|min|max)\(/i.test(value) && /var\(--/i.test(value)) continue;
        findings.push(
          makeFinding({
            ruleId: rule.id,
            severity: "P2",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Arbitrary Tailwind design value "${match[0]}" is not token-backed.`,
            recommendation:
              "Map the value to a semantic theme token or an approved component contract.",
          }),
        );
      }
    }
    return findings;
  },
};
