import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { z } from "zod";

interface CacheEnvelope<T> {
  readonly createdAt: string;
  readonly value: T;
}

export function cacheKey(input: unknown): string {
  return createHash("sha256").update(JSON.stringify(input), "utf8").digest("hex");
}

async function atomicJsonWrite(filePath: string, value: unknown): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporaryPath, filePath);
}

export function createFileCache(directory: string, now: () => Date = () => new Date()) {
  return {
    async get<T>(
      namespace: string,
      key: string,
      ttlHours: number,
      schema: z.ZodType<T>,
    ): Promise<T | null> {
      try {
        const raw = JSON.parse(
          await readFile(join(directory, namespace, `${key}.json`), "utf8"),
        ) as CacheEnvelope<unknown>;
        const age = now().getTime() - Date.parse(raw.createdAt);
        if (!Number.isFinite(age) || age < 0 || age > ttlHours * 60 * 60 * 1_000) return null;
        return schema.parse(raw.value);
      } catch {
        return null;
      }
    },
    async set<T>(namespace: string, key: string, value: T): Promise<void> {
      await atomicJsonWrite(join(directory, namespace, `${key}.json`), {
        createdAt: now().toISOString(),
        value,
      } satisfies CacheEnvelope<T>);
    },
  };
}

export { atomicJsonWrite };
