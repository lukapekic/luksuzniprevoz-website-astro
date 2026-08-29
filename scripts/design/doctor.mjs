#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  buildSystemSnapshot,
  collectDocumentationFiles,
  findRepoRoot,
  formatFinding,
  lineNumber,
  loadConfig,
  loadSystem,
  makeFinding,
  readJson,
  readText,
  rel,
  resolveActiveTheme,
  sortFindings,
} from "./lib.mjs";

const argv = process.argv.slice(2);
const jsonMode = argv.includes("--json");
const soft = argv.includes("--soft");

function scanLegacyDocs(root, config) {
  const findings = [];
  const markers = [
    { re: /Warm Charcoal/gi, label: "Warm Charcoal" },
    { re: /muted[- ]gold/gi, label: "muted gold" },
    { re: /\bFraunces(?: Variable)?\b/gi, label: "Fraunces" },
    { re: /\bversion-1\b/gi, label: "version-1" },
  ];
  for (const file of collectDocumentationFiles(root, config)) {
    const text = readText(file);
    for (const marker of markers) {
      marker.re.lastIndex = 0;
      let match;
      while ((match = marker.re.exec(text))) {
        const localLine = lineNumber(text, match.index);
        // Historical "do not use V1" mentions are allowed when explicitly framed as old/rejected.
        const lineText = text.split("\n")[localLine - 1] ?? "";
        if (/\bold\b|\bformer\b|\brejected\b|\blegacy\b/i.test(lineText)) continue;
        findings.push(
          makeFinding({
            ruleId: "doctor/documentation-legacy-drift",
            severity: "P2",
            file: rel(root, file),
            line: localLine,
            message: `${marker.label} appears in current design documentation without an explicit historical/rejected qualifier.`,
            recommendation: "Rewrite the guidance using active semantic token/component language.",
          }),
        );
      }
    }
  }
  return findings;
}

function scanDevUi(root, config) {
  const file = path.join(root, config.siteRoot, "src/pages/dev/ui.astro");
  if (!fs.existsSync(file)) return [];
  const text = readText(file);
  const markers = [/Fraunces/gi, /version-1/gi, /warm cream/gi, /gold accent/gi];
  const findings = [];
  for (const re of markers) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(text))) {
      findings.push(
        makeFinding({
          ruleId: "doctor/dev-ui-stale",
          severity: "P1",
          file: rel(root, file),
          line: lineNumber(text, match.index),
          message: `Dev UI preview still contains legacy design language "${match[0]}".`,
          recommendation:
            "Make /dev/ui derive labels/examples from the active Theme V2 tokens and current component contracts.",
        }),
      );
    }
  }
  return findings;
}

function scanPackageDependencies(root, config) {
  const file = path.join(root, config.siteRoot, "package.json");
  if (!fs.existsSync(file)) return [];
  const pkg = readJson(file);
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (!deps["@fontsource-variable/fraunces"]) return [];
  const sourceRoot = path.join(root, config.siteRoot, "src");
  const sourceText = [];
  const stack = [sourceRoot];
  while (stack.length) {
    const current = stack.pop();
    if (!fs.existsSync(current)) continue;
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(current)) stack.push(path.join(current, name));
    } else if (/\.(astro|css|ts|tsx|js|jsx)$/i.test(current)) {
      sourceText.push(readText(current));
    }
  }
  if (sourceText.some((text) => /@fontsource-variable\/fraunces/.test(text))) return [];
  return [
    makeFinding({
      ruleId: "doctor/dead-v1-font-dependency",
      severity: "P2",
      file: rel(root, file),
      line: 1,
      message:
        "@fontsource-variable/fraunces remains installed but is not imported by production source.",
      recommendation:
        "Remove the dead V1 font dependency after confirming no migration fixture requires it.",
    }),
  ];
}

