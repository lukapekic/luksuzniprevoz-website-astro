import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { runSeoResearch } from "../src/reports/build-report.ts";
import { loadSite, resolvePage } from "../src/site/load-site.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const siteAProject = "packages/seo-research/tests/fixtures/site-a";
const siteBProject = "packages/seo-research/tests/fixtures/site-b";

afterAll(async () => {
  await Promise.all([
    rm(resolve(repositoryRoot, siteAProject, ".seo-research"), { recursive: true, force: true }),
    rm(resolve(repositoryRoot, siteBProject, ".seo-research"), { recursive: true, force: true }),
  ]);
});

describe("portable site loading", () => {
  it("loads two different site contracts without package source changes", async () => {
    const [siteA, siteB] = await Promise.all([
      loadSite(repositoryRoot, siteAProject),
      loadSite(repositoryRoot, siteBProject),
    ]);

    expect(resolvePage(siteA, "serviceA", "en").url).toBe("https://site-a.example/en/service-a/");
    expect(resolvePage(siteB, "serviceB", "ru").url).toBe("https://site-b.example/ru/usluga-b-ru/");
    expect(siteA.contentByPair.size).toBe(3);
    expect(siteB.contentByPair.size).toBe(3);
  });

  it("produces a schema-valid read-only offline report", async () => {
    const report = await runSeoResearch({
      repositoryRoot,
      project: siteAProject,
      routeKey: "serviceA",
      locale: "en",
      mode: "offline",
      skipSerp: true,
      skipCompetitors: true,
      now: () => new Date("2026-01-01T00:00:00.000Z"),
    });

    expect(report.page.url).toBe("https://site-a.example/en/service-a/");
    expect(report.run.provider).toBeNull();
    expect(report.current.rendered).toBeNull();
    expect(report.page.sourcePath.endsWith("service-a/en.md")).toBe(true);
  });

  it("inspects an existing Astro directory build without triggering a build", async () => {
    const builtDirectory = resolve(repositoryRoot, siteAProject, "dist/en/service-a");
    await mkdir(builtDirectory, { recursive: true });
    await writeFile(
      resolve(builtDirectory, "index.html"),
      `<!doctype html><html lang="en"><head>
        <title>Service A | Site A</title>
        <meta name="description" content="Reliable service A for travellers in Belgrade.">
        <link rel="canonical" href="https://site-a.example/en/service-a/">
        <link rel="alternate" hreflang="sr-Latn" href="https://site-a.example/usluga-a/">
        <link rel="alternate" hreflang="en" href="https://site-a.example/en/service-a/">
        <link rel="alternate" hreflang="ru" href="https://site-a.example/ru/usluga-a-ru/">
        <link rel="alternate" hreflang="x-default" href="https://site-a.example/usluga-a/">
      </head><body><h1>Service A in Belgrade</h1><a href="/en/contact/">Contact</a></body></html>`,
      "utf8",
    );
    try {
      const report = await runSeoResearch({
        repositoryRoot,
        project: siteAProject,
        routeKey: "serviceA",
        locale: "en",
        mode: "built",
        skipSerp: true,
        skipCompetitors: true,
        now: () => new Date("2026-01-02T00:00:00.000Z"),
      });
      expect(report.current.rendered?.status).toBe(200);
      expect(report.current.rendered?.headings[0]?.text).toBe("Service A in Belgrade");
    } finally {
      await rm(resolve(repositoryRoot, siteAProject, "dist"), { recursive: true, force: true });
    }
  });

  it("rejects project traversal and unknown locale selection", async () => {
    await expect(loadSite(repositoryRoot, "../outside")).rejects.toThrow(/beneath/);
    const site = await loadSite(repositoryRoot, siteAProject);
    expect(() => resolvePage(site, "serviceA", "de")).toThrow(/Unknown locale/);
  });
});
