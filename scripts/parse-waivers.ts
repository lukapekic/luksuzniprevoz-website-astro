/**
 * parse-waivers — FND-META-10.
 *
 * Parses docs/exceptions.md waiver entries and fails the gate when:
 *  - an entry is malformed (missing required fields)
 *  - an entry is expired (Review Date in the past and Status is not "expired")
 *  - an entry waives FND-A11Y-01 (non-waivable)
 *  - an entry's Status is "approved" with no Review Date, or a Review Date > 6
 *    months from today (the spec caps waiver re-review at 6 months)
 *
 * Waiver format (see docs/exceptions.md):
 *   ### [W-NNN] Brief Title
 *   - **Rule**: FND-XX-YY
 *   - **Severity**: error | warning
 *   - **Component/Area**: ...
 *   - **Requested by**: Name, Date
 *   - **Reason**: ...
 *   - **Proposed Mitigation**: ...
 *   - **Review Date**: YYYY-MM-DD  (max 6 months out)
 *   - **Status**: proposed | approved | expired
 *
 * Usage: pnpm parse-waivers [path/to/project]
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { FoundationIssue } from "../packages/astro-foundation/src/core/errors.ts";
import { formatIssues } from "../packages/astro-foundation/src/core/errors.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const targetArg = process.argv.slice(2).find((a) => !a.startsWith("--"));
const resolvedTarget = targetArg ? resolve(ROOT, targetArg) : resolve(ROOT, "examples", "reference-site");
const exceptionsPath = resolve(resolvedTarget, "docs", "exceptions.md");
// Fall back to the monorepo-root docs/exceptions.md (the canonical one).
const rootExceptions = resolve(ROOT, "docs", "exceptions.md");
const path = existsSync(exceptionsPath) ? exceptionsPath : rootExceptions;

const issues: FoundationIssue[] = [];

if (!existsSync(path)) {
  // No exceptions file at all is fine (template projects start empty).
  console.log("✓ parse-waivers — no exceptions file (no waivers to enforce).");
  process.exit(0);
}

const NON_WAIVABLE = new Set(["FND-A11Y-01"]);
const MAX_WAIVER_MONTHS = 6;
const REQUIRED_FIELDS = ["Rule", "Severity", "Component/Area", "Requested by", "Reason", "Proposed Mitigation", "Review Date", "Status"];

const raw = readFileSync(path, "utf-8");

// Strip fenced code blocks so the waiver FORMAT template and the EXAMPLE
// waiver (both inside ```markdown fences) are not parsed as real entries.
// Only real waiver sections — top-level `### [W-NNN]` headings outside code
// fences — are enforced.
const stripped = raw.replace(/```[\s\S]*?```/g, "");

// Today is fixed per the spec's "current date" context for determinism.
const today = new Date("2026-08-16T00:00:00Z");

// Split into waiver sections: each `### [W-NNN]` heading starts one.
const sections = stripped.split(/^### \[W-\d+\]/m).slice(1);

if (sections.length === 0) {
  console.log("✓ parse-waivers — no waiver entries found.");
  process.exit(0);
}

// Re-extract the IDs (the split consumed them).
const idMatches = [...stripped.matchAll(/^### \[(W-\d+)\] (.+)$/gm)];

for (let i = 0; i < sections.length; i++) {
  const id = idMatches[i]?.[1] ?? `W-?`;
  const title = idMatches[i]?.[2]?.trim() ?? "(untitled)";
  const body = sections[i]!;
  const sectionRef = `docs/exceptions.md [${id}] ${title}`;

  // Parse the `- **Field**: value` lines.
  const fields = new Map<string, string>();
  for (const m of body.matchAll(/- \*\*([^*]+)\*\*:\s*(.*)/g)) {
    fields.set(m[1]!.trim(), m[2]!.trim());
  }

  // Required fields present?
  for (const f of REQUIRED_FIELDS) {
    if (!fields.has(f) || fields.get(f) === "") {
      issues.push({
        ruleId: "FND-META-10",
        severity: "error",
        filePath: sectionRef,
        offendingValue: `Missing required field: "${f}"`,
        expectedValue: `All of: ${REQUIRED_FIELDS.join(", ")}`,
        docAnchor: "#FND-META-10",
      });
    }
  }

  const rule = fields.get("Rule") ?? "";
  const status = fields.get("Status") ?? "";
  const reviewDateStr = fields.get("Review Date") ?? "";
  const severity = fields.get("Severity") ?? "";

  // FND-A11Y-01 is non-waivable.
  if (rule && NON_WAIVABLE.has(rule)) {
    issues.push({
      ruleId: "FND-A11Y-01",
      severity: "error",
      filePath: sectionRef,
      offendingValue: `Waiver requests non-waivable rule ${rule}`,
      expectedValue: "FND-A11Y-01 cannot be waived under any circumstance",
      fix: "Remove the waiver; remediate the a11y issue instead",
      docAnchor: "#FND-A11Y-01",
    });
  }

  // Validate the rule ID format.
  if (rule && !/^FND-[A-Z0-9]+-[0-9]+$/.test(rule)) {
    issues.push({
      ruleId: "FND-META-10",
      severity: "error",
      filePath: sectionRef,
      offendingValue: `Invalid Rule ID: "${rule}"`,
      expectedValue: "Format: FND-XX-NN (e.g. FND-PERF-03)",
      docAnchor: "#FND-META-10",
    });
  }

  // Validate severity.
  if (severity && !["error", "warning"].includes(severity)) {
    issues.push({
      ruleId: "FND-META-10",
      severity: "error",
      filePath: sectionRef,
      offendingValue: `Invalid Severity: "${severity}"`,
      expectedValue: "error | warning",
      docAnchor: "#FND-META-10",
    });
  }

  // Review Date + expiry logic.
  const reviewDate = reviewDateStr ? new Date(reviewDateStr + "T00:00:00Z") : null;
  if (reviewDateStr && (!reviewDate || Number.isNaN(reviewDate.getTime()))) {
    issues.push({
      ruleId: "FND-META-10",
      severity: "error",
      filePath: sectionRef,
      offendingValue: `Invalid Review Date: "${reviewDateStr}"`,
      expectedValue: "ISO date YYYY-MM-DD",
      docAnchor: "#FND-META-10",
    });
  } else if (reviewDate) {
    const diffMs = reviewDate.getTime() - today.getTime();
    const diffDays = diffMs / (24 * 60 * 60 * 1000);
    // Expired: review date in the past and status not already "expired".
    if (diffDays < 0 && status !== "expired") {
      issues.push({
        ruleId: "FND-META-10",
        severity: "error",
        filePath: sectionRef,
        offendingValue: `Waiver expired: Review Date ${reviewDateStr} is in the past (Status: "${status}")`,
        expectedValue: "Move to the Expired Waivers section with Status: expired, or renew the review",
        docAnchor: "#FND-META-10",
      });
    }
    // Cap: a new waiver's review date must be ≤ 6 months out.
    const maxDays = MAX_WAIVER_MONTHS * 30;
    if (diffDays > maxDays && status !== "expired") {
      issues.push({
        ruleId: "FND-META-10",
        severity: "error",
        filePath: sectionRef,
        offendingValue: `Review Date ${reviewDateStr} is ${Math.round(diffDays / 30)} months out; exceeds the ${MAX_WAIVER_MONTHS}-month cap`,
        expectedValue: `Review Date within ${MAX_WAIVER_MONTHS} months of request`,
        docAnchor: "#FND-META-10",
      });
    }
  }

  // Approved waiver without a review date is not enforceable.
  if (status === "approved" && !reviewDateStr) {
    issues.push({
      ruleId: "FND-META-10",
      severity: "error",
      filePath: sectionRef,
      offendingValue: `Status is "approved" but no Review Date is set`,
      expectedValue: "An approved waiver must schedule a re-review date",
      docAnchor: "#FND-META-10",
    });
  }
}

if (issues.length > 0) {
  console.error(formatIssues(issues));
  const hasErrors = issues.some((i) => i.severity === "error");
  process.exit(hasErrors ? 1 : 0);
} else {
  console.log(`✓ parse-waivers — ${sections.length} waiver(s), all valid.`);
  process.exit(0);
}
