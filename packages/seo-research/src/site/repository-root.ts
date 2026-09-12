import { existsSync } from "node:fs";
import { dirname, parse, resolve } from "node:path";
import { SeoResearchError } from "../errors.ts";

const WORKSPACE_MARKERS = ["pnpm-workspace.yaml", "pnpm-workspace.yml"] as const;

export function findRepositoryRoot(startDirectory: string): string {
  let directory = resolve(startDirectory);
  const filesystemRoot = parse(directory).root;

  while (true) {
    if (WORKSPACE_MARKERS.some((marker) => existsSync(resolve(directory, marker))))
      return directory;
    if (directory === filesystemRoot) break;
    directory = dirname(directory);
  }

  throw new SeoResearchError(
    `Could not find a pnpm workspace above ${resolve(startDirectory)}`,
    "missing_workspace_root",
  );
}
