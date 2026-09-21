#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

type WorkspaceConfig = {
  schemaVersion: 1;
  siteRoot: string;
  sitePackage: string;
  productionBranch: string;
  platformVersion: string;
};

type ManifestFile = { path: string; sha256: string; template?: true };
type PlatformManifest = {
  schemaVersion: 1;
  platformVersion: string;
  digest: string;
  ownedRoots: string[];
  excludedPaths: string[];
  templatePaths: string[];
  files: ManifestFile[];
};

const MANIFEST_FILE = "foundation.platform.json";
const OWNED_ROOTS = [
  ".skills",
  "packages/astro-foundation",
  "packages/eslint-plugin-astro-foundation",
  "packages/create-astro-foundation",
  "scripts/design",
  "scripts/governance",
  "scripts/lib",
  "scripts/tests",
];
const OWNED_FILES = [
  ".design/config.schema.json",
  ".design/system.schema.json",
  ".governance/policy.json",
  ".governance/review-evidence.schema.json",
  ".github/workflows/deep-checks.yml",
  ".github/workflows/quality.yml",
  ".github/workflows/release.yml",
  "scripts/content-sync-digests.ts",
  "scripts/content-validate.ts",
  "scripts/generate-redirects.ts",
  "scripts/og-generate.ts",
  "scripts/parse-waivers.ts",
  "scripts/routes-validate.ts",
  "scripts/secret-scan.ts",
  "scripts/seo-validate.ts",
  "scripts/theme-sync.ts",
  "scripts/theme-validate.ts",
  "scripts/types-generate.ts",
  "scripts/workspace-validate.mjs",
];
const EXCLUDED_PATHS = [
  ".skills/skills-manifest.json",
  "packages/astro-foundation/src/generated/types.ts",
];
const TEMPLATE_PATHS = [
  ".github/workflows/deep-checks.yml",
  ".github/workflows/quality.yml",
  ".github/workflows/release.yml",
];

function repositoryRoot(start = process.cwd()): string {
  let current = path.resolve(start);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, "foundation.workspace.json"))) return current;
    current = path.dirname(current);
  }
  throw new Error("Cannot find repository root containing foundation.workspace.json");
}

function readWorkspace(root: string): WorkspaceConfig {
  const file = path.join(root, "foundation.workspace.json");
  if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
  const value = JSON.parse(fs.readFileSync(file, "utf8")) as WorkspaceConfig;
  for (const key of ["siteRoot", "sitePackage", "productionBranch", "platformVersion"] as const) {
    if (typeof value[key] !== "string" || !value[key]) {
      throw new Error(`foundation.workspace.json requires ${key}`);
    }
  }
  return value;
}

function sha256(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeTemplate(value: string, workspace: WorkspaceConfig): string {
  return value
    .replaceAll(workspace.siteRoot, "{{siteRoot}}")
    .replaceAll(workspace.sitePackage, "{{sitePackage}}")
    .replaceAll(workspace.productionBranch, "{{productionBranch}}");
}

function renderTemplate(value: string, workspace: WorkspaceConfig): string {
  return value
    .replaceAll("{{siteRoot}}", workspace.siteRoot)
    .replaceAll("{{sitePackage}}", workspace.sitePackage)
    .replaceAll("{{productionBranch}}", workspace.productionBranch);
}

function isExcluded(relativePath: string): boolean {
  return (
    EXCLUDED_PATHS.includes(relativePath) ||
    relativePath.split("/").some((part) => part === "node_modules" || part === ".cache")
  );
}

function walk(root: string, relativeRoot: string): string[] {
  const absolute = path.join(root, relativeRoot);
  if (!fs.existsSync(absolute)) return [];
  const result: string[] = [];
  const visit = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const absoluteEntry = path.join(current, entry.name);
      const relative = path.relative(root, absoluteEntry).split(path.sep).join("/");
      if (isExcluded(relative)) continue;
      if (entry.isDirectory()) visit(absoluteEntry);
      else if (entry.isFile()) result.push(relative);
    }
  };
  visit(absolute);
  return result;
}

function inventory(root: string): string[] {
  const paths = [
    ...OWNED_ROOTS.flatMap((ownedRoot) => walk(root, ownedRoot)),
    ...OWNED_FILES.filter((file) => fs.existsSync(path.join(root, file))),
  ];
  return [...new Set(paths)].filter((file) => !isExcluded(file)).sort();
}

function buildManifest(root: string): PlatformManifest {
  const workspace = readWorkspace(root);
  const files = inventory(root).map((relativePath): ManifestFile => {
    const raw = fs.readFileSync(path.join(root, relativePath));
    const template = TEMPLATE_PATHS.includes(relativePath);
    const value = template ? normalizeTemplate(raw.toString("utf8"), workspace) : raw;
    return { path: relativePath, sha256: sha256(value), ...(template ? { template: true } : {}) };
  });
  const digest = sha256(JSON.stringify({ platformVersion: workspace.platformVersion, files }));
  return {
    schemaVersion: 1,
    platformVersion: workspace.platformVersion,
    digest,
    ownedRoots: OWNED_ROOTS,
    excludedPaths: EXCLUDED_PATHS,
    templatePaths: TEMPLATE_PATHS,
    files,
  };
}

