#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const UI_EXTENSIONS = new Set([".astro", ".css", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
export const DOC_EXTENSIONS = new Set([".md", ".html"]);

export function findRepoRoot(start = process.cwd()) {
  let dir = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json")) && fs.existsSync(path.join(dir, "AGENTS.md"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error("Could not find repository root (package.json + AGENTS.md).");
    dir = parent;
  }
}

export function toPosix(value) {
  return value.split(path.sep).join("/");
}

export function rel(root, absolute) {
  return toPosix(path.relative(root, absolute));
}

export function exists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

export function readText(filePath, fallback = "") {
  try { return fs.readFileSync(filePath, "utf8"); } catch { return fallback; }
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function loadConfig(root) {
  const configPath = path.join(root, ".design", "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing ${rel(root, configPath)}. Copy the design-governance package first.`);
  }
  return readJson(configPath);
}

export function walkFiles(base, { extensions = null, ignore = [] } = {}) {
  if (!fs.existsSync(base)) return [];
  const out = [];
  const stack = [base];
  while (stack.length) {
    const current = stack.pop();
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(current).sort().reverse();
      for (const entry of entries) {
        const full = path.join(current, entry);
        const normalized = toPosix(full);
        if (ignore.some((part) => normalized.includes(part))) continue;
        stack.push(full);
      }
      continue;
    }
    if (!extensions || extensions.has(path.extname(current))) out.push(current);
  }
  return out.sort();
}


