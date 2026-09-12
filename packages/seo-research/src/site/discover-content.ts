import { lstat, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import { SeoResearchError } from "../errors.ts";

export interface DiscoveredContent {
  readonly filePath: string;
  readonly raw: string;
  readonly frontmatter: Record<string, unknown>;
  readonly body: string;
}

function parseContent(raw: string, filePath: string): DiscoveredContent {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new SeoResearchError(
      `Content file has no YAML frontmatter: ${filePath}`,
      "invalid_content",
    );
  }
  let parsed: unknown;
  try {
    parsed = parseYaml(match[1] ?? "");
  } catch (error) {
    throw new SeoResearchError(`Invalid YAML frontmatter: ${filePath}`, "invalid_content", error);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new SeoResearchError(`Frontmatter must be a mapping: ${filePath}`, "invalid_content");
  }
  return {
    filePath,
    raw,
    frontmatter: parsed as Record<string, unknown>,
    body: match[2] ?? "",
  };
}

export async function discoverContent(directory: string): Promise<DiscoveredContent[]> {
  const discovered: DiscoveredContent[] = [];
  const stack = [directory];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) break;
    let names: string[];
    try {
      names = (await readdir(current)).sort().reverse();
    } catch (error) {
      throw new SeoResearchError(
        `Cannot read content directory: ${directory}`,
        "missing_content",
        error,
      );
    }
    for (const name of names) {
      const candidate = join(current, name);
      const stat = await lstat(candidate);
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) stack.push(candidate);
      else if (stat.isFile() && name.endsWith(".md")) {
        discovered.push(parseContent(await readFile(candidate, "utf8"), candidate));
      }
    }
  }

  return discovered.sort((left, right) => left.filePath.localeCompare(right.filePath));
}
