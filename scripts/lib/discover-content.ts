import { existsSync, lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Deterministic recursive Markdown discovery for content validators. */
export function discoverMarkdownFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  const files: string[] = [];
  const stack = [directory];
  while (stack.length > 0) {
    const current = stack.pop()!;
    for (const name of readdirSync(current).sort().reverse()) {
      const candidate = join(current, name);
      const stat = lstatSync(candidate);
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) stack.push(candidate);
      else if (stat.isFile() && name.endsWith(".md")) files.push(candidate);
    }
  }
  return files.sort();
}