export function maskCommentsPreserveLines(text) {
  const mask = (segment) => segment.replace(/[^\n]/g, " ");
  return text
    .replace(/\/\*[\s\S]*?\*\//g, mask)
    .replace(/<!--[\s\S]*?-->/g, mask)
    .replace(/(^|[^:])\/\/[^\n]*/g, (match, prefix) => prefix + mask(match.slice(prefix.length)));
}

export function insideSvgBlock(text, index) {
  const open = text.lastIndexOf("<svg", index);
  const close = text.lastIndexOf("</svg>", index);
  return open > close;
}

export function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

export function isUnder(root, filePath, roots = []) {
  const absolute = path.resolve(filePath);
  return roots.some((relativeRoot) => {
    const base = path.resolve(root, relativeRoot);
    return absolute === base || absolute.startsWith(base + path.sep);
  });
}

export function isAllowedLegacyPath(root, config, filePath) {
  return isUnder(root, filePath, config.legacyAllowedRoots || []);
}

export function isGeneratedPath(root, config, filePath) {
  return isUnder(root, filePath, config.generatedAllowedRoots || []);
}

export function resolveActiveTheme(root, config) {
  const versionsDir = path.join(root, config.theme.versionsDir);
  if (!fs.existsSync(versionsDir)) throw new Error(`Theme versions directory not found: ${config.theme.versionsDir}`);
  const candidates = [];
  for (const entry of fs.readdirSync(versionsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(versionsDir, entry.name, "manifest.json");
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = readJson(manifestPath);
    if (manifest.status === config.theme.activeManifestStatus) {
      candidates.push({ directory: entry.name, manifest, manifestPath, dir: path.dirname(manifestPath) });
    }
  }
  if (candidates.length !== 1) {
    throw new Error(`Expected exactly one theme manifest with status "${config.theme.activeManifestStatus}", found ${candidates.length}.`);
  }
  return candidates[0];
}

export function themeSourceFiles(active) {
  const names = ["manifest.json", "palette.json", "typography.json", "spacing.json", "radii.json", "layout.json", "motion.json"];
  return names.map((name) => path.join(active.dir, name)).filter((file) => fs.existsSync(file));
}

export function hashFiles(files) {
  const hash = crypto.createHash("sha256");
  for (const file of [...files].sort()) {
    hash.update(toPosix(file));
    hash.update("\0");
    hash.update(fs.readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}

export function parseCssVariables(css) {
  const vars = {};
  const re = /(--[a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = re.exec(css))) vars[match[1]] = match[2].trim();
  return vars;
}

export function listComponents(root, config) {
  const componentRoots = [
    path.join(root, config.siteRoot, "src/components"),
    path.join(root, config.siteRoot, "src/foundation/ui")
  ];
  const result = [];
  for (const base of componentRoots) {
    for (const file of walkFiles(base, { extensions: new Set([".astro", ".ts"]) })) {
      if (file.endsWith(".types.ts") || file.endsWith(".variants.ts")) continue;
      result.push(rel(root, file));
    }
  }
  return result.sort();
}

export function listDocs(root, config) {
  const result = [];
  for (const baseRel of config.docsRoots || []) {
    const base = path.join(root, baseRel);
    for (const file of walkFiles(base, { extensions: DOC_EXTENSIONS })) result.push(rel(root, file));
  }
  return result.sort();
}

export function listDataModules(root, config) {
  const base = path.join(root, config.dataRoot || "");
  if (!fs.existsSync(base)) return [];
  return walkFiles(base, { extensions: new Set([".ts", ".json"]) }).map((f) => rel(root, f)).sort();
}

export function buildSystemSnapshot(root, config) {
  const active = resolveActiveTheme(root, config);
  const sourceFiles = themeSourceFiles(active);
  const generatedCssPath = path.join(root, config.theme.generatedCss);
  if (fs.existsSync(generatedCssPath)) sourceFiles.push(generatedCssPath);

  const tokenFiles = {};
  for (const name of ["palette", "typography", "spacing", "radii", "layout", "motion"]) {
    const file = path.join(active.dir, `${name}.json`);
    tokenFiles[name] = fs.existsSync(file) ? readJson(file) : {};
  }

  const css = readText(generatedCssPath);
  const inventory = {
    components: listComponents(root, config),
    docs: listDocs(root, config),
    dataModules: listDataModules(root, config)
  };
  const baseHash = hashFiles(sourceFiles);
  const inventoryHash = crypto.createHash("sha256")
    .update(baseHash)
    .update("\0")
    .update(JSON.stringify(inventory))
    .digest("hex");

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceHash: inventoryHash,
    theme: {
      directory: active.directory,
      version: String(active.manifest.themeVersion ?? active.directory.replace(/^version-/, "")),
      name: active.manifest.name ?? active.directory,
      status: active.manifest.status,
      description: active.manifest.description ?? ""
    },
    tokens: tokenFiles,
    cssVariables: parseCssVariables(css),
    inventory
  };
}

export function collectImplementationFiles(root, config) {
  const files = [];
  for (const baseRel of config.productionUiRoots || []) {
    const base = path.join(root, baseRel);
    files.push(...walkFiles(base, { extensions: UI_EXTENSIONS }));
  }
  return [...new Set(files)].sort();
}

export function collectDocumentationFiles(root, config) {
  const files = [];
  for (const baseRel of config.docsRoots || []) {
    files.push(...walkFiles(path.join(root, baseRel), { extensions: DOC_EXTENSIONS }));
  }
  return [...new Set(files)].sort();
}

export function normalizeTarget(root, target) {
  if (!target) return null;
  const absolute = path.isAbsolute(target) ? target : path.resolve(root, target);
  return absolute;
}

export function targetFiles(root, config, target) {
  const absolute = normalizeTarget(root, target);
  if (!absolute) return collectImplementationFiles(root, config);
  if (!fs.existsSync(absolute)) throw new Error(`Target does not exist: ${rel(root, absolute)}`);
  const stat = fs.statSync(absolute);
  if (stat.isDirectory()) return walkFiles(absolute, { extensions: UI_EXTENSIONS });
  return [absolute];
}

export function makeFinding({ ruleId, severity = "P2", file, line = 1, message, recommendation = "" }) {
  return { ruleId, severity, file, line, message, recommendation };
}

export function formatFinding(finding) {
  const location = `${finding.file}:${finding.line}`;
  const suffix = finding.recommendation ? `\n  → ${finding.recommendation}` : "";
  return `[${finding.severity}] ${finding.ruleId} ${location}\n  ${finding.message}${suffix}`;
}

export function severityRank(value) {
  return { P0: 0, P1: 1, P2: 2, P3: 3 }[value] ?? 9;
}

export function sortFindings(findings) {
  return findings.sort((a, b) =>
    severityRank(a.severity) - severityRank(b.severity) ||
    a.file.localeCompare(b.file) ||
    a.line - b.line ||
    a.ruleId.localeCompare(b.ruleId)
  );
}

export function discoverSurface(root, config, target) {
  if (!target) return null;
  const relative = rel(root, normalizeTarget(root, target)).toLowerCase();
  for (const [name, info] of Object.entries(config.surfaceMap || {})) {
    if ((info.match || []).some((needle) => relative.includes(needle.toLowerCase()))) return name;
  }
  return null;
}

export function firstExisting(root, candidates = []) {
  for (const relativePath of candidates) {
    if (fs.existsSync(path.join(root, relativePath))) return relativePath;
  }
  return null;
}

export function existingPaths(root, candidates = []) {
  return candidates.filter((relativePath) => fs.existsSync(path.join(root, relativePath)));
}

export function parseLocalImports(filePath) {
  const text = readText(filePath);
  const imports = [];
  const re = /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(text))) {
    const spec = match[1];
    if (!spec.startsWith(".")) continue;
    const base = path.resolve(path.dirname(filePath), spec);
    const candidates = [
      base,
      `${base}.astro`,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      path.join(base, "index.ts"),
      path.join(base, "index.astro")
    ];
    const hit = candidates.find((candidate) => fs.existsSync(candidate));
    if (hit) imports.push(hit);
  }
  return [...new Set(imports)];
}

export function loadSystem(root) {
  const file = path.join(root, ".design", "system.json");
  return fs.existsSync(file) ? readJson(file) : null;
}

export function snapshotIsCurrent(root, config, system = loadSystem(root)) {
  if (!system) return false;
  const fresh = buildSystemSnapshot(root, config);
  return system.sourceHash === fresh.sourceHash;
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

export function getScriptDir() {
  return path.dirname(fileURLToPath(import.meta.url));
}
