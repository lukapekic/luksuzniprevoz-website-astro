import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

export const rule = {
  id: "a11y/basic-ui-guard",
  description: "Cheap deterministic checks for common accessibility regressions.",
  severity: "P1",
  scan({ root, files }) {
    const findings = [];
    for (const file of files) {
      if (!/\.(astro|tsx|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);

      const imgRe = /<img\b[\s\S]*?>/gi;
      let match;
      while ((match = imgRe.exec(text))) {
        if (!/\balt\s*=/.test(match[0])) {
          findings.push(
            makeFinding({
              ruleId: "a11y/img-alt",
              severity: "P1",
              file: rel(root, file),
              line: lineNumber(text, match.index),
              message: "Plain <img> is missing an alt attribute.",
              recommendation: 'Provide meaningful alt text, or alt="" for a decorative image.',
            }),
          );
        }
      }

      const outlineRe = /\boutline-none\b/g;
      while ((match = outlineRe.exec(text))) {
        const lineStart = text.lastIndexOf("\n", match.index) + 1;
        const lineEnd = text.indexOf("\n", match.index);
        const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);
        if (!/focus(?:-visible)?:/.test(line)) {
          findings.push(
            makeFinding({
              ruleId: "a11y/focus-visible",
              severity: "P1",
              file: rel(root, file),
              line: lineNumber(text, match.index),
              message: "outline-none appears without a same-line focus/focus-visible replacement.",
              recommendation:
                "Keep a visible keyboard focus state using the semantic focus tokens.",
            }),
          );
        }
      }

      const divClickRe = /<div\b[^>]*(?:onclick|on:click)\s*=/gi;
      while ((match = divClickRe.exec(text))) {
        findings.push(
          makeFinding({
            ruleId: "a11y/interactive-div",
            severity: "P1",
            file: rel(root, file),
            line: lineNumber(text, match.index),
            message: "Clickable <div> detected.",
            recommendation:
              "Use a semantic button/link, or supply complete keyboard semantics only when no native element fits.",
          }),
        );
      }
    }
    return findings;
  },
};
