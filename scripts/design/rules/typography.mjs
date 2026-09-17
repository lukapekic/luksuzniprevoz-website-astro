import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

export const rule = {
  id: "typography/non-semantic-font",
  description: "Typography must use the heading/body/brand roles defined by the active theme.",
  severity: "P2",
  scan({ root, files }) {
    const findings = [];
    const rawFont = /font-family\s*:\s*([^;{}]+);/gi;
    const badArbitrary = /font-\[([^\]]+)\]/g;

    for (const file of files) {
      if (!/\.(astro|css|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original).replace(
        /@font-face\s*\{[^}]*\}/gi,
        (block) => block.replace(/[^\n]/g, " "),
      );

      let match;
      while ((match = rawFont.exec(text))) {
        const value = match[1].trim();
        if (/^var\(--(?:font-(?:heading|body|brand)|recipe-[a-z0-9-]+-font)\)$/i.test(value))
          continue;
        if (/^(?:inherit|initial|unset)$/i.test(value)) continue;
        findings.push(
          makeFinding({
            ruleId: rule.id,
            severity: "P2",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Raw font-family declaration "${value}" bypasses semantic font roles.`,
            recommendation:
              "Use var(--font-heading), var(--font-body), var(--font-brand), or the canonical Tailwind utilities.",
          }),
        );
      }

      while ((match = badArbitrary.exec(text))) {
        const value = match[1];
        if (/var\(--font-(?:heading|body|brand)\)/i.test(value)) continue;
        findings.push(
          makeFinding({
            ruleId: rule.id,
            severity: "P2",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Arbitrary font utility "${match[0]}" is not one of the approved font roles.`,
            recommendation: "Use font-heading, font-body, or font-brand.",
          }),
        );
      }

      const brandUse = /(?:\bfont-brand\b|var\(--font-brand\))/g;
      while ((match = brandUse.exec(text))) {
        if (
          /\bBrandLockup\.(?:astro|tsx?)$/i.test(file) ||
          /[\\/]components[\\/]brand[\\/].*LogoType\.(?:astro|tsx?)$/i.test(file) ||
          /\/src\/styles\/global\.css$/i.test(file)
        )
          continue;
        findings.push(
          makeFinding({
            ruleId: "typography/brand-role-ownership",
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: "Brand typography is reserved for the reviewed BrandLockup contract.",
            recommendation: "Use font-heading or font-body outside BrandLockup.",
          }),
        );
      }

      const rawFontSize = /font-size\s*:\s*([^;{}]+);/gi;
      while ((match = rawFontSize.exec(text))) {
        const value = match[1].trim();
        if (
          value === "inherit" ||
          value === "initial" ||
          value === "unset" ||
          /var\(--(?:text-|recipe-[a-z0-9-]+-size)/.test(value)
        )
          continue;
        findings.push(
          makeFinding({
            ruleId: "typography/raw-type-size",
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Raw font-size declaration "${value}" bypasses the semantic type scale.`,
            recommendation:
              "Use an active --text-* token or an approved semantic typography recipe.",
          }),
        );
      }
    }
    return findings;
  },
};
