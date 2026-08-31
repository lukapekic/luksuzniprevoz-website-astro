#!/usr/bin/env node
import { mkdir, readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArguments, stringFlag, type FlagMap } from "./cli-arguments.ts";
import { loadSeoResearchConfig } from "./config/load-config.ts";
import { messageFromUnknown, SeoResearchError } from "./errors.ts";
import { runSeoResearch } from "./reports/build-report.ts";
import { renderSeoResearchMarkdown } from "./reports/markdown.ts";
import { seoResearchReportSchema, type SeoResearchReport } from "./reports/schema.ts";
import { loadSite } from "./site/load-site.ts";
import { findRepositoryRoot } from "./site/repository-root.ts";
import { atomicJsonWrite } from "./storage/cache.ts";
import { compareSeoSnapshots } from "./storage/snapshots.ts";
import { allowedSuggestionFieldPaths, buildSuggestionInput } from "./suggestions/input.ts";
import { validateSuggestionFile } from "./suggestions/validate.ts";

async function readReport(repositoryRoot: string, path: string): Promise<SeoResearchReport> {
  return seoResearchReportSchema.parse(
    JSON.parse(await readFile(resolve(repositoryRoot, path), "utf8")),
  );
}

function projectIdentity(repositoryRoot: string, project: string): string {
  return relative(repositoryRoot, resolve(repositoryRoot, project));
}

async function runCommand(
  repositoryRoot: string,
  flags: FlagMap,
  writeStdout: (value: string) => void,
): Promise<void> {
  const project = stringFlag(flags, "project", true)!;
  const modeValue = stringFlag(flags, "mode") ?? "built";
  if (!["offline", "built", "live"].includes(modeValue))
    throw new SeoResearchError(`Invalid --mode: ${modeValue}`, "invalid_arguments");
  const mode = modeValue as "offline" | "built" | "live";
  const maxQueriesRaw = stringFlag(flags, "max-queries");
  const maxQueries = maxQueriesRaw ? Number.parseInt(maxQueriesRaw, 10) : undefined;
  if (maxQueriesRaw && (!Number.isInteger(maxQueries) || (maxQueries ?? 0) < 1))
    throw new SeoResearchError("--max-queries must be a positive integer", "invalid_arguments");
  const site = await loadSite(repositoryRoot, project);
  const all = flags.has("all");
  const route = stringFlag(flags, "route", !all);
  const locale = stringFlag(flags, "locale", !all);
  if (all && (route || locale))
    throw new SeoResearchError(
      "--all cannot be combined with --route or --locale",
      "invalid_arguments",
    );
  const pairs = all
    ? site.researchConfig.targets.flatMap((target) =>
        Object.keys(target.locales).map((targetLocale) => ({
          routeKey: target.routeKey,
          locale: targetLocale,
        })),
      )
    : [{ routeKey: route!, locale: locale! }];
  const allowedBudget = Math.min(
    site.researchConfig.limits.maxQueriesPerRun,
    maxQueries ?? site.researchConfig.limits.maxQueriesPerRun,
  );
  if (!flags.has("skip-serp") && mode !== "offline" && pairs.length > allowedBudget)
    throw new SeoResearchError(
      `Run needs up to ${pairs.length} ValueSERP queries but budget allows ${allowedBudget}`,
      "query_budget",
    );

  const reports: SeoResearchReport[] = [];
  for (const pair of pairs) {
    reports.push(
      await runSeoResearch({
        repositoryRoot,
        project,
        routeKey: pair.routeKey,
        locale: pair.locale,
        mode,
        skipSerp: flags.has("skip-serp"),
        skipCompetitors: flags.has("skip-competitors"),
        refresh: flags.has("refresh"),
        maxQueries,
      }),
    );
  }

  const output = stringFlag(flags, "output");
  if (output) {
    if (reports.length === 1) await atomicJsonWrite(resolve(repositoryRoot, output), reports[0]);
    else {
      await mkdir(resolve(repositoryRoot, output), { recursive: true });
      for (const report of reports)
        await atomicJsonWrite(
          resolve(repositoryRoot, output, `${report.page.routeKey}-${report.page.locale}.json`),
          report,
        );
    }
  }
  const suggestionInputPath = stringFlag(flags, "suggestion-input");
  if (suggestionInputPath) {
    if (reports.length !== 1)
      throw new SeoResearchError(
        "--suggestion-input requires a single route/locale run",
        "invalid_arguments",
      );
    await atomicJsonWrite(
      resolve(repositoryRoot, suggestionInputPath),
      buildSuggestionInput(reports[0]!),
    );
  }
  if (flags.has("json"))
    writeStdout(`${JSON.stringify(reports.length === 1 ? reports[0] : reports, null, 2)}\n`);
  else writeStdout(reports.map(renderSeoResearchMarkdown).join("\n"));
}

