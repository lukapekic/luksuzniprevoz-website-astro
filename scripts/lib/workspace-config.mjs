import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

export const WORKSPACE_CONFIG_FILE = "foundation.workspace.json";

export function loadWorkspaceConfig(root, options = {}) {
  const configPath = path.join(root, WORKSPACE_CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing ${WORKSPACE_CONFIG_FILE} at repository root: ${root}`);
  }
  let config;
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid ${WORKSPACE_CONFIG_FILE}: ${error.message}`);
  }
  if (config.schemaVersion !== 1) throw new Error("foundation.workspace.json schemaVersion must be 1");
  for (const field of ["siteRoot", "sitePackage", "productionBranch", "platformVersion"]) {
    if (typeof config[field] !== "string" || !config[field].trim()) {
      throw new Error(`foundation.workspace.json requires non-empty ${field}`);
    }
  }
  if (path.isAbsolute(config.siteRoot) || config.siteRoot.includes("..")) {
    throw new Error("foundation.workspace.json siteRoot must be a repository-relative path");
  }
  const siteRoot = path.resolve(root, config.siteRoot);
  if (!fs.existsSync(siteRoot) || !fs.statSync(siteRoot).isDirectory()) {
    throw new Error(`Configured siteRoot does not exist: ${config.siteRoot}`);
  }
  const sitePackagePath = path.join(siteRoot, "package.json");
  if (!fs.existsSync(sitePackagePath)) {
    throw new Error(`Configured siteRoot has no package.json: ${config.siteRoot}`);
  }
  const sitePackage = JSON.parse(fs.readFileSync(sitePackagePath, "utf8"));
  if (sitePackage.name !== config.sitePackage) {
    throw new Error(
      `Configured sitePackage ${config.sitePackage} does not match ${sitePackage.name ?? "(missing)"}`,
    );
  }
  if (!config.redirects || typeof config.redirects.enabled !== "boolean") {
    throw new Error("foundation.workspace.json redirects.enabled must be boolean");
  }
  if (config.redirects.enabled && config.redirects.format !== "cloudflare") {
    throw new Error('Enabled redirects require format "cloudflare"');
  }
  if (options.checkBranch !== false) {
    try {
      execFileSync(
        "git",
        ["show-ref", "--verify", "--quiet", `refs/heads/${config.productionBranch}`],
        { cwd: root, stdio: "ignore" },
      );
    } catch {
      try {
        execFileSync(
          "git",
          ["show-ref", "--verify", "--quiet", `refs/remotes/origin/${config.productionBranch}`],
          { cwd: root, stdio: "ignore" },
        );
      } catch {
        throw new Error(`Configured productionBranch does not exist locally: ${config.productionBranch}`);
      }
    }
  }
  return Object.freeze({ ...config, siteRootAbsolute: siteRoot });
}

export function resolveWorkspaceProject(root, explicitProject) {
  if (explicitProject) return path.resolve(root, explicitProject);
  return loadWorkspaceConfig(root).siteRootAbsolute;
}
