#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot } from "../design/lib.mjs";

const errors = [];
const error = (file, message) => errors.push(`${file}: ${message}`);

try {
  const root = findRepoRoot();
  const skillsDir = path.join(root, ".skills");
  const manifestPath = path.join(skillsDir, "skills-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const files = fs
    .readdirSync(skillsDir)
    .filter((name) => name.endsWith(".md"))
    .sort();
  const manifestNames = manifest.skills?.map((skill) => skill.name) ?? [];
  const fileNames = files.map((file) => path.basename(file, ".md"));
  if (new Set(manifestNames).size !== manifestNames.length)
    error(".skills/skills-manifest.json", "duplicate skill names");
  for (const name of fileNames)
    if (!manifestNames.includes(name)) error(`${name}.md`, "missing from skills manifest");
  for (const name of manifestNames)
    if (!fileNames.includes(name))
      error(".skills/skills-manifest.json", `references missing skill ${name}.md`);

  const packageScripts =
    JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).scripts ?? {};
  const maxLines = manifest.limits?.maxLines ?? 120;
  const maxWords = manifest.limits?.maxWords ?? 1000;
  const wordsBySkill = new Map();
  const banned = [
    [/\bnpm\s+(?:run|install|test|build)\b/i, "use pnpm only"],
    [/\byarn\b/i, "use pnpm only"],
    [/@astro-foundation\/core\/ui/, "stale shared-UI import contract"],
    [/\bswap-config\b/, "nonexistent command"],
    [/\bhome\/sr\.md\b/, "stale localized-content filename"],
    [/\bReference Site\b/, "stale product identity"],
    [/\b(?:Fraunces|Instrument Serif)\b/, "legacy font direction"],
    [/\bcontained full-panel\b/i, "stale hero geometry"],
  ];

  for (const file of files) {
    const relative = `.skills/${file}`;
    const text = fs.readFileSync(path.join(skillsDir, file), "utf8");
    const lines = text.split(/\r?\n/);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    wordsBySkill.set(path.basename(file, ".md"), words);
    if (lines.length > maxLines) error(relative, `${lines.length} lines exceeds ${maxLines}`);
    if (words > maxWords) error(relative, `${words} words exceeds ${maxWords}`);
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) {
      error(relative, "missing YAML frontmatter");
      continue;
    }
    const name = frontmatter[1].match(/^name:\s*([^\n]+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.*)$/m)?.[1]?.trim();
    const authority = frontmatter[1].match(/^source-of-truth:\s*([^\n]+)$/m)?.[1]?.trim();
    if (name !== path.basename(file, ".md"))
      error(relative, "frontmatter name must match filename");
    if (!description)
      error(relative, "description must be a non-empty single-line routing description");
    if (!authority || !["AGENTS.md", "DESIGN.md"].includes(authority))
      error(relative, "source-of-truth must be AGENTS.md or DESIGN.md");
    for (const [pattern, message] of banned) if (pattern.test(text)) error(relative, message);
    for (const match of text.matchAll(/\.skills\/([a-z0-9-]+\.md)/g)) {
      if (!fs.existsSync(path.join(skillsDir, match[1])))
        error(relative, `broken skill reference .skills/${match[1]}`);
    }
    for (const match of text.matchAll(/`pnpm\s+([a-z][a-z0-9:_-]*)/g)) {
      const command = match[1];
      if (!packageScripts[command] && command !== "exec")
        error(relative, `references missing package script "${command}"`);
    }
  }

  for (const [bundle, names] of Object.entries(manifest.bundles ?? {})) {
    const missing = names.filter((name) => !wordsBySkill.has(name));
    if (missing.length)
      error(
        ".skills/skills-manifest.json",
        `bundle ${bundle} references missing skills: ${missing.join(", ")}`,
      );
    const words = names.reduce((sum, name) => sum + (wordsBySkill.get(name) ?? 0), 0);
    if (words > (manifest.limits?.maxBundleWords ?? 4500))
      error(
        ".skills/skills-manifest.json",
        `bundle ${bundle} is ${words} words; exceeds ${manifest.limits?.maxBundleWords ?? 4500}`,
      );
  }

  if (errors.length) {
    console.error(
      `Skill validation failed (${errors.length}):\n${errors.map((item) => `- ${item}`).join("\n")}`,
    );
    process.exit(1);
  }
  console.log(
    `Skills: valid (${files.length} skills, ${[...wordsBySkill.values()].reduce((a, b) => a + b, 0)} total words).`,
  );
} catch (cause) {
  console.error(`[skills:validate] ${cause.message}`);
  process.exit(1);
}
