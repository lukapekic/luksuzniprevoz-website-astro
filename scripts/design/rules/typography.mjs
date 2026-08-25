import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

export const rule = {
  id: "typography/non-semantic-font",
  description: "Typography must use the heading/body/brand roles defined by the active theme.",
  severity: "P2",
  scan({ root, files }) {
    const findings = [];
    const rawFont = /font-family\s*:\s*([^;]+);/gi;
    const badArbitrary = /font-\[([^\]]+)\]/g;

    for (const file of files) {
      if (!/\.(astro|css|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);

      let match;
      while ((match = rawFont.exec(text))) {
        const value = match[1].trim();
        if (/^var\(--font-(?:heading|body|brand)\)$/i.test(value)) continue;
        if (/^(?:inherit|initial|unset)$/i.test(value)) continue;
        findings.push(makeFinding({
          ruleId: rule.id,
          severity: "P2",
          file: rel(root, file),
          line: lineNumber(text, match.index),
          message: `Raw font-family declaration "${value}" bypasses semantic font roles.`,
          recommendation: "Use var(--font-heading), var(--font-body), var(--font-brand), or the canonical Tailwind utilities."
        }));
      }

      while ((match = badArbitrary.exec(text))) {
        const value = match[1];
        if (/var\(--font-(?:heading|body|brand)\)/i.test(value)) continue;
        findings.push(makeFinding({
          ruleId: rule.id,
          severity: "P2",
          file: rel(root, file),
          line: lineNumber(text, match.index),
          message: `Arbitrary font utility "${match[0]}" is not one of the approved font roles.`,
          recommendation: "Use font-heading, font-body, or font-brand."
        }));
      }
    }
    return findings;
  }
};
