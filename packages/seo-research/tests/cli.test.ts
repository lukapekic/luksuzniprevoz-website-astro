import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { parseArguments, stringFlag } from "../src/cli-arguments.ts";
import { executeCli } from "../src/cli.ts";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(packageRoot, "../..");
const fixtureProject = "packages/seo-research/tests/fixtures/site-b";

afterAll(async () => {
  await rm(resolve(repositoryRoot, fixtureProject, ".seo-research"), {
    recursive: true,
    force: true,
  });
});

describe("CLI arguments", () => {
  it("supports an explicit single-page research invocation", () => {
    const parsed = parseArguments([
      "run",
      "--project",
      "site/example",
      "--route",
      "serviceA",
      "--locale",
      "en",
      "--json",
      "--skip-serp",
    ]);
    expect(parsed.command).toBe("run");
    expect(stringFlag(parsed.flags, "project", true)).toBe("site/example");
    expect(parsed.flags.get("json")).toBe(true);
  });

  it("defaults a flag-first invocation to run and rejects unknown flags", () => {
    expect(parseArguments(["--project", "site/example"]).command).toBe("run");
    expect(() => parseArguments(["run", "--write-content"])).toThrow(/Unknown flag/);
  });

  it("emits machine-parseable JSON with diagnostics kept off stdout", async () => {
    let stdout = "";
    await executeCli(
      [
        "run",
        "--project",
        fixtureProject,
        "--route",
        "serviceB",
        "--locale",
        "en",
        "--mode",
        "offline",
        "--skip-serp",
        "--skip-competitors",
        "--json",
      ],
      { workingDirectory: packageRoot, writeStdout: (value) => (stdout += value) },
    );
    const report = JSON.parse(stdout) as { page: { routeKey: string } };
    expect(report.page.routeKey).toBe("serviceB");
  });

  it("rejects an all-target query budget before page collection", async () => {
    await expect(
      executeCli(
        ["run", "--project", fixtureProject, "--all", "--mode", "built", "--max-queries", "2"],
        { workingDirectory: packageRoot, writeStdout: () => undefined },
      ),
    ).rejects.toThrow(/budget allows 2/);
  });
});
import { rm } from "node:fs/promises";
