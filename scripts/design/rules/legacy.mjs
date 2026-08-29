import fs from "node:fs";
import { lineNumber, makeFinding, maskCommentsPreserveLines, rel } from "../lib.mjs";

const markers = [
  { re: /\bversion-1\b/gi, label: "Theme V1/version-1" },
  { re: /Warm Charcoal/gi, label: "Warm Charcoal" },
  { re: /muted[- ]gold/gi, label: "muted gold" },
  { re: /\bFraunces(?: Variable)?\b/gi, label: "Fraunces" },
];

export const rule = {
  id: "legacy/v1-leak",
  description: "Production UI must not reference the retired V1 visual system.",
  severity: "P1",
  scan({ root, files }) {
    const findings = [];
    for (const file of files) {
      if (!/\.(astro|css|ts|tsx|js|jsx)$/i.test(file)) continue;
      const original = fs.readFileSync(file, "utf8");
      const text = maskCommentsPreserveLines(original);
      for (const marker of markers) {
        marker.re.lastIndex = 0;
        let match;
        while ((match = marker.re.exec(text))) {
          findings.push(
            makeFinding({
              ruleId: rule.id,
              severity: marker.label.includes("Fraunces") ? "P2" : "P1",
              file: rel(root, file),
              line: lineNumber(text, match.index),
              message: `${marker.label} reference found in production UI.`,
              recommendation:
                "Use the active theme and current component/design terminology. V1 references are allowed only inside the intentional archived theme source.",
            }),
          );
        }
      }
    }
    return findings;
  },
};
