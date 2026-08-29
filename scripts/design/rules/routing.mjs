import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

export const rule = {
  id: "routing/manual-localized-url",
  description: "Localized URLs must be generated through the routing/i18n helpers.",
  severity: "P1",
  scan({ root, files }) {
    const findings = [];
    const re = /(?:href|action)\s*=\s*(?:\{|)?["'`](\/(?:en|ru)(?:\/|["'`]))/g;
    for (const file of files) {
      if (!/\.(astro|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);
      let match;
      while ((match = re.exec(text))) {
        findings.push(
          makeFinding({
            ruleId: rule.id,
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: `Manual localized URL starts with "${match[1]}".`,
            recommendation:
              "Use the repository route/i18n helper so locale slugs remain data-driven.",
          }),
        );
      }
    }
    return findings;
  },
};
