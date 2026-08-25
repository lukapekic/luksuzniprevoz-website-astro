import fs from "node:fs";
import { insideSvgBlock, lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

export const rule = {
  id: "theme/raw-design-value",
  description: "Production UI must consume semantic theme tokens instead of raw color values.",
  severity: "P2",
  scan({ root, config, files }) {
    const findings = [];
    const colorRe = /#[0-9a-fA-F]{3,8}\b|(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch)\s*\(/g;

    for (const file of files) {
      if (!/\.(astro|css|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);
      let match;
      while ((match = colorRe.exec(text))) {
        if (insideSvgBlock(text, match.index)) continue;
        const before = text.slice(Math.max(0, match.index - 60), match.index);
        if (/sourceMappingURL|data:image/i.test(before)) continue;
        findings.push(makeFinding({
          ruleId: rule.id,
          severity: "P2",
          file: rel(root, file),
          line: lineNumber(text, match.index),
          message: `Raw color value "${match[0]}" found in production UI.`,
          recommendation: "Use an existing semantic theme token. If a genuinely new role is required, change the theme source first."
        }));
      }
    }
    return findings;
  }
};
