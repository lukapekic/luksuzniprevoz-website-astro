#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceConfig } from "./lib/workspace-config.mjs";

try {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const config = loadWorkspaceConfig(root);
  console.log(
    `Workspace: valid (${config.siteRoot}, ${config.sitePackage}, redirects ${config.redirects.enabled ? config.redirects.format : "disabled"}).`,
  );
} catch (error) {
  console.error(`[workspace:validate] ${error.message}`);
  process.exit(1);
}
