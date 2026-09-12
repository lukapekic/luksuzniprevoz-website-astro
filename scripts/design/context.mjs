#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  buildSystemSnapshot,
  existingPaths,
  findRepoRoot,
  loadConfig,
  loadSystem,
  normalizeTarget,
  parseLocalImports,
  parseDesignArgs,
  rel,
  resolveActiveTheme,
  snapshotIsCurrent,
  resolveSurface,
} from "./lib.mjs";

const argv = process.argv.slice(2);
const jsonMode = argv.includes("--json");

try {
  const parsed = parseDesignArgs(argv);
  const root = findRepoRoot();
  const config = loadConfig(root);
  const target = parsed.target ? normalizeTarget(root, parsed.target) : null;
  const targetExists = target ? fs.existsSync(target) : false;
  if (target && !targetExists && !parsed.planned)
    throw new Error(`Target does not exist: ${rel(root, target)}`);
  const active = resolveActiveTheme(root, config);
  const surface = resolveSurface(root, config, {
    target,
    surface: parsed.surface,
    required: Boolean(target),
  });
  const surfaceInfo = surface ? config.surfaceMap?.[surface] : null;
  const system = loadSystem(root);
  const systemCurrent = snapshotIsCurrent(root, config, system);

  const authorities = [
    "AGENTS.md",
    "DESIGN.md",
    ".design/config.json",
    ".design/system.json",
    `${config.theme.versionsDir}/${active.directory}/manifest.json`,
    config.theme.generatedCss,
  ].filter((p) => fs.existsSync(path.join(root, p)));

  const blueprints = surfaceInfo ? existingPaths(root, surfaceInfo.blueprints || []) : [];
  const contracts = [];
  for (const candidate of surfaceInfo?.contracts || []) {
    const full = path.join(root, candidate);
    if (!fs.existsSync(full)) continue;
    if (fs.statSync(full).isDirectory()) {
      for (const name of fs.readdirSync(full).sort()) {
        const relative = `${candidate}/${name}`;
        if (/\.(md|html)$/i.test(name)) contracts.push(relative);
      }
    } else contracts.push(candidate);
  }

  const directImports = [];
  if (target && targetExists && fs.statSync(target).isFile()) {
    for (const imported of parseLocalImports(target)) directImports.push(rel(root, imported));
  }

  const dataModules =
    system?.inventory?.dataModules ?? buildSystemSnapshot(root, config).inventory.dataModules;
  const relevantData = dataModules.filter((file) => {
    if (!surface) return true;
    if (surface === "home")
      return /(services|fleet|reviews|operations|contact|business|navigation)\.(ts|json)$/.test(
        file,
      );
    if (surface === "private-chauffeur")
      return /(pricing|fleet|services|operations|contact)\.(ts|json)$/.test(file);
    if (surface === "airport-transportation")
      return /(pricing|fleet|services|operations|contact)\.(ts|json)$/.test(file);
    if (surface === "business-transportation")
      return /(clients|business|fleet|services|operations|contact)\.(ts|json)$/.test(file);
    if (surface === "corporate-transportation")
      return /(fleet|services|operations|contact|flows)\.(ts|json)$/.test(file);
    if (surface === "delegation-transportation")
      return /(clients|client-media|fleet|services|operations|contact|flows)\.(ts|json)$/.test(
        file,
      );
    return true;
  });

  const payload = {
    project: config.project,
    repoRoot: root,
    target: target ? rel(root, target) : null,
    targetStatus: target ? (targetExists ? "existing" : "planned") : null,
    surface,
    activeTheme: {
      directory: active.directory,
      name: active.manifest.name,
      version: String(active.manifest.themeVersion ?? ""),
      status: active.manifest.status,
    },
    designSnapshot: {
      path: ".design/system.json",
      exists: Boolean(system),
      current: systemCurrent,
    },
    authorityOrder: [
      "Locked page blueprint",
      "DESIGN.md",
      "Active theme + generated semantic tokens",
      "Reviewed shared component contract",
      "Wireframe geometry",
    ],
    technicalAuthority: "AGENTS.md",
    authorities,
    blueprints,
    contracts,
    directImports,
    relevantData,
    requiredPreflight: [
      "Read AGENTS.md and DESIGN.md.",
      "Read the locked blueprint when one exists.",
      "Read only the shared/component contracts relevant to the target.",
      "Treat the wireframe as geometry/topology, never as a source of raw visual values.",
      "Use semantic theme tokens; do not invent a second style layer.",
    ],
    warnings: [
      ...(!system ? ["Missing .design/system.json — run pnpm design:sync."] : []),
      ...(system && !systemCurrent ? ["Stale .design/system.json — run pnpm design:sync."] : []),
      ...(target && !targetExists
        ? [
            "Planned target has no imports yet — rerun design:context after scaffolding and before substantive UI editing.",
          ]
        : []),
      ...(surface && surfaceInfo?.blueprintRequired !== false && blueprints.length === 0
        ? [`No installed blueprint discovered for surface "${surface}".`]
        : []),
    ],
  };

  if (payload.warnings.some((warning) => warning.startsWith("No installed blueprint"))) {
    throw new Error(
      payload.warnings.find((warning) => warning.startsWith("No installed blueprint")),
    );
  }

  if (jsonMode) {
    process.stdout.write(JSON.stringify(payload, null, 2) + "\n");
  } else {
    console.log(`# Design context — ${payload.target ?? "repository"}`);
    console.log(`Project: ${payload.project}`);
    console.log(`Surface: ${surface ?? "not resolved"}`);
    console.log(`Active theme: ${payload.activeTheme.directory} — ${payload.activeTheme.name}`);
    console.log(
      `Design snapshot: ${payload.designSnapshot.exists ? (payload.designSnapshot.current ? "current" : "STALE") : "MISSING"}`,
    );
    console.log("\nAuthority:");
    payload.authorityOrder.forEach((item, index) => console.log(`  ${index + 1}. ${item}`));
    console.log("\nRead:");
    for (const file of [
      ...payload.authorities,
      ...payload.blueprints,
      ...payload.contracts,
      ...payload.directImports,
    ])
      console.log(`  - ${file}`);
    if (payload.relevantData.length) {
      console.log("\nRelevant data:");
      for (const file of payload.relevantData) console.log(`  - ${file}`);
    }
    if (payload.warnings.length) {
      console.log("\nWarnings:");
      for (const warning of payload.warnings) console.log(`  ! ${warning}`);
    }
  }
} catch (error) {
  console.error(`[design:context] ${error.message}`);
  process.exit(1);
}
