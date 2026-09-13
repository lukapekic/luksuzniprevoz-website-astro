#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, loadConfig, normalizeTarget, rel } from "../design/lib.mjs";
import { buildComponentRegistry } from "./components.mjs";

try {
  const args = process.argv.slice(2);
  const index = args.indexOf("--target");
  const value = index >= 0 ? args[index + 1] : null;
  if (!value) throw new Error("--target requires an exact component file.");
  const root = findRepoRoot();
  const config = loadConfig(root);
  const target = normalizeTarget(root, value);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile())
    throw new Error(`Target must be an existing component file: ${rel(root, target)}`);
  const registry = buildComponentRegistry(root, config);
  const shared = registry.components.find(
    (component) => path.resolve(root, component.path) === target,
  );
  if (!shared) {
    const knownComponent = /\.(astro|tsx?)$/i.test(target);
    if (knownComponent && /(?:shared|foundation\/ui|components\/site)\//.test(rel(root, target))) {
      throw new Error(
        `Component ${rel(root, target)} appears shared but is absent from the approved registry. Register it or classify it explicitly before completion.`,
      );
    }
    console.log(`Component impact: ${rel(root, target)} is confirmed page-local.`);
    process.exit(0);
  }
  console.log(
    `Component impact: ${shared.name} has ${shared.directConsumers.length} direct and ${shared.consumers.length} transitive consumer${shared.consumers.length === 1 ? "" : "s"}.`,
  );
  for (const consumer of shared.consumers) console.log(`  - ${consumer}`);
  if (shared.surfaces.length) console.log(`Affected surfaces: ${shared.surfaces.join(", ")}`);
  if (shared.consumers.length === 0)
    throw new Error(
      `Approved shared component ${shared.name} has no discovered consumers; verify whether it is obsolete or the import graph is incomplete.`,
    );
} catch (error) {
  console.error(`[component-impact] ${error.message}`);
  process.exit(1);
}
