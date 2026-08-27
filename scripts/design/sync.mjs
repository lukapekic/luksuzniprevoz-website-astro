#!/usr/bin/env node
import path from "node:path";
import { buildSystemSnapshot, findRepoRoot, loadConfig, loadSystem, writeJson } from "./lib.mjs";

const args = new Set(process.argv.slice(2));
const check = args.has("--check");
const json = args.has("--json");

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const fresh = buildSystemSnapshot(root, config);
  const target = path.join(root, ".design", "system.json");
  const current = check ? loadSystem(root) : null;

  if (check) {
    const ok = Boolean(current && current.sourceHash === fresh.sourceHash);
    if (json) {
      process.stdout.write(
        JSON.stringify(
          {
            ok,
            currentHash: current?.sourceHash ?? null,
            expectedHash: fresh.sourceHash,
            theme: fresh.theme,
          },
          null,
          2,
        ) + "\n",
      );
    } else if (ok) {
      console.log(
        `Design snapshot is current (${fresh.theme.directory}, ${fresh.sourceHash.slice(0, 12)}).`,
      );
    } else {
      console.error("Design snapshot is missing or stale. Run: pnpm design:sync");
    }
    process.exit(ok ? 0 : 1);
  }

  writeJson(target, fresh);
  if (json) process.stdout.write(JSON.stringify(fresh, null, 2) + "\n");
  else
    console.log(
      `Wrote .design/system.json from ${fresh.theme.directory} (${fresh.sourceHash.slice(0, 12)}).`,
    );
} catch (error) {
  console.error(`[design:sync] ${error.message}`);
  process.exit(1);
}
