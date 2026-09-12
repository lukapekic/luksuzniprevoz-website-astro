import { createHash } from "node:crypto";

export function sourceDigest(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}
