import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { seoResearchReportSchema, type SeoResearchReport } from "../reports/schema.ts";
import { atomicJsonWrite } from "./cache.ts";

export function snapshotComparable(left: SeoResearchReport, right: SeoResearchReport): boolean {
  return (
    left.page.routeKey === right.page.routeKey &&
    left.page.locale === right.page.locale &&
    left.target.primaryKeyword === right.target.primaryKeyword &&
    JSON.stringify(left.target.search) === JSON.stringify(right.target.search)
  );
}

export function compareSeoSnapshots(
  previous: SeoResearchReport,
  current: SeoResearchReport,
): { readonly comparable: boolean; readonly positionDelta: number | null } {
  if (!snapshotComparable(previous, current)) return { comparable: false, positionDelta: null };
  const before = previous.serp?.ourPosition ?? null;
  const after = current.serp?.ourPosition ?? null;
  return {
    comparable: true,
    positionDelta: before !== null && after !== null ? before - after : null,
  };
}

export function createSnapshotStore(directory: string) {
  return {
    async save(report: SeoResearchReport): Promise<string> {
      const filePath = join(
        directory,
        `${report.page.routeKey}-${report.page.locale}-${report.run.id}.json`,
      );
      await atomicJsonWrite(filePath, seoResearchReportSchema.parse(report));
      return filePath;
    },
    async loadLatestComparable(current: SeoResearchReport): Promise<SeoResearchReport | null> {
      let files: string[];
      try {
        files = (await readdir(directory))
          .filter((name) => name.endsWith(".json"))
          .sort()
          .reverse();
      } catch {
        return null;
      }
      for (const file of files) {
        try {
          const report = seoResearchReportSchema.parse(
            JSON.parse(await readFile(join(directory, file), "utf8")),
          );
          if (report.run.id !== current.run.id && snapshotComparable(report, current))
            return report;
        } catch {
          // Ignore invalid historical artifacts; current output remains valid.
        }
      }
      return null;
    },
  };
}
