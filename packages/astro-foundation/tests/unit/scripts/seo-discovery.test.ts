import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { discoverMarkdownFiles } from "../../../../../scripts/lib/discover-content.ts";

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

describe("SEO content discovery", () => {
  it("FND-SEO-01: recursively discovers nested Markdown and ignores other files", () => {
    const root = mkdtempSync(join(tmpdir(), "seo-discovery-"));
    temporaryDirectories.push(root);
    mkdirSync(join(root, "home"));
    mkdirSync(join(root, "services", "airport"), { recursive: true });
    writeFileSync(join(root, "home", "home.sr.md"), "---\nrouteKey: home\nlocale: sr\n---\n");
    writeFileSync(
      join(root, "services", "airport", "airport.en.md"),
      "---\nrouteKey: airport\nlocale: en\n---\n",
    );
    writeFileSync(join(root, "ignored.txt"), "not content");
    symlinkSync(join(root, "home"), join(root, "linked-home"));

    expect(discoverMarkdownFiles(root).map((file) => file.slice(root.length + 1))).toEqual([
      "home/home.sr.md",
      "services/airport/airport.en.md",
    ]);
  });

  it("FND-SEO-01: returns an explicit empty discovery for a missing root", () => {
    const root = mkdtempSync(join(tmpdir(), "seo-discovery-"));
    temporaryDirectories.push(root);
    expect(discoverMarkdownFiles(join(root, "missing"))).toEqual([]);
  });
});
