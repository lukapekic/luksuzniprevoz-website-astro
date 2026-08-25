#!/usr/bin/env node
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import {
  findRepoRoot,
  formatFinding,
  loadConfig,
  loadSystem,
  sortFindings,
  targetFiles
} from "./lib.mjs";

const ruleFiles = [
  "theme-values.mjs",
  "tailwind.mjs",
  "legacy.mjs",
  "typography.mjs",
  "components.mjs",
  "routing.mjs",
  "accessibility.mjs"
];

export async function runDetector({ root, config, files, system }) {
  const findings = [];
  for (const fileName of ruleFiles) {
    const moduleUrl = pathToFileURL(path.join(root, "scripts/design/rules", fileName)).href;
    const { rule } = await import(moduleUrl);
    const result = await rule.scan({ root, config, files, system });
    findings.push(...result);
  }
  return sortFindings(findings);
}

async function main() {
  const argv = process.argv.slice(2);
  const jsonMode = argv.includes("--json");
  const strict = argv.includes("--strict");
  const soft = argv.includes("--soft");
  const targetArg = argv.find((arg) => !arg.startsWith("--")) ?? null;

  try {
    const root = findRepoRoot();
    const config = loadConfig(root);
    const files = targetFiles(root, config, targetArg);
    const system = loadSystem(root);
    const findings = await runDetector({ root, config, files, system });

    if (jsonMode) {
      process.stdout.write(JSON.stringify({ filesScanned: files.length, findings }, null, 2) + "\n");
    } else if (!findings.length) {
      console.log(`Design detector: clean (${files.length} file${files.length === 1 ? "" : "s"} scanned).`);
    } else {
      console.log(`Design detector: ${findings.length} finding${findings.length === 1 ? "" : "s"} in ${files.length} file${files.length === 1 ? "" : "s"}.\n`);
      findings.forEach((finding, index) => {
        if (index) console.log("");
        console.log(formatFinding(finding));
      });
    }

    if (soft) process.exit(0);
    const fails = strict ? findings.length > 0 : findings.some((f) => f.severity === "P0" || f.severity === "P1");
    process.exit(fails ? 1 : 0);
  } catch (error) {
    console.error(`[design:detect] ${error.message}`);
    process.exit(1);
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) await main();
