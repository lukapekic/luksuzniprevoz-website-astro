#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export const UI_EXTENSIONS = new Set([
  ".astro",
  ".css",
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);
export const DOC_EXTENSIONS = new Set([".md", ".html"]);
export const DEFAULT_IGNORED_DIRECTORY_NAMES = new Set([
  ".astro",
  ".git",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "playwright-report",
  "test-results",
]);

export function findRepoRoot(start = process.cwd()) {
  let dir = path.resolve(start);
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json")) && fs.existsSync(path.join(dir, "AGENTS.md")))
      return dir;
    const parent = path.dirname(dir);
    if (parent === dir)
      throw new Error("Could not find repository root (package.json + AGENTS.md).");
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
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return fallback;
  }
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function loadConfig(root) {
  const configPath = path.join(root, ".design", "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing ${rel(root, configPath)}. Copy the design-governance package first.`);
  }
  const config = readJson(configPath);
  validateDesignConfig(config);
  return config;
}

export function validateDesignConfig(config) {
  const requiredStrings = ["project", "siteRoot", "dataRoot", "contentRoot"];
  for (const key of requiredStrings) {
    if (typeof config?.[key] !== "string" || !config[key])
      throw new Error(`.design/config.json requires non-empty "${key}".`);
  }
  if (!config.theme || typeof config.theme !== "object")
    throw new Error('.design/config.json requires "theme".');
  for (const key of ["versionsDir", "generatedCss"]) {
    if (typeof config.theme[key] !== "string" || !config.theme[key])
      throw new Error(`.design/config.json requires theme.${key}.`);
  }
  if (
    !Array.isArray(config.theme.activeThemeSources) ||
    config.theme.activeThemeSources.length !== 1
  ) {
    throw new Error(
      ".design/config.json must declare exactly one site-owned theme.activeThemeSources entry.",
    );
  }
  for (const key of [
    "productionUiRoots",
    "docsRoots",
    "generatedAllowedRoots",
    "legacyAllowedRoots",
  ]) {
    if (!Array.isArray(config[key]))
      throw new Error(`.design/config.json requires array "${key}".`);
    if (new Set(config[key]).size !== config[key].length)
      throw new Error(`.design/config.json contains duplicate entries in "${key}".`);
  }
  if (
    !config.surfaceMap ||
    typeof config.surfaceMap !== "object" ||
    Array.isArray(config.surfaceMap)
  ) {
    throw new Error('.design/config.json requires a "surfaceMap" object.');
  }
  for (const [surface, value] of Object.entries(config.surfaceMap)) {
    if (
      !value ||
      typeof value !== "object" ||
      !Array.isArray(value.match) ||
      value.match.length === 0
    ) {
      throw new Error(`Surface "${surface}" requires at least one match pattern.`);
    }
    if (!Array.isArray(value.blueprints) || !Array.isArray(value.contracts)) {
      throw new Error(`Surface "${surface}" requires blueprints and contracts arrays.`);
    }
  }
}

