#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  collectImplementationFiles,
  findRepoRoot,
  listComponents,
  loadConfig,
  parseLocalImports,
  rel,
  discoverSurfaces,
  writeJson,
} from "../design/lib.mjs";

export function buildComponentRegistry(root, config) {
  const componentFiles = listComponents(root, config);
  const implementationFiles = collectImplementationFiles(root, config);
  const importsByFile = new Map(
    implementationFiles.map((file) => [
      file,
      parseLocalImports(file).map((imported) => path.resolve(imported)),
    ]),
  );
  const reverseImports = new Map();
  for (const [consumer, imports] of importsByFile) {
    for (const imported of imports) {
      const key = path.resolve(imported);
      if (!reverseImports.has(key)) reverseImports.set(key, new Set());
      reverseImports.get(key).add(consumer);
    }
  }
  const allConsumers = (componentPath) => {
    const found = new Set();
    const queue = [...(reverseImports.get(componentPath) ?? [])];
    while (queue.length) {
      const consumer = queue.shift();
      if (found.has(consumer)) continue;
      found.add(consumer);
      for (const parent of reverseImports.get(consumer) ?? []) queue.push(parent);
    }
    return [...found].sort();
  };
  const components = [];
  for (const name of [...config.sharedComponents].sort()) {
    const matches = componentFiles.filter(
      (file) => path.basename(file, path.extname(file)) === name,
    );
    if (matches.length !== 1)
      throw new Error(
        `Shared component "${name}" resolves to ${matches.length} files; expected exactly one.`,
      );
    const componentPath = path.resolve(root, matches[0]);
    const directConsumers = implementationFiles
      .filter((file) => importsByFile.get(file)?.includes(componentPath))
      .map((file) => rel(root, file))
      .sort();
    const consumers = allConsumers(componentPath).map((file) => rel(root, file));
    const surfaces = [
      ...new Set(consumers.flatMap((consumer) => discoverSurfaces(root, config, consumer))),
    ].sort();
    components.push({ name, path: matches[0], directConsumers, consumers, surfaces });
  }
  return { schemaVersion: 1, components };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const root = findRepoRoot();
    const config = loadConfig(root);
    const registry = buildComponentRegistry(root, config);
    const output = path.join(root, ".governance/components.json");
    if (process.argv.includes("--check")) {
      const current = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, "utf8")) : null;
      if (JSON.stringify(current) !== JSON.stringify(registry))
        throw new Error("Component registry is missing or stale. Run: pnpm components:sync");
      console.log(`Component registry: current (${registry.components.length} shared components).`);
    } else {
      writeJson(output, registry);
      console.log(
        `Component registry: wrote ${rel(root, output)} (${registry.components.length} shared components).`,
      );
    }
  } catch (error) {
    console.error(`[components] ${error.message}`);
    process.exit(1);
  }
}
