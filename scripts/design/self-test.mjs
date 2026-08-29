#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { runDetector } from "./detect.mjs";
import {
  collectImplementationFiles,
  findRepoRoot,
  hashFiles,
  diffSnapshotInventory,
  loadConfig,
  loadSystem,
  parseGeneratedCssVariables,
  readText,
  resolveActiveTheme,
  resolveSurface,
  snapshotsMatch,
  targetFiles,
  validateDesignConfig,
} from "./lib.mjs";

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const required = [
    "AGENTS.md",
    "DESIGN.md",
    ".design/config.json",
    ".design/config.schema.json",
    ".design/system.schema.json",
    "scripts/design/context.mjs",
    "scripts/design/detect.mjs",
    "scripts/design/doctor.mjs",
    "scripts/design/sync.mjs",
    "scripts/design/hook.mjs",
  ];
  const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length) throw new Error(`Missing governance files: ${missing.join(", ")}`);
  const active = resolveActiveTheme(root, config);
  const broadFiles = targetFiles(root, config, config.siteRoot);
  const productionFiles = collectImplementationFiles(root, config);
  if (broadFiles.length !== productionFiles.length)
    throw new Error("Broad site target escaped or omitted approved production UI roots.");
  if (
    broadFiles.some((file) => /\/(?:dist|node_modules|test-results|playwright-report)\//.test(file))
  )
    throw new Error("Broad target included ignored build/dependency output.");
  let rejectedUnknownSurface = false;
  try {
    resolveSurface(root, config, { surface: "not-a-surface", required: true });
  } catch {
    rejectedUnknownSurface = true;
  }
  if (!rejectedUnknownSurface) throw new Error("Unknown surface identifiers must be rejected.");
  let rejectedDuplicateConfig = false;
  try {
    validateDesignConfig({
      ...config,
      generatedAllowedRoots: [config.generatedAllowedRoots[0], config.generatedAllowedRoots[0]],
    });
  } catch {
    rejectedDuplicateConfig = true;
  }
  if (!rejectedDuplicateConfig)
    throw new Error("Duplicate design configuration roots must be rejected.");
  const snapshotFixture = {
    generatedAt: "2026-01-01T00:00:00.000Z",
    sourceHash: "same-hash",
    inventory: { components: ["ComponentA.astro"], docs: [], dataModules: [] },
  };
  if (
    !snapshotsMatch(snapshotFixture, {
      ...snapshotFixture,
      generatedAt: "2026-02-01T00:00:00.000Z",
    })
  ) {
    throw new Error("Design snapshot timestamps must not create generated-file drift.");
  }
  const inventoryChanges = diffSnapshotInventory(snapshotFixture, {
    ...snapshotFixture,
    inventory: {
      components: ["ComponentB.astro"],
      docs: ["Blueprint.md"],
      dataModules: [],
    },
  });
  if (
    inventoryChanges.components?.added[0] !== "ComponentB.astro" ||
    inventoryChanges.components?.removed[0] !== "ComponentA.astro" ||
    inventoryChanges.docs?.added[0] !== "Blueprint.md"
  ) {
    throw new Error("Design snapshot inventory drift must identify added and removed paths.");
  }
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), "design-governance-"));
  try {
    const firstRoot = path.join(fixtureDir, "first-root");
    const secondRoot = path.join(fixtureDir, "second-root");
    const relativeFixture = path.join("nested", "fixture.txt");
    const firstFile = path.join(firstRoot, relativeFixture);
    const secondFile = path.join(secondRoot, relativeFixture);
    fs.mkdirSync(path.dirname(firstFile), { recursive: true });
    fs.mkdirSync(path.dirname(secondFile), { recursive: true });
    fs.writeFileSync(firstFile, "identical contents\n");
    fs.writeFileSync(secondFile, "identical contents\n");
    if (hashFiles(firstRoot, [firstFile]) !== hashFiles(secondRoot, [secondFile])) {
      throw new Error("Design snapshot hashes must be independent of repository location.");
    }

    const fixture = path.join(fixtureDir, "BadUi.astro");
    fs.writeFileSync(
      fixture,
      `<div class="bg-slate-500 p-[13px]" onclick="bad()"><a href="/en/manual/">Bad</a></div>\n<style>.bad { color: #fff; margin-left: 1rem; padding: 1.3rem; font-family: Arial; }</style>`,
    );
    const fixtureFindings = await runDetector({
      root,
      config,
      files: [fixture],
      system: loadSystem(root),
    });
    const expectedRules = [
      "a11y/interactive-div",
      "layout/logical-direction",
      "layout/raw-spacing",
      "routing/manual-localized-url",
      "tailwind/non-semantic-utility",
      "theme/raw-design-value",
      "typography/non-semantic-font",
    ];
    for (const ruleId of expectedRules) {
      if (!fixtureFindings.some((finding) => finding.ruleId === ruleId))
        throw new Error(`Adversarial fixture did not trigger ${ruleId}.`);
    }

    const fontFaceFixture = path.join(fixtureDir, "FontFaces.css");
    fs.writeFileSync(
      fontFaceFixture,
      `@font-face { font-family: "Project Font"; src: url("project.woff2") format("woff2"); }`,
    );
    const fontFaceFindings = await runDetector({
      root,
      config,
      files: [fontFaceFixture],
      system: loadSystem(root),
    });
    if (fontFaceFindings.some((finding) => finding.ruleId === "typography/non-semantic-font")) {
      throw new Error("Font source registration must not be treated as production role usage.");
    }
  } finally {
    fs.rmSync(fixtureDir, { recursive: true, force: true });
  }
  const generatedCss = readText(path.join(root, config.theme.generatedCss));
  const variables = parseGeneratedCssVariables(generatedCss);
  if (variables.base["--duration-fast"] === variables.reducedMotion["--duration-fast"]) {
    throw new Error("Generated CSS snapshot parsing collapsed base and reduced-motion variables.");
  }
  console.log(`Design governance self-test: OK. Active manifest: ${active.directory}.`);
} catch (error) {
  console.error(`[design:self-test] ${error.message}`);
  process.exit(1);
}
