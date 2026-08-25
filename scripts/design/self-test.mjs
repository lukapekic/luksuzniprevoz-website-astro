#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot, loadConfig, resolveActiveTheme } from "./lib.mjs";

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const required = [
    "AGENTS.md",
    "DESIGN.md",
    ".design/config.json",
    "scripts/design/context.mjs",
    "scripts/design/detect.mjs",
    "scripts/design/doctor.mjs",
    "scripts/design/sync.mjs",
    "scripts/design/hook.mjs"
  ];
  const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
  if (missing.length) throw new Error(`Missing governance files: ${missing.join(", ")}`);
  const active = resolveActiveTheme(root, config);
  console.log(`Design governance self-test: OK. Active manifest: ${active.directory}.`);
} catch (error) {
  console.error(`[design:self-test] ${error.message}`);
  process.exit(1);
}
