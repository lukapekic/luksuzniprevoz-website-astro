#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, loadConfig } from "../design/lib.mjs";

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const indexPath = path.join(root, ".governance/contracts.json");
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  if (index.schemaVersion !== 1 || !Array.isArray(index.contracts))
    throw new Error("Contract index has an unsupported schema or missing contracts array.");
  const ids = new Set();
  const states = new Set(["documented", "approved", "superseded"]);
  const requiredStates = new Set([
    "mobile",
    "tablet-portrait",
    "tablet-landscape",
    "desktop",
    "wide-desktop",
  ]);
  for (const contract of index.contracts) {
    for (const key of ["id", "surface", "source", "state", "revision"]) {
      if (typeof contract[key] !== "string" || !contract[key])
        throw new Error(`Contract has no valid ${key}.`);
    }
    if (ids.has(contract.id)) throw new Error(`Duplicate contract id ${contract.id}.`);
    ids.add(contract.id);
    if (!config.surfaceMap[contract.surface])
      throw new Error(`Contract ${contract.id} references unknown surface ${contract.surface}.`);
    if (!states.has(contract.state)) throw new Error(`Contract ${contract.id} has invalid state.`);
    if (!fs.existsSync(path.join(root, contract.source)))
      throw new Error(`Contract ${contract.id} source does not exist: ${contract.source}`);
    for (const key of ["regions", "ctaRoles", "typeRoles", "responsiveStates", "acceptanceTests"]) {
      if (!Array.isArray(contract[key]) || contract[key].length === 0)
        throw new Error(`Contract ${contract.id} requires non-empty ${key}.`);
    }
    if (new Set(contract.responsiveStates).size !== contract.responsiveStates.length)
      throw new Error(`Contract ${contract.id} has duplicate responsive states.`);
    for (const state of requiredStates)
      if (!contract.responsiveStates.includes(state))
        throw new Error(`Contract ${contract.id} is missing required state ${state}.`);
    for (const test of contract.acceptanceTests)
      if (!fs.existsSync(path.join(root, test)))
        throw new Error(`Contract ${contract.id} acceptance test does not exist: ${test}`);
  }
  console.log(`Contracts: valid (${index.contracts.length} indexed contracts).`);
} catch (error) {
  console.error(`[contracts:validate] ${error.message}`);
  process.exit(1);
}
