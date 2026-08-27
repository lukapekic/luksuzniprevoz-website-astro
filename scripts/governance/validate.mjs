#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, loadConfig, loadSystem } from "../design/lib.mjs";

function fail(message) {
  throw new Error(message);
}

try {
  const root = findRepoRoot();
  loadConfig(root);
  loadSystem(root);
  const policy = JSON.parse(fs.readFileSync(path.join(root, ".governance/policy.json"), "utf8"));
  const viewports = JSON.parse(
    fs.readFileSync(path.join(root, ".governance/viewports.json"), "utf8"),
  );
  const rules = JSON.parse(fs.readFileSync(path.join(root, ".governance/rules.json"), "utf8"));
  if (policy.schemaVersion !== 1 || viewports.schemaVersion !== 1 || rules.schemaVersion !== 1)
    fail("Unsupported governance schema version.");
  if (JSON.stringify(policy.blockingSeverities) !== JSON.stringify(["P0", "P1"]))
    fail("P0 and P1 must remain blocking severities.");
  const requiredProfiles = [
    "small-ui",
    "page",
    "component",
    "theme",
    "routing-content",
    "foundation",
  ];
  for (const profile of requiredProfiles) {
    if (
      !Array.isArray(policy.changeProfiles?.[profile]) ||
      policy.changeProfiles[profile].length === 0
    )
      fail(`Missing change profile: ${profile}`);
  }
  const widths = viewports.viewports?.map((viewport) => viewport.width);
  if (JSON.stringify(widths) !== JSON.stringify([320, 768, 1024, 1440, 1920]))
    fail("Responsive viewport contract must be exactly 320, 768, 1024, 1440, 1920.");
  const requiredAssertions = [
    "topology",
    "content-order",
    "width-constraints",
    "image-behavior",
    "cta-placement",
    "horizontal-overflow",
    "keyboard-focus-order",
    "minimum-target-size",
  ];
  for (const assertion of requiredAssertions) {
    if (!viewports.requiredAssertions?.includes(assertion))
      fail(`Missing responsive assertion: ${assertion}`);
  }
  for (const [family, contract] of Object.entries(rules.families ?? {})) {
    if (
      !/^[A-Z0-9]+$/.test(family) ||
      !["P0", "P1", "P2", "P3"].includes(contract.severity) ||
      !contract.owner
    )
      fail(`Invalid rule-family contract: ${family}`);
  }
  for (const rule of [...(rules.automationRequired ?? []), ...(rules.nonWaivable ?? [])]) {
    const family = rule.match(/^FND-([A-Z0-9]+)-\d+$/)?.[1];
    if (!family || !rules.families[family]) fail(`Registered rule has no family contract: ${rule}`);
  }
  console.log(
    `Governance contracts: valid (${requiredProfiles.length} change profiles, ${widths.length} viewport states, ${Object.keys(rules.families).length} rule families).`,
  );
} catch (error) {
  console.error(`[governance:validate] ${error.message}`);
  process.exit(1);
}
