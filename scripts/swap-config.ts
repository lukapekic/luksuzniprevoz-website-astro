#!/usr/bin/env tsx
/**
 * swap-config.ts — Switch between minimum and representative foundation configs.
 * FND-META-08: Enables CI to run with different config variants.
 *
 * Usage:
 *   pnpm swap-config minimum   — swap to 2-locale, 3-route config
 *   pnpm swap-config full      — swap to 3-locale, 8-route config (default)
 */

import { copyFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const refSiteDir = resolve(__dirname, "../examples/reference-site");

const configPath = resolve(refSiteDir, "foundation.config.ts");
const minimumConfigPath = resolve(refSiteDir, "foundation.config.minimum.ts");
const fullConfigPath = resolve(refSiteDir, "foundation.config.full.ts");

function swapTo(target: "minimum" | "full") {
  const source = target === "minimum" ? minimumConfigPath : fullConfigPath;

  if (!existsSync(source)) {
    console.error(`Config file not found: ${source}`);
    process.exit(1);
  }

  // Back up current config
  copyFileSync(configPath, `${configPath}.bak`);

  // Copy target config
  copyFileSync(source, configPath);

  console.log(`Swapped to ${target} config (${source})`);
}

const target = process.argv[2] as "minimum" | "full";
if (!target || (target !== "minimum" && target !== "full")) {
  console.error("Usage: tsx scripts/swap-config.ts [minimum|full]");
  process.exit(1);
}

swapTo(target);
