import fs from "node:fs";
import path from "node:path";
import { hashFiles, normalizeTarget } from "../design/lib.mjs";

export function scopeSourceHash(root, scope) {
  const files = scope.changedPaths
    .map((relativePath) => normalizeTarget(root, relativePath))
    .filter((file) => fs.existsSync(file) && fs.statSync(file).isFile());
  return hashFiles(root, files);
}

export function validateReviewEvidence(root, reviewPath, scope, viewports, locales) {
  const absolute = path.resolve(root, reviewPath);
  if (!fs.existsSync(absolute)) throw new Error(`Review evidence does not exist: ${reviewPath}`);
  const evidence = JSON.parse(fs.readFileSync(absolute, "utf8"));
  const required = [
    "schemaVersion",
    "sourceHash",
    "reviewer",
    "browser",
    "manualReview",
    "findings",
  ];
  for (const key of required)
    if (!(key in evidence)) throw new Error(`Review evidence is missing ${key}.`);
  if (evidence.schemaVersion !== 1)
    throw new Error("Review evidence has an unsupported schemaVersion.");
  if (evidence.sourceHash !== scopeSourceHash(root, scope))
    throw new Error("Review evidence is stale for the current change scope.");
  if (!evidence.reviewer?.role || !evidence.reviewer?.identity)
    throw new Error("Review evidence requires an independent reviewer role and identity.");
  if (!evidence.browser?.artifact || !Array.isArray(evidence.browser?.commands))
    throw new Error("Review evidence requires browser artifact and command records.");
  for (const viewport of viewports) {
    if (!evidence.browser.viewports?.includes(viewport))
      throw new Error(`Review evidence is missing required viewport ${viewport}.`);
  }
  for (const locale of locales) {
    if (!evidence.browser.locales?.includes(locale))
      throw new Error(`Review evidence is missing configured locale ${locale}.`);
  }
  if (
    !Array.isArray(evidence.manualReview?.authorities) ||
    evidence.manualReview.authorities.length === 0
  )
    throw new Error("Review evidence requires the authorities used for manual review.");
  if (
    !Array.isArray(evidence.manualReview?.screenshots) ||
    evidence.manualReview.screenshots.length === 0
  )
    throw new Error("Review evidence requires screenshot artifacts.");
  if (!["accepted", "accepted-with-exception"].includes(evidence.manualReview.disposition))
    throw new Error("Review evidence requires an accepted disposition.");
  if (
    evidence.manualReview.disposition === "accepted-with-exception" &&
    !evidence.findings.some((finding) => finding?.exception)
  )
    throw new Error("Accepted exceptions must be represented in review findings.");
  return { absolute, evidence };
}
