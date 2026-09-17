#!/usr/bin/env node
/**
 * Portable design-governance hook.
 *
 * - Post-edit events: detect the touched UI file when the harness exposes one.
 * - Stop events: run a soft repository-wide detector pass.
 * - Always exits 0 so governance feedback never breaks the coding-agent turn.
 *
 * The adapter intentionally accepts several event shapes because Claude Code
 * and Codex expose slightly different hook payloads.
 */
import fs from "node:fs";
import path from "node:path";
import {
  collectImplementationFiles,
  findRepoRoot,
  loadConfig,
  loadSystem
} from "./lib.mjs";
import { runDetector } from "./detect.mjs";

async function readStdin() {
  if (process.stdin.isTTY) return "";
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function isStopEvent(event) {
  const name = String(event?.hook_event_name ?? event?.hookEventName ?? event?.event ?? "").toLowerCase();
  return name === "stop";
}

function findCandidatePaths(value, out = []) {
  if (!value) return out;
  if (typeof value === "string") {
    if (/\.(?:astro|css|ts|tsx|js|jsx)$/i.test(value)) out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) findCandidatePaths(item, out);
    return out;
  }
  if (typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (/^(?:file|path|file_path|filename)$/i.test(key) && typeof child === "string") {
        findCandidatePaths(child, out);
      } else if (typeof child === "object") {
        findCandidatePaths(child, out);
      }
    }
  }
  return out;
}

function renderMessage(findings) {
  if (!findings.length) return "";
  const top = findings.slice(0, 12);
  const lines = [
    `Design governance found ${findings.length} issue${findings.length === 1 ? "" : "s"}:`
  ];
  for (const f of top) lines.push(`- [${f.severity}] ${f.ruleId} ${f.file}:${f.line} — ${f.message}`);
  if (findings.length > top.length) lines.push(`- …and ${findings.length - top.length} more. Run pnpm design:detect for the full report.`);
  lines.push("Resolve P0/P1 findings before declaring UI work complete.");
  return lines.join("\n");
}

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const system = loadSystem(root);
  const raw = await readStdin();
  let event = {};
  try { event = raw ? JSON.parse(raw) : {}; } catch { /* Invalid hook input is treated as an empty event. */ }

  let files;
  if (isStopEvent(event)) {
    files = collectImplementationFiles(root, config);
  } else {
    const candidates = findCandidatePaths(event)
      .map((p) => path.isAbsolute(p) ? p : path.resolve(root, p))
      .filter((p) => fs.existsSync(p));
    files = [...new Set(candidates)];
    if (!files.length) process.exit(0);
  }

  const findings = await runDetector({ root, config, files, system });
  const message = renderMessage(findings);
  if (message) {
    // Claude Code consumes hookSpecificOutput.additionalContext.
    // Codex accepts systemMessage-style feedback. Emitting both keeps this adapter portable.
    process.stdout.write(JSON.stringify({
      systemMessage: message,
      hookSpecificOutput: {
        hookEventName: isStopEvent(event) ? "Stop" : "PostToolUse",
        additionalContext: message
      }
    }));
  }
} catch (error) {
  if (process.env.DESIGN_HOOK_DEBUG) process.stderr.write(`[design-hook] ${error.message}\n`);
} finally {
  process.exit(0);
}
