import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

export const rule = {
  id: "components/legacy-site-chrome",
  description:
    "Production pages must use reviewed SiteHeader/SiteFooter chrome rather than the generic foundation scaffold.",
  severity: "P1",
  scan({ root, files }) {
    const findings = [];
    const headerImport = /from\s+["'][^"']*foundation\/ui\/Header\.astro["']/g;
    const footerImport = /from\s+["'][^"']*foundation\/ui\/Footer\.astro["']/g;

    for (const file of files) {
      if (!/\.(astro|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);
      for (const [re, name, replacement] of [
        [headerImport, "foundation Header", "SiteHeader"],
        [footerImport, "foundation Footer", "SiteFooter"],
      ]) {
        re.lastIndex = 0;
        let match;
        while ((match = re.exec(text))) {
          findings.push(
            makeFinding({
              ruleId: rule.id,
              severity: "P1",
              file: rel(root, file),
              line: lineNumber(text, match.index),
              message: `${name} is mounted in production site chrome.`,
              recommendation: `Use the reviewed ${replacement} component and its canonical data contract.`,
            }),
          );
        }
      }

      if (/SiteHeader/.test(text) && /SkipLink/.test(text) && /import\s+SkipLink/.test(text)) {
        findings.push(
          makeFinding({
            ruleId: "components/duplicate-skip-link-risk",
            severity: "P2",
            file: rel(root, file),
            line: 1,
            message:
              "This file references both SiteHeader and SkipLink; verify that the page does not emit two skip links.",
            recommendation: "Keep skip-link ownership in one reviewed global component.",
          }),
        );
      }
    }
    return findings;
  },
};
