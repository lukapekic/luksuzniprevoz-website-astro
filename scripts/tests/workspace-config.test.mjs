import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { loadWorkspaceConfig } from "../lib/workspace-config.mjs";

function fixture({ siteRoot = "site/product", sitePackage = "@example/site", redirects } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "foundation-workspace-"));
  fs.mkdirSync(path.join(root, siteRoot), { recursive: true });
  fs.writeFileSync(path.join(root, siteRoot, "package.json"), JSON.stringify({ name: sitePackage }));
  fs.writeFileSync(
    path.join(root, "foundation.workspace.json"),
    JSON.stringify({
      schemaVersion: 1,
      siteRoot,
      sitePackage,
      productionBranch: "master",
      platformVersion: "1.0.0",
      redirects: redirects ?? { enabled: true, format: "cloudflare" },
    }),
  );
  return root;
}

test("accepts enabled nested-route workspace and keeps theme selection site-local", () => {
  const root = fixture();
  fs.writeFileSync(path.join(root, "site/product/foundation.config.ts"), 'export default { activeThemeVersion: "version-3" };\n');
  const config = loadWorkspaceConfig(root, { checkBranch: false });
  assert.equal(config.redirects.format, "cloudflare");
  assert.equal("activeThemeVersion" in config, false);
});

test("accepts a workspace with redirects disabled", () => {
  const config = loadWorkspaceConfig(fixture({ redirects: { enabled: false } }), {
    checkBranch: false,
  });
  assert.equal(config.redirects.enabled, false);
});

test("rejects a missing siteRoot", () => {
  const root = fixture();
  const config = JSON.parse(fs.readFileSync(path.join(root, "foundation.workspace.json")));
  config.siteRoot = "site/missing";
  fs.writeFileSync(path.join(root, "foundation.workspace.json"), JSON.stringify(config));
  assert.throws(() => loadWorkspaceConfig(root, { checkBranch: false }), /siteRoot does not exist/);
});

test("rejects a mismatched sitePackage", () => {
  const root = fixture();
  const config = JSON.parse(fs.readFileSync(path.join(root, "foundation.workspace.json")));
  config.sitePackage = "@wrong/site";
  fs.writeFileSync(path.join(root, "foundation.workspace.json"), JSON.stringify(config));
  assert.throws(() => loadWorkspaceConfig(root, { checkBranch: false }), /does not match/);
});

test("rejects a nonexistent production branch when branch validation is enabled", () => {
  const root = fixture();
  execFileSync("git", ["init", "-q"], { cwd: root });
  assert.throws(() => loadWorkspaceConfig(root), /productionBranch does not exist/);
});