function readManifest(root: string): PlatformManifest {
  const file = path.join(root, MANIFEST_FILE);
  if (!fs.existsSync(file)) throw new Error(`Missing ${MANIFEST_FILE}; run foundation:manifest --write`);
  const manifest = JSON.parse(fs.readFileSync(file, "utf8")) as PlatformManifest;
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.files)) {
    throw new Error(`${MANIFEST_FILE} has an unsupported schema`);
  }
  return manifest;
}

function compareManifest(root: string, expected: PlatformManifest): string[] {
  const actual = buildManifest(root);
  const issues: string[] = [];
  const workspace = readWorkspace(root);
  if (expected.platformVersion !== workspace.platformVersion) {
    issues.push(`platform version mismatch: workspace=${workspace.platformVersion}, manifest=${expected.platformVersion}`);
  }
  const expectedByPath = new Map(expected.files.map((file) => [file.path, file]));
  const actualByPath = new Map(actual.files.map((file) => [file.path, file]));
  for (const file of expected.files) {
    const candidate = actualByPath.get(file.path);
    if (!candidate) issues.push(`missing: ${file.path}`);
    else if (candidate.sha256 !== file.sha256) issues.push(`changed: ${file.path}`);
  }
  for (const file of actual.files) {
    if (!expectedByPath.has(file.path)) issues.push(`unexpected platform-owned file: ${file.path}`);
  }
  const expectedDigest = sha256(JSON.stringify({ platformVersion: expected.platformVersion, files: expected.files }));
  if (expected.digest !== expectedDigest) issues.push("manifest digest is invalid");
  return issues;
}

function printChanges(label: string, version: string, changes: string[]) {
  console.log(`${label} platform ${version}: ${changes.length ? `${changes.length} change(s)` : "current"}`);
  for (const change of changes) console.log(`  ${change}`);
}

function manifestCommand(root: string, args: string[]) {
  const write = args.includes("--write");
  const generated = buildManifest(root);
  if (write) {
    fs.writeFileSync(path.join(root, MANIFEST_FILE), `${JSON.stringify(generated, null, 2)}\n`);
    printChanges("Manifested", generated.platformVersion, generated.files.map((file) => file.path));
    console.log(`Digest: ${generated.digest}`);
    return;
  }
  const expected = readManifest(root);
  const issues = compareManifest(root, expected);
  printChanges("Checked", expected.platformVersion, issues);
  console.log(`Digest: ${expected.digest}`);
  if (issues.length) process.exitCode = 1;
}

function syncCommand(root: string, args: string[]) {
  const check = args.includes("--check");
  const write = args.includes("--write");
  const sourceIndex = args.indexOf("--source");
  const sourceArg = sourceIndex === -1 ? null : args[sourceIndex + 1];
  if (sourceIndex !== -1 && (!sourceArg || sourceArg.startsWith("--"))) {
    throw new Error("--source requires a repository path");
  }
  if (!sourceArg) {
    const manifest = readManifest(root);
    const issues = compareManifest(root, manifest);
    printChanges(check ? "Checked" : "Dry run", manifest.platformVersion, issues);
    console.log(`Digest: ${manifest.digest}`);
    if (issues.length) process.exitCode = 1;
    return;
  }
  const source = repositoryRoot(path.resolve(root, sourceArg));
  const sourceManifest = readManifest(source);
  const sourceIssues = compareManifest(source, sourceManifest);
  if (sourceIssues.length) throw new Error(`Source platform is not current:\n${sourceIssues.join("\n")}`);
  const targetWorkspace = readWorkspace(root);
  const sourceWorkspace = readWorkspace(source);
  const changes: string[] = [];
  for (const entry of sourceManifest.files) {
    const sourceFile = path.join(source, entry.path);
    let content = fs.readFileSync(sourceFile);
    if (entry.template) {
      const normalized = normalizeTemplate(content.toString("utf8"), sourceWorkspace);
      content = Buffer.from(renderTemplate(normalized, targetWorkspace));
    }
    const targetFile = path.join(root, entry.path);
    const current = fs.existsSync(targetFile) ? fs.readFileSync(targetFile) : null;
    if (!current || !current.equals(content)) {
      changes.push(`${fs.existsSync(targetFile) ? "update" : "create"}: ${entry.path}`);
      if (write && !check) {
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        fs.writeFileSync(targetFile, content);
      }
    }
  }
  printChanges(write && !check ? "Synced" : "Dry run", sourceManifest.platformVersion, changes);
  console.log(`Digest: ${sourceManifest.digest}`);
  if (check && changes.length) process.exitCode = 1;
  if (write && !check) {
    const renderedManifest = buildManifest(root);
    fs.writeFileSync(path.join(root, MANIFEST_FILE), `${JSON.stringify(renderedManifest, null, 2)}\n`);
  }
}

function help() {
  console.log(`create-astro-foundation platform commands:
  manifest --write      Regenerate ${MANIFEST_FILE} from platform-owned files
  manifest --check      Check the local platform manifest (default)
  sync --check          Read-only local drift check
  sync --source <repo>  Dry-run synchronization from another checked repository
  sync --source <repo> --write  Update only manifest-owned files`);
}

try {
  const root = repositoryRoot(path.dirname(fileURLToPath(import.meta.url)));
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "--help" || command === "help") help();
  else if (command === "manifest") manifestCommand(root, args);
  else if (command === "sync") syncCommand(root, args);
  else throw new Error(`Unknown command: ${command}`);
} catch (error) {
  console.error(`[create-astro-foundation] ${(error as Error).message}`);
  process.exit(1);
}