export async function executeCli(
  argv: readonly string[],
  runtime: {
    readonly workingDirectory?: string;
    readonly writeStdout?: (value: string) => void;
  } = {},
): Promise<void> {
  const { command, flags } = parseArguments(argv);
  const writeStdout = runtime.writeStdout ?? ((value) => process.stdout.write(value));
  const repositoryRoot = findRepositoryRoot(runtime.workingDirectory ?? process.cwd());
  if (command === "run") return runCommand(repositoryRoot, flags, writeStdout);
  if (command === "validate-config") {
    const project = stringFlag(flags, "project", true)!;
    await loadSite(repositoryRoot, project);
    const config = await loadSeoResearchConfig(resolve(repositoryRoot, project));
    writeStdout(`${JSON.stringify({ ok: true, targets: config.targets.length }, null, 2)}\n`);
    return;
  }
  if (command === "compare") {
    const project = stringFlag(flags, "project", true)!;
    const expectedProject = projectIdentity(repositoryRoot, project);
    const previous = await readReport(repositoryRoot, stringFlag(flags, "previous", true)!);
    const current = await readReport(repositoryRoot, stringFlag(flags, "current", true)!);
    if (previous.run.project !== expectedProject || current.run.project !== expectedProject)
      throw new SeoResearchError(
        `Reports do not belong to selected project: ${expectedProject}`,
        "project_mismatch",
      );
    writeStdout(`${JSON.stringify(compareSeoSnapshots(previous, current), null, 2)}\n`);
    return;
  }
  if (command === "validate-suggestions") {
    const project = stringFlag(flags, "project", true)!;
    const expectedProject = projectIdentity(repositoryRoot, project);
    const report = await readReport(repositoryRoot, stringFlag(flags, "report", true)!);
    if (report.run.project !== expectedProject)
      throw new SeoResearchError(
        `Report does not belong to selected project: ${expectedProject}`,
        "project_mismatch",
      );
    const suggestions = JSON.parse(
      await readFile(resolve(repositoryRoot, stringFlag(flags, "suggestions", true)!), "utf8"),
    );
    const validated = validateSuggestionFile(suggestions, {
      reportId: report.run.id,
      project: report.run.project,
      routeKey: report.page.routeKey,
      locale: report.page.locale,
      sourcePath: report.page.sourcePath,
      sourceDigest: report.page.sourceDigest,
      allowedFieldPaths: new Set(allowedSuggestionFieldPaths(report)),
      evidenceIds: new Set(report.evidence.map((entry) => entry.id)),
    });
    writeStdout(
      `${JSON.stringify({ ok: true, proposals: validated.proposals.length }, null, 2)}\n`,
    );
    return;
  }
  throw new SeoResearchError(`Unknown command: ${command}`, "invalid_arguments");
}

const entryPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (entryPath === import.meta.url) {
  executeCli(process.argv.slice(2)).catch((error: unknown) => {
    process.stderr.write(`seo:research failed: ${messageFromUnknown(error)}\n`);
    process.exitCode = 1;
  });
}