export function walkFiles(base, { extensions = null, ignore = [] } = {}) {
  if (!fs.existsSync(base)) return [];
  const out = [];
  const stack = [base];
  while (stack.length) {
    const current = stack.pop();
    const stat = fs.lstatSync(current);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) {
      const entries = fs.readdirSync(current).sort().reverse();
      for (const entry of entries) {
        const full = path.join(current, entry);
        const normalized = toPosix(full);
        if (
          DEFAULT_IGNORED_DIRECTORY_NAMES.has(entry) ||
          ignore.some((part) => normalized.includes(part))
        )
          continue;
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
  if (!fs.existsSync(versionsDir))
    throw new Error(`Theme versions directory not found: ${config.theme.versionsDir}`);
  const selectors = config.theme.activeThemeSources || [];
  if (selectors.length !== 1) {
    throw new Error(
      `Expected exactly one site-owned active-theme source, found ${selectors.length}.`,
    );
  }
  const selectorPath = path.join(root, selectors[0]);
  if (!fs.existsSync(selectorPath))
    throw new Error(`Active-theme source not found: ${selectors[0]}`);
  const selectorText = readText(selectorPath);
  const match = selectorText.match(/\bactiveThemeVersion\s*:\s*["']([^"']+)["']/);
  if (!match?.[1])
    throw new Error(`activeThemeVersion is missing or not a string literal in ${selectors[0]}.`);

  const directory = match[1];
  const dir = path.join(versionsDir, directory);
  const manifestPath = path.join(dir, "manifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `Configured activeThemeVersion "${directory}" has no manifest at ${rel(root, manifestPath)}.`,
    );
  }
  const manifest = readJson(manifestPath);
  return { directory, manifest, manifestPath, dir };
}

export function themeSourceFiles(active) {
  const names = [
    "manifest.json",
    "palette.json",
    "typography.json",
    "spacing.json",
    "radii.json",
    "layout.json",
    "motion.json",
  ];
  return names.map((name) => path.join(active.dir, name)).filter((file) => fs.existsSync(file));
}

export function hashFiles(root, files) {
  const hash = crypto.createHash("sha256");
  const entries = files
    .map((file) => ({ file, key: rel(root, file) }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  for (const { file, key } of entries) {
    hash.update(key);
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

export function parseGeneratedCssVariables(css) {
  const reducedMotionIndex = css.indexOf("@media (prefers-reduced-motion: reduce)");
  const baseCss = reducedMotionIndex === -1 ? css : css.slice(0, reducedMotionIndex);
  const reducedMotionCss = reducedMotionIndex === -1 ? "" : css.slice(reducedMotionIndex);
  return {
    base: parseCssVariables(baseCss),
    reducedMotion: parseCssVariables(reducedMotionCss),
  };
}

export function listComponents(root, config) {
  const componentRoots = [
    path.join(root, config.siteRoot, "src/components"),
    path.join(root, config.siteRoot, "src/foundation/ui"),
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
    for (const file of walkFiles(base, { extensions: DOC_EXTENSIONS }))
      result.push(rel(root, file));
  }
  return result.sort();
}

export function listDataModules(root, config) {
  const base = path.join(root, config.dataRoot || "");
  if (!fs.existsSync(base)) return [];
  return walkFiles(base, { extensions: new Set([".ts", ".json"]) })
    .map((f) => rel(root, f))
    .sort();
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
    dataModules: listDataModules(root, config),
  };
  const governanceSources = [
    path.join(root, "AGENTS.md"),
    path.join(root, "DESIGN.md"),
    path.join(root, ".design", "config.json"),
    path.join(root, ".design", "config.schema.json"),
    path.join(root, ".design", "system.schema.json"),
    path.join(root, ".governance", "policy.json"),
    path.join(root, ".governance", "rules.json"),
    path.join(root, ".governance", "viewports.json"),
    path.join(root, ".governance", "components.json"),
    path.join(root, config.siteRoot, "foundation.config.ts"),
    ...inventory.components.map((file) => path.join(root, file)),
    ...inventory.docs.map((file) => path.join(root, file)),
    ...inventory.dataModules.map((file) => path.join(root, file)),
    ...walkFiles(path.join(root, config.siteRoot, "src/styles"), { extensions: UI_EXTENSIONS }),
  ].filter((file) => fs.existsSync(file));
  sourceFiles.push(...governanceSources);
  const inventoryHash = hashFiles(root, [...new Set(sourceFiles)]);

  return {
    $schema: "./system.schema.json",
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    sourceHash: inventoryHash,
    theme: {
      directory: active.directory,
      version: String(active.manifest.themeVersion ?? active.directory.replace(/^version-/, "")),
      name: active.manifest.name ?? active.directory,
      status: active.manifest.status,
      description: active.manifest.description ?? "",
    },
    tokens: tokenFiles,
    cssVariables: parseGeneratedCssVariables(css).base,
    cssVariablesReducedMotion: parseGeneratedCssVariables(css).reducedMotion,
    inventory,
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
  if (stat.isDirectory()) {
    const productionRoots = (config.productionUiRoots || []).map((entry) =>
      path.resolve(root, entry),
    );
    const relevantRoots = productionRoots.filter(
      (base) =>
        base === absolute ||
        base.startsWith(absolute + path.sep) ||
        absolute.startsWith(base + path.sep),
    );
    if (relevantRoots.length === 0) {
      throw new Error(
        `Directory target is outside approved production UI roots: ${rel(root, absolute)}`,
      );
    }
    const scanRoots = relevantRoots.map((base) =>
      absolute.startsWith(base + path.sep) ? absolute : base,
    );
    const files = scanRoots.flatMap((base) => walkFiles(base, { extensions: UI_EXTENSIONS }));
    return [...new Set(files)]
      .filter(
        (file) => !isGeneratedPath(root, config, file) && !isAllowedLegacyPath(root, config, file),
      )
      .sort();
  }
  if (!UI_EXTENSIONS.has(path.extname(absolute)))
    throw new Error(`Target is not a supported UI file: ${rel(root, absolute)}`);
  if (!isUnder(root, absolute, config.productionUiRoots || []))
    throw new Error(`File target is outside approved production UI roots: ${rel(root, absolute)}`);
  return isGeneratedPath(root, config, absolute) || isAllowedLegacyPath(root, config, absolute)
    ? []
    : [absolute];
}

export function makeFinding({
  ruleId,
  severity = "P2",
  file,
  line = 1,
  message,
  recommendation = "",
}) {
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
  return findings.sort(
    (a, b) =>
      severityRank(a.severity) - severityRank(b.severity) ||
      a.file.localeCompare(b.file) ||
      a.line - b.line ||
      a.ruleId.localeCompare(b.ruleId),
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

export function resolveSurface(
  root,
  config,
  { target = null, surface = null, required = false } = {},
) {
  if (surface) {
    if (!config.surfaceMap?.[surface]) {
      throw new Error(
        `Unknown surface "${surface}". Expected one of: ${Object.keys(config.surfaceMap || {})
          .sort()
          .join(", ")}`,
      );
    }
    return surface;
  }
  const discovered = target ? discoverSurface(root, config, target) : null;
  if (required && !discovered) {
    throw new Error(
      "Could not resolve a design surface from the target. Pass --surface <surface-id> explicitly.",
    );
  }
  return discovered;
}

export function parseDesignArgs(argv) {
  const valueAfter = (name) => {
    const index = argv.indexOf(name);
    if (index === -1) return null;
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${name} requires a value.`);
    return value;
  };
  const targetOption = valueAfter("--target");
  const surface = valueAfter("--surface");
  const consumed = new Set(["--json", "--strict", "--soft", "--target", "--surface"]);
  const positional =
    argv.find(
      (arg, index) => !arg.startsWith("--") && !(index > 0 && consumed.has(argv[index - 1])),
    ) ?? null;
  if (targetOption && positional)
    throw new Error("Pass the target either positionally or with --target, not both.");
  return { target: targetOption ?? positional, surface };
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
      path.join(base, "index.astro"),
    ];
    const hit = candidates.find((candidate) => fs.existsSync(candidate));
    if (hit) imports.push(hit);
  }
  return [...new Set(imports)];
}

export function loadSystem(root) {
  const file = path.join(root, ".design", "system.json");
  if (!fs.existsSync(file)) return null;
  const system = readJson(file);
  validateSystemSnapshot(system);
  return system;
}

export function validateSystemSnapshot(system) {
  if (system?.$schema !== "./system.schema.json")
    throw new Error(".design/system.json must declare ./system.schema.json.");
  if (system?.schemaVersion !== 1)
    throw new Error(".design/system.json has an unsupported schemaVersion.");
  for (const key of ["generatedAt", "sourceHash"]) {
    if (typeof system[key] !== "string" || !system[key])
      throw new Error(`.design/system.json requires "${key}".`);
  }
  if (
    !system.theme ||
    typeof system.theme.directory !== "string" ||
    typeof system.theme.version !== "string"
  ) {
    throw new Error(".design/system.json requires a resolved theme contract.");
  }
  if (!system.tokens || !system.cssVariables || !system.inventory) {
    throw new Error(".design/system.json is missing tokens, cssVariables, or inventory.");
  }
  for (const key of ["components", "docs", "dataModules"]) {
    if (!Array.isArray(system.inventory[key]))
      throw new Error(`.design/system.json inventory.${key} must be an array.`);
  }
}

export function snapshotIsCurrent(root, config, system = loadSystem(root)) {
  if (!system) return false;
  const fresh = buildSystemSnapshot(root, config);
  return snapshotsMatch(system, fresh);
}

/**
 * Compare generated snapshots while ignoring the informational timestamp.
 * This keeps design:sync idempotent without hiding generator-output changes.
 */
export function snapshotsMatch(current, fresh) {
  if (!current || !fresh) return false;
  const currentStable = { ...current };
  const freshStable = { ...fresh };
  delete currentStable.generatedAt;
  delete freshStable.generatedAt;
  return JSON.stringify(currentStable) === JSON.stringify(freshStable);
}

/** Return deterministic added/removed inventory paths for drift diagnostics. */
export function diffSnapshotInventory(current, fresh) {
  const changes = {};
  const keys = new Set([
    ...Object.keys(current?.inventory ?? {}),
    ...Object.keys(fresh?.inventory ?? {}),
  ]);
  for (const key of [...keys].sort()) {
    const currentEntries = new Set(current?.inventory?.[key] ?? []);
    const freshEntries = new Set(fresh?.inventory?.[key] ?? []);
    const added = [...freshEntries].filter((entry) => !currentEntries.has(entry)).sort();
    const removed = [...currentEntries].filter((entry) => !freshEntries.has(entry)).sort();
    if (added.length || removed.length) changes[key] = { added, removed };
  }
  return changes;
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n");
}

export function getScriptDir() {
  return path.dirname(fileURLToPath(import.meta.url));
}
