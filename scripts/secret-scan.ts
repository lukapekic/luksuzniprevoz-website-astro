/**
 * secret-scan — FND-ENV-06.
 *
 * Scans the built `dist/` output (and source TS/astro/JSON config) for known
 * secret patterns that must never ship to a static bundle. Dependency-free
 * (a gitleaks integration is the optional upgrade for larger orgs).
 *
 * Scans:
 *  - examples/reference-site/dist/** (the shipped artifact) — always
 *  - source files NOT in dist, only when --source is passed (dev guard)
 *
 * Fails the gate on any match. Patterns cover the common leak classes:
 *  - high-entropy API-key shapes (sk-..., AKIA..., github_pat_..., ghp_...)
 *  - private keys (-----BEGIN ... PRIVATE KEY-----)
 *  - JWTs (eyJ... three-part base64url)
 *  - generic `secret=`/`token=`/`password=` assignments with non-trivial values
 *
 * Usage: pnpm secret-scan [--source]
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { resolve, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const includeSource = process.argv.includes("--source");

const DIST = resolve(ROOT, "examples", "reference-site", "dist");

const PATTERNS: { name: string; re: RegExp }[] = [
  { name: "OpenAI key", re: /\bsk-[A-Za-z0-9-]{20,}\b/ },
  { name: "AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "GitHub PAT", re: /\b(ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{82})\b/ },
  { name: "Private key block", re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "JWT", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/ },
  { name: "Google API key", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Stripe key", re: /\b(sk|pk|rk)_(live|test)_[0-9A-Za-z]{24,}\b/ },
  { name: "assigned secret/token/password", re: /\b(secret|token|password|passwd|api_key|apikey)\s*[:=]\s*['"][^'"]{8,}['"]/i },
];

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".git") continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

interface Hit {
  file: string;
  line: number;
  name: string;
  preview: string;
}

const hits: Hit[] = [];

function scanFile(file: string) {
  let content: string;
  try {
    content = readFileSync(file, "utf-8");
  } catch {
    return;
  }
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    for (const { name, re } of PATTERNS) {
      const m = line.match(re);
      if (m) {
        // Mask the secret in the preview.
        const masked = line.replace(re, (s) => s.slice(0, 6) + "…REDACTED");
        hits.push({ file: relative(ROOT, file), line: i + 1, name, preview: masked.trim().slice(0, 120) });
      }
    }
  }
}

if (!existsSync(DIST)) {
  console.error("✖ FND-ENV-06: dist/ not found. Run `pnpm build` before secret-scan.");
  process.exit(1);
}

for (const f of walk(DIST)) scanFile(f);

if (includeSource) {
  for (const f of walk(resolve(ROOT, "examples", "reference-site", "src"))) {
    if (/\.(ts|astro|json|mjs|js)$/.test(f)) scanFile(f);
  }
  for (const f of walk(resolve(ROOT, "scripts")).filter((f) => f.endsWith(".ts"))) scanFile(f);
}

if (hits.length > 0) {
  console.error(`✖ FND-ENV-06: ${hits.length} potential secret(s) found:`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  [${h.name}]  ${h.preview}`);
  }
  console.error("\n  Remove the secret, rotate it if it was ever committed, and use astro:env for runtime secrets.");
  process.exit(1);
} else {
  console.log(`✓ secret-scan — no secrets found in dist/${includeSource ? " + source" : ""}.`);
  process.exit(0);
}
