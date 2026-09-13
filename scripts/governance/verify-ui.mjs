#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { findRepoRoot, loadConfig } from "../design/lib.mjs";
import { resolveChangeScope, targetMatchesScope, unionProfileGates } from "./change-scope.mjs";
import { scopeSourceHash, validateReviewEvidence } from "./review-evidence.mjs";

const argv = process.argv.slice(2);
const valueAfter = (name) => {
  const index = argv.indexOf(name);
  if (index === -1) return null;
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
  return value;
};

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const target = valueAfter("--target");
  const surface = valueAfter("--surface");
  const change = valueAfter("--change");
  const evidenceArg = valueAfter("--evidence");
  const review = valueAfter("--review");
  const scopeComplete = argv.includes("--scope-complete");
  const base = valueAfter("--base") ?? process.env.DESIGN_GOVERNANCE_BASE;
  if (!change)
    throw new Error("Missing --change <small-ui|page|component|theme|routing-content|foundation>.");
  if (change !== "foundation" && (!target || !surface))
    throw new Error("UI verification requires both --target and --surface.");

  const policy = JSON.parse(fs.readFileSync(path.join(root, ".governance/policy.json"), "utf8"));
  if (!policy.changeProfiles?.[change]) throw new Error(`Unknown change profile "${change}".`);
  const scope = resolveChangeScope(root, config, policy, { base });
  if (!targetMatchesScope(root, target, scope))
    throw new Error(
      `Target ${target} is not in the discovered change scope. Verify the changed target or use a scoped completion target.`,
    );
  const changedUi = scope.changes.filter((item) =>
    ["production-ui", "dev-ui"].includes(item.classification.kind),
  );
  if (!scopeComplete && changedUi.length > 1) {
    throw new Error(
      `Change scope contains ${changedUi.length} UI files. Pass --scope-complete after reviewing the full scope; one target cannot certify the entire change.`,
    );
  }
  const profiles = [...new Set([change, ...scope.profiles])];
  const selectedProfile = unionProfileGates(policy, profiles);
  const profile = [
    "governance-validate",
    "skills-validate",
    "components-check",
    ...selectedProfile,
  ].filter((gate, index, gates) => gates.indexOf(gate) === index);

  const scoped = (...args) => [
    ...args,
    ...(target ? ["--target", target] : []),
    ...(surface ? ["--surface", surface] : []),
  ];
  const commands = {
    "governance-validate": ["pnpm", "governance:validate"],
    "skills-validate": ["pnpm", "skills:validate"],
    "components-check": ["pnpm", "components:check"],
    "contracts-validate": ["pnpm", "contracts:validate"],
    "reviews-validate": ["pnpm", "reviews:validate"],
    "design-context": ["node", "scripts/design/context.mjs", ...scoped()],
    "design-sync-check": ["pnpm", "design:sync:check"],
    "foundation-doctor": ["pnpm", "foundation:doctor"],
    "theme-sync-check": ["pnpm", "theme:sync:check"],
    "theme-validate": ["pnpm", "theme:validate"],
    "design-doctor": ["pnpm", "design:doctor"],
    "design-detect": scopeComplete
      ? ["pnpm", "design:detect", "--strict"]
      : ["node", "scripts/design/detect.mjs", ...scoped("--strict")],
    "types-check": ["pnpm", "types:generate:check"],
    "content-validate": ["pnpm", "content:validate", "site/luksuzni-prevoz"],
    "routes-validate": ["pnpm", "routes:validate", "site/luksuzni-prevoz"],
    "seo-validate": ["pnpm", "seo:validate", "site/luksuzni-prevoz"],
    "traceability-check": ["pnpm", "traceability", "--check"],
    "component-impact": ["node", "scripts/governance/component-impact.mjs", "--target", target],
    check: ["pnpm", "check"],
    lint: ["pnpm", "lint"],
    "unit-tests": ["pnpm", "test:unit"],
    "site-build": ["pnpm", "--filter", "@luksuzni-prevoz/site", "build"],
    "browser-a11y": ["pnpm", "test:a11y"],
  };

  const evidence = {
    schemaVersion: 1,
    change,
    requestedProfile: change,
    resolvedProfiles: profiles,
    target: target ?? null,
    surface: surface ?? null,
    scopeComplete,
    changeScope: scope,
    sourceHash: scopeSourceHash(root, scope),
    startedAt: new Date().toISOString(),
    results: [],
  };
  for (const gate of profile) {
    const command = commands[gate];
    if (!command) throw new Error(`Profile references unknown gate "${gate}".`);
    const started = Date.now();
    console.log(`\n[verify:ui] ${gate}: ${command.join(" ")}`);
    const result = spawnSync(command[0], command.slice(1), {
      cwd: root,
      encoding: "utf8",
      env: process.env,
    });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    evidence.results.push({
      gate,
      command,
      exitCode: result.status ?? 1,
      durationMs: Date.now() - started,
    });
    if (result.status !== 0) {
      evidence.completedAt = new Date().toISOString();
      evidence.ok = false;
      writeEvidence(root, evidenceArg, evidence);
      process.exit(result.status ?? 1);
    }
  }
  const uiCompletion = scope.changes.some((item) =>
    ["production-ui", "dev-ui"].includes(item.classification.kind),
  );
  if (uiCompletion && !review) {
    evidence.completedAt = new Date().toISOString();
    evidence.ok = false;
    evidence.completion =
      "incomplete: fresh independent browser and manual review evidence is required";
    writeEvidence(root, evidenceArg, evidence);
    throw new Error(
      "UI completion requires --review <evidence.json> bound to the current change scope.",
    );
  }
  if (review) {
    const viewports = JSON.parse(
      fs.readFileSync(path.join(root, ".governance/viewports.json"), "utf8"),
    );
    const localeSource = fs.readFileSync(
      path.join(root, config.siteRoot, "foundation.config.ts"),
      "utf8",
    );
    const locales = [...localeSource.matchAll(/code:\s*["']([^"']+)["']/g)].map(
      (match) => match[1],
    );
    const validatedReview = validateReviewEvidence(
      root,
      review,
      scope,
      viewports.viewports.map((viewport) => viewport.id),
      locales,
    );
    evidence.review = {
      path: path.relative(root, validatedReview.absolute),
      reviewer: validatedReview.evidence.reviewer,
    };
  }
  evidence.completedAt = new Date().toISOString();
  evidence.ok = true;
  writeEvidence(root, evidenceArg, evidence);
  console.log(
    `\n[verify:ui] ${change} static verification passed (${profile.length} gates; profiles: ${profiles.join(", ")}).`,
  );
} catch (error) {
  console.error(`[verify:ui] ${error.message}`);
  process.exit(1);
}

function writeEvidence(root, requestedPath, evidence) {
  const output = requestedPath
    ? path.resolve(root, requestedPath)
    : path.join(root, ".design/.cache", `verify-ui-${Date.now()}.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
  console.log(`[verify:ui] Evidence: ${path.relative(root, output)}`);
}