try {
  const root = findRepoRoot();
  const config = loadConfig(root);
  const findings = [];
  let active;

  try {
    active = resolveActiveTheme(root, config);
  } catch (error) {
    findings.push(
      makeFinding({
        ruleId: "doctor/active-theme-manifest",
        severity: "P0",
        file: config.theme.versionsDir,
        line: 1,
        message: error.message,
        recommendation: `Keep exactly one theme manifest with status "${config.theme.activeManifestStatus}".`,
      }),
    );
  }

  if (active) {
    if (
      config.theme.activeManifestStatus &&
      active.manifest.status !== config.theme.activeManifestStatus
    ) {
      findings.push(
        makeFinding({
          ruleId: "doctor/active-theme-status",
          severity: "P1",
          file: rel(root, active.manifestPath),
          line: 1,
          message: `The configured theme manifest status is "${active.manifest.status}", expected "${config.theme.activeManifestStatus}".`,
          recommendation:
            "Correct the configured theme manifest status; do not select another theme as a fallback.",
        }),
      );
    }

    const generatedCss = path.join(root, config.theme.generatedCss);
    const css = readText(generatedCss);
    const declaredVersion = css.match(/Theme:.*\bv(\d+)\b/i)?.[1] ?? null;
    const expectedVersion = String(
      active.manifest.themeVersion ?? active.directory.replace(/^version-/, ""),
    );
    if (!css) {
      findings.push(
        makeFinding({
          ruleId: "doctor/generated-theme-missing",
          severity: "P0",
          file: config.theme.generatedCss,
          line: 1,
          message: "Generated theme CSS is missing.",
          recommendation: "Run pnpm theme:sync.",
        }),
      );
    } else if (declaredVersion && declaredVersion !== expectedVersion) {
      findings.push(
        makeFinding({
          ruleId: "doctor/generated-theme-version",
          severity: "P0",
          file: config.theme.generatedCss,
          line: 1,
          message: `Generated theme CSS advertises v${declaredVersion}, active manifest is v${expectedVersion}.`,
          recommendation: "Run pnpm theme:sync and verify active-theme selection.",
        }),
      );
    }
  }

  const system = loadSystem(root);
  const fresh = buildSystemSnapshot(root, config);
  if (!system) {
    findings.push(
      makeFinding({
        ruleId: "doctor/design-snapshot-missing",
        severity: "P1",
        file: ".design/system.json",
        line: 1,
        message: "Machine-readable design snapshot is missing.",
        recommendation: "Run pnpm design:sync.",
      }),
    );
  } else if (system.sourceHash !== fresh.sourceHash) {
    findings.push(
      makeFinding({
        ruleId: "doctor/design-snapshot-stale",
        severity: "P1",
        file: ".design/system.json",
        line: 1,
        message:
          "Machine-readable design snapshot does not match the current active theme/generated CSS.",
        recommendation: "Run pnpm design:sync and commit the refreshed snapshot.",
      }),
    );
  }

  findings.push(...scanLegacyDocs(root, config));
  findings.push(...scanDevUi(root, config));
  findings.push(...scanPackageDependencies(root, config));

  const baseLayout = path.join(root, config.siteRoot, "src/layouts/BaseLayout.astro");
  if (fs.existsSync(baseLayout)) {
    const text = readText(baseLayout);
    for (const [name, re] of [
      ["Header", /foundation\/ui\/Header\.astro/],
      ["Footer", /foundation\/ui\/Footer\.astro/],
    ]) {
      const match = re.exec(text);
      if (match)
        findings.push(
          makeFinding({
            ruleId: "doctor/site-chrome-split",
            severity: "P1",
            file: rel(root, baseLayout),
            line: lineNumber(text, match.index),
            message: `BaseLayout still mounts the generic foundation ${name}, while the reviewed site uses Site${name}.`,
            recommendation: `Unify leaf-page chrome on Site${name} before treating service pages as design-complete.`,
          }),
        );
    }
  }

  const sorted = sortFindings(findings);
  if (jsonMode) {
    process.stdout.write(
      JSON.stringify(
        {
          activeTheme: active ? { directory: active.directory, manifest: active.manifest } : null,
          findings: sorted,
        },
        null,
        2,
      ) + "\n",
    );
  } else if (!sorted.length) {
    console.log("Design doctor: governance is coherent; no drift found.");
  } else {
    console.log(`Design doctor: ${sorted.length} finding${sorted.length === 1 ? "" : "s"}.\n`);
    sorted.forEach((finding, index) => {
      if (index) console.log("");
      console.log(formatFinding(finding));
    });
  }

  if (soft) process.exit(0);
  process.exit(sorted.some((f) => f.severity === "P0" || f.severity === "P1") ? 1 : 0);
} catch (error) {
  console.error(`[design:doctor] ${error.message}`);
  process.exit(1);
}
