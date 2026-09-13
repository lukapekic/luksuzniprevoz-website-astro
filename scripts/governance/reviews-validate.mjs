#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { findRepoRoot } from "../design/lib.mjs";

try {
  const root = findRepoRoot();
  const contracts = JSON.parse(
    fs.readFileSync(path.join(root, ".governance/contracts.json"), "utf8"),
  );
  const reviewPath = path.join(root, ".design/reviews/index.json");
  const reviews = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
  if (reviews.schemaVersion !== 1 || !Array.isArray(reviews.records))
    throw new Error("Review index has an unsupported schema or missing records array.");
  const contractIds = new Set(contracts.contracts.map((contract) => contract.id));
  const recordIds = new Set();
  for (const record of reviews.records) {
    for (const key of ["id", "contractId", "sourceHash", "reviewer", "evidence", "status"]) {
      if (typeof record[key] !== "string" || !record[key])
        throw new Error(`Review record lacks ${key}.`);
    }
    if (recordIds.has(record.id)) throw new Error(`Duplicate review record ${record.id}.`);
    recordIds.add(record.id);
    if (!contractIds.has(record.contractId))
      throw new Error(
        `Review record ${record.id} references unknown contract ${record.contractId}.`,
      );
    if (!/^[a-f0-9]{64}$/i.test(record.sourceHash))
      throw new Error(`Review record ${record.id} has an invalid source hash.`);
    if (!["accepted", "superseded"].includes(record.status))
      throw new Error(`Review record ${record.id} has invalid status.`);
    if (!fs.existsSync(path.join(root, record.evidence)))
      throw new Error(`Review record ${record.id} evidence is missing: ${record.evidence}`);
  }
  console.log(`Reviews: valid (${reviews.records.length} accepted-decision records).`);
} catch (error) {
  console.error(`[reviews:validate] ${error.message}`);
  process.exit(1);
}
