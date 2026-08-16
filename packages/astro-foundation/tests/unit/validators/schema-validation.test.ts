import { describe, it, expect } from "vitest";
import { BaseContentSchema, BaseSeoSchema } from "../../../src/content/schemas.ts";
import { parseFrontmatter } from "../../../src/validators/validate-content.ts";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_ROOT = resolve(__dirname, "..", "..", "fixtures", "content");

describe("schema validation with fixtures", () => {
  describe("valid fixtures", () => {
    const validDir = resolve(FIXTURES_ROOT, "valid");
    const files = readdirSync(validDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      it(`${file} passes BaseContentSchema`, () => {
        const raw = readFileSync(resolve(validDir, file), "utf-8");
        const fm = parseFrontmatter(raw);
        const result = BaseContentSchema.safeParse({
          routeKey: fm["routeKey"],
          locale: fm["locale"],
          status: fm["status"],
          translationState: fm["translationState"],
        });
        expect(result.success).toBe(true);
      });

      it(`${file} passes BaseSeoSchema`, () => {
        const raw = readFileSync(resolve(validDir, file), "utf-8");
        const fm = parseFrontmatter(raw);
        const result = BaseSeoSchema.safeParse({
          seoTitle: fm["seoTitle"],
          seoDescription: fm["seoDescription"],
        });
        expect(result.success).toBe(true);
      });
    }
  });

  describe("invalid fixtures", () => {
    const invalidDir = resolve(FIXTURES_ROOT, "invalid");
    const files = readdirSync(invalidDir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      it(`${file} fails schema validation with errors`, () => {
        const raw = readFileSync(resolve(invalidDir, file), "utf-8");
        const fm = parseFrontmatter(raw);
        const baseResult = BaseContentSchema.safeParse({
          routeKey: fm["routeKey"],
          locale: fm["locale"],
          status: fm["status"],
        });
        const seoResult = BaseSeoSchema.safeParse({
          seoTitle: fm["seoTitle"],
          seoDescription: fm["seoDescription"],
        });

        // At least one schema should fail for invalid fixtures
        // (except unknown-route-ref which has valid base+seo but wrong route key)
        const fileIsMissingRouteKey = !fm["routeKey"];
        const fileIsMissingSeo = !fm["seoTitle"] || !fm["seoDescription"];

        if (fileIsMissingRouteKey || fileIsMissingSeo) {
          // baseResult or seoResult should fail
          expect(baseResult.success === false || seoResult.success === false).toBe(true);
        } else {
          // unknown-route-ref passes schemas but would fail route binding
          expect(baseResult.success || seoResult.success).toBe(true);
        }
      });
    }
  });

  it("BaseContentSchema rejects invalid locale codes", () => {
    const result = BaseContentSchema.safeParse({
      routeKey: "home",
      locale: "invalid!!",
      status: "published",
    });
    expect(result.success).toBe(false);
  });

  it("BaseSeoSchema rejects empty seoTitle", () => {
    const result = BaseSeoSchema.safeParse({
      seoTitle: "",
      seoDescription: "valid description",
    });
    expect(result.success).toBe(false);
  });

  it("BaseSeoSchema rejects seoDescription > 300 chars", () => {
    const result = BaseSeoSchema.safeParse({
      seoTitle: "Title",
      seoDescription: "a".repeat(301),
    });
    expect(result.success).toBe(false);
  });

  it("BaseSeoSchema accepts noindex", () => {
    const result = BaseSeoSchema.safeParse({
      seoTitle: "Title",
      seoDescription: "Description",
      noindex: true,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.noindex).toBe(true);
    }
  });
});
