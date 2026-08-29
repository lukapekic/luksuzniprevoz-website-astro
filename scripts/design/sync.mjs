#!/usr/bin/env node
import path from "node:path";
import {
  buildSystemSnapshot,
  diffSnapshotInventory,
  findRepoRoot,
  loadConfig,
  loadSystem,
  snapshotsMatch,
  writeJson,
} from "./lib.mjs";

const args = new Set(process.argv.slice(2));
const check = args.has("--check");
const json = args.has("--json");

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const fresh = buildSystemSnapshot(root, config);
  const target = path.join(root, ".design", "system.json");
  let current = null;
  try {
    current = loadSystem(root);
  } catch (error) {
    // A normal sync may repair a malformed/obsolete snapshot. Check mode must
    // remain strict and surface the validation error.
    if (check) throw error;
  }
  const ok = snapshotsMatch(current, fresh);
  const inventoryChanges = diffSnapshotInventory(current, fresh);

  if (check) {
    if (json) {
      process.stdout.write(
        JSON.stringify(
          {
            ok,
            currentHash: current?.sourceHash ?? null,
            expectedHash: fresh.sourceHash,
            theme: fresh.theme,
            inventoryChanges,
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
      printInventoryChanges(inventoryChanges);
    }
    process.exit(ok ? 0 : 1);
  }

  if (ok) {
    if (json) process.stdout.write(JSON.stringify(current, null, 2) + "\n");
    else
      console.log(
        `Design snapshot already current (${fresh.theme.directory}, ${fresh.sourceHash.slice(0, 12)}); no file written.`,
      );
    process.exit(0);
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

function printInventoryChanges(changes) {
  for (const [group, delta] of Object.entries(changes)) {
    for (const file of delta.added) console.error(`  + ${group}: ${file}`);
    for (const file of delta.removed) console.error(`  - ${group}: ${file}`);
  }
  if (Object.keys(changes).length === 0) {
    console.error("  Existing design sources changed; no inventory paths were added or removed.");
  }
}
