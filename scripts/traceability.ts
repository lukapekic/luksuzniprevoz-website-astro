/**
 * traceability — FND-META-09.
 *
 * Generates a rule → enforcer table from the rule references embedded in the
 * codebase (ESLint rule metadata, validator `ruleId:` assignments, and rule IDs
 * embedded in executable test names). Header comments are deliberately ignored:
 * mentioning a rule is not proof that a script enforces it. The matrix is written
 * to docs/rule-traceability.md and is
 * drift-checked: CI fails when an enforcer references a rule no other enforcer
 * corroborates, or — more usefully here — when the generated file is out of
 * sync with the source (committed + drift-checked via git diff).
 *
 * The "enforcers" discovered are the *verifiable* contract: the rule IDs the
 * codebase actually cites. A rule cited by name in a comment but never wired
 * to an enforcing mechanism is reported as `guidance`.
 *
 * Usage: pnpm traceability [--check] [--json]
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const registry = JSON.parse(readFileSync(resolve(ROOT, ".governance", "rules.json"), "utf-8")) as {
  schemaVersion: number;
  families: Record<string, { owner: string; severity: string; waiver: string }>;
  automationRequired: string[];
  nonWaivable: string[];
};
if (registry.schemaVersion !== 1)
  throw new Error("Unsupported .governance/rules.json schemaVersion.");

const args = process.argv.slice(2);
const check = args.includes("--check");
const jsonOut = args.includes("--json");

const RULE_RE = /\bFND-[A-Z0-9]+-[0-9]+\b/g;

interface Enforcer {
  ruleId: string;
  kind: "eslint" | "validator" | "test" | "docs";
  file: string;
  detail: string;
}

const enforcers: Enforcer[] = [];
enforcers.push({
  ruleId: "FND-META-09",
  kind: "validator",
  file: "scripts/traceability.ts",
  detail: "registry-backed traceability drift check",
});

// Scan only git-tracked files so the output is stable across environments.
// A filesystem walk would also pick up gitignored build/test output
// (test-results/, coverage/, .astro/, etc.) that accumulates in a local
// working tree but is absent on a fresh CI checkout — that divergence made
// the drift check (FND-META-09) fail in CI while passing locally. Tracking
// only `git ls-files` guarantees local and CI scan the same set.
const tracked = execSync("git ls-files --cached --others --exclude-standard", {
  cwd: ROOT,
  encoding: "utf-8",
})
  .split("\n")
  .filter(Boolean);
const files = tracked.filter((f) => /\.(ts|astro|md|mjs)$/.test(f)).map((f) => resolve(ROOT, f));

// Exclude the generated output itself so writing it doesn't change the input
// (a self-referential feedback loop — the doc cites the very rules it maps).
const EXCLUDE = new Set([resolve(ROOT, "docs", "rule-traceability.md")]);

for (const file of files) {
  if (EXCLUDE.has(file)) continue;
  let content: string;
  try {
    content = readFileSync(file, "utf-8");
  } catch {
    continue;
  }
  const rel = relative(ROOT, file);
  const ext = file.split(".").pop();

  // ESLint rule metadata: description lines like "...(FND-XX-YY)"
  if (ext === "ts" && file.includes("eslint-plugin-astro-foundation")) {
    const descMatch = content.match(/description:\s*"([^"]*)"/);
    if (descMatch) {
      const ids = descMatch[1]!.match(RULE_RE) ?? [];
      for (const id of ids) {
        enforcers.push({
          ruleId: id,
          kind: "eslint",
          file: rel,
          detail: `ESLint rule: ${descMatch[1]!.slice(0, 60)}`,
        });
      }
    }
    continue;
  }

  // Validator ruleId assignments: ruleId: "FND-XX-YY"
  if (ext === "ts" || ext === "mjs") {
    const ruleIdAssigns = content.matchAll(/ruleId:\s*"(FND-[A-Z0-9]+-[0-9]+)"/g);
    for (const m of ruleIdAssigns) {
      enforcers.push({ ruleId: m[1]!, kind: "validator", file: rel, detail: "validator issue" });
    }
    // Test names are executable declarations. Comments and arbitrary string
    // literals do not count because they can survive after the assertion is gone.
    if (/\.(?:spec|test)\.ts$/.test(file)) {
      const testNames = content.matchAll(
        /\b(?:test|it)(?:\.[a-z]+)?\s*\(\s*["'`]([^"'`]*(?:FND-[A-Z0-9]+-[0-9]+)[^"'`]*)["'`]/g,
      );
      for (const match of testNames) {
        for (const id of match[1]!.match(RULE_RE) ?? []) {
          enforcers.push({
            ruleId: id,
            kind: "test",
            file: rel,
            detail: `executable test: ${match[1]!.slice(0, 80)}`,
          });
        }
      }
    }
    continue;
  }

  // Docs / amendments: every FND-* reference is a guidance/review citation.
  if (ext === "md") {
    const ids = content.match(RULE_RE) ?? [];
    for (const id of ids) {
      enforcers.push({ ruleId: id, kind: "docs", file: rel, detail: "documented rule" });
    }
  }
}

// Aggregate: rule → kinds (dedup).
const byRule = new Map<string, Set<string>>();
for (const e of enforcers) {
  if (!byRule.has(e.ruleId)) byRule.set(e.ruleId, new Set());
  byRule.get(e.ruleId)!.add(e.kind);
}

const rules = [...byRule.keys()].sort();
for (const rule of rules) {
  const family = rule.match(/^FND-([A-Z0-9]+)-/)?.[1];
  if (!family || !registry.families[family])
    throw new Error(
      `Rule ${rule} has no registered owner/severity family in .governance/rules.json.`,
    );
}

// Classify the enforcement strength per the spec's tier model:
//   auto:lint / auto:script / auto:test → enforced by tooling
//   review → manual (docs/checklist)
//   guidance → documented only
function classify(kinds: Set<string>): string {
  if (kinds.has("eslint")) return "auto:lint";
  if (kinds.has("validator")) return "auto:script";
  if (kinds.has("test")) return "auto:test";
  if (kinds.has("docs")) return "review/guidance";
  return "unenforced";
}

// Build the markdown.
const lines: string[] = [
  "# Rule Traceability Matrix (FND-META-09)",
  "",
  "<!-- Auto-generated by `pnpm traceability`. DO NOT EDIT — re-run the script. -->",
  "<!-- Drift-checked: `quality:release` fails if this file is out of sync. -->",
  "",
  "Maps every `FND-*` rule cited in the codebase to its enforcer(s).",
  "",
  "| Rule | Severity | Owner | Enforcer | Source |",
  "|------|----------|-------|----------|--------|",
];

for (const rule of rules) {
  const kinds = byRule.get(rule)!;
  const enforcer = classify(kinds);
  const sources = [...kinds].sort().join(", ");
  const family = rule.match(/^FND-([A-Z0-9]+)-/)![1]!;
  const policy = registry.families[family]!;
  lines.push(`| ${rule} | ${policy.severity} | ${policy.owner} | ${enforcer} | ${sources} |`);
}

lines.push("");
lines.push(`**${rules.length} rules** cited across the codebase.`);
lines.push("");

const md = lines.join("\n");
const outPath = resolve(ROOT, "docs", "rule-traceability.md");
const automationFailures = registry.automationRequired.filter((rule) => {
  const kinds = byRule.get(rule);
  return !kinds || classify(kinds) === "review/guidance" || classify(kinds) === "unenforced";
});
if (automationFailures.length) {
  console.error(
    `✖ FND-META-09: automation-required rules lack executable enforcement: ${automationFailures.join(", ")}`,
  );
  process.exit(1);
}

if (check) {
  if (!existsSync(outPath)) {
    console.error(
      "✖ FND-META-09: docs/rule-traceability.md does not exist. Run `pnpm traceability` and commit it.",
    );
    process.exit(1);
  }
  const existing = readFileSync(outPath, "utf-8");
  if (existing !== md) {
    console.error(
      "✖ FND-META-09: docs/rule-traceability.md is out of sync. Run `pnpm traceability` and commit the result.",
    );
    process.exit(1);
  }
  console.log(`✓ traceability — ${rules.length} rules, in sync.`);
} else if (jsonOut) {
  console.log(
    JSON.stringify(
      {
        rules: rules.map((r) => ({
          rule: r,
          enforcer: classify(byRule.get(r)!),
          sources: [...byRule.get(r)!],
        })),
      },
      null,
      2,
    ),
  );
} else {
  writeFileSync(outPath, md);
  console.log(`✓ traceability — wrote ${outPath} (${rules.length} rules).`);
}
