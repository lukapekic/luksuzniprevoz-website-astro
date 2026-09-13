import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { classifyTarget, normalizeTarget, rel } from "../design/lib.mjs";

function gitLines(root, args, { required = false } = {}) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    if (required) throw new Error(`Git change discovery failed: git ${args.join(" ")}`);
    return [];
  }
  return result.stdout.split(/\r?\n/).filter(Boolean);
}

export function discoverChangedPaths(root, { base = process.env.DESIGN_GOVERNANCE_BASE } = {}) {
  if (process.env.CI && !base)
    throw new Error(
      "CI change verification requires DESIGN_GOVERNANCE_BASE with an explicit base revision.",
    );
  const paths = new Set();
  if (base) {
    for (const file of gitLines(
      root,
      ["diff", "--name-only", "--diff-filter=ACMR", `${base}...HEAD`],
      {
        required: true,
      },
    ))
      paths.add(file);
  }
  for (const args of [
    ["diff", "--name-only", "--diff-filter=ACMR"],
    ["diff", "--cached", "--name-only", "--diff-filter=ACMR"],
    ["ls-files", "--others", "--exclude-standard"],
  ]) {
    for (const file of gitLines(root, args)) paths.add(file);
  }
  return [...paths].sort();
}

export function profileForClassification(classification, sharedPaths = new Set()) {
  if (classification.kind === "theme") return "theme";
  if (classification.kind === "routing-content") return "routing-content";
  if (classification.kind === "foundation" || classification.kind === "contract")
    return "foundation";
  if (classification.kind === "production-ui" || classification.kind === "dev-ui")
    return sharedPaths.has(classification.path) ? "component" : "small-ui";
  return null;
}

export function resolveChangeScope(root, config, policy, { base } = {}) {
  const sharedRegistryPath = path.join(root, ".governance", "components.json");
  const sharedPaths = new Set(
    fs.existsSync(sharedRegistryPath)
      ? JSON.parse(fs.readFileSync(sharedRegistryPath, "utf8")).components.map(
          (component) => component.path,
        )
      : [],
  );
  const changedPaths = discoverChangedPaths(root, { base });
  const changes = changedPaths.map((relativePath) => {
    const classification = classifyTarget(root, config, normalizeTarget(root, relativePath));
    return {
      path: relativePath,
      classification,
      profile: profileForClassification(classification, sharedPaths),
    };
  });
  return {
    changedPaths,
    changes,
    profiles: [...new Set(changes.map((change) => change.profile).filter(Boolean))].sort(),
  };
}

export function unionProfileGates(policy, profiles) {
  const gates = [];
  for (const profile of profiles) {
    const selected = policy.changeProfiles?.[profile];
    if (!selected) throw new Error(`Unknown change profile "${profile}".`);
    for (const gate of selected) if (!gates.includes(gate)) gates.push(gate);
  }
  return gates;
}

export function targetMatchesScope(root, target, scope) {
  if (!target) return true;
  const relative = rel(root, normalizeTarget(root, target));
  return scope.changedPaths.includes(relative);
}
