#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { findRepoRoot } from "../design/lib.mjs";

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
  const target = valueAfter("--target");
  const surface = valueAfter("--surface");
  const change = valueAfter("--change");
  const evidenceArg = valueAfter("--evidence");
  if (!change)
    throw new Error("Missing --change <small-ui|page|component|theme|routing-content|foundation>.");
  if (change !== "foundation" && (!target || !surface))
    throw new Error("UI verification requires both --target and --surface.");

  const policy = JSON.parse(fs.readFileSync(path.join(root, ".governance/policy.json"), "utf8"));
  const selectedProfile = policy.changeProfiles?.[change];
  if (!selectedProfile) throw new Error(`Unknown change profile "${change}".`);
  const profile = [
    "governance-validate",
    "skills-validate",
    "components-check",
    ...selectedProfile,
  ];

  const scoped = (...args) => [...args, "--target", target, "--surface", surface];
  const commands = {
    "governance-validate": ["pnpm", "governance:validate"],
    "skills-validate": ["pnpm", "skills:validate"],
    "components-check": ["pnpm", "components:check"],
    "design-context": ["node", "scripts/design/context.mjs", ...scoped()],
    "design-sync-check": ["pnpm", "design:sync:check"],
    "foundation-doctor": ["pnpm", "foundation:doctor"],
    "theme-sync-check": ["pnpm", "theme:sync:check"],
    "theme-validate": ["pnpm", "theme:validate"],
    "design-doctor": ["pnpm", "design:doctor"],
    "design-detect": ["node", "scripts/design/detect.mjs", ...scoped("--strict")],
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
  };

  const evidence = {
    schemaVersion: 1,
    change,
    target: target ?? null,
    surface: surface ?? null,
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
  evidence.completedAt = new Date().toISOString();
  evidence.ok = true;
  writeEvidence(root, evidenceArg, evidence);
  console.log(`\n[verify:ui] ${change} verification passed (${profile.length} gates).`);
} catch (error) {
  console.error(`[verify:ui] ${error.message}`);
  process.exit(1);
}

function writeEvidence(root, requestedPath, evidence) {
  const output = requestedPath
    ? path.resolve(root, requestedPath)
    : path.join(root, ".design/.cache/verify-ui.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
  console.log(`[verify:ui] Evidence: ${path.relative(root, output)}`);
}
