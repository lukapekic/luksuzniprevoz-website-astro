/**
 * Unit tests for BreadcrumbList JSON-LD matching items.
 */
import { describe, it, expect } from "vitest";
import { buildBreadcrumbList, BreadcrumbListSchema } from "../../../src/seo/structured-data.ts";

describe("BreadcrumbList JSON-LD matches items", () => {
  it("produces valid BreadcrumbList for single item", () => {
    const items = [{ name: "Home", url: "https://example.com/" }];
    const result = buildBreadcrumbList(items);
    expect(result["@type"]).toBe("BreadcrumbList");
    expect(result.itemListElement).toHaveLength(1);
    expect(BreadcrumbListSchema.safeParse(result).success).toBe(true);
  });

  it("matches items exactly (position, name, url)", () => {
    const items = [
      { name: "Home", url: "https://example.com/" },
      { name: "Services", url: "https://example.com/services/" },
      { name: "Transfer", url: "https://example.com/services/transfer/" },
    ];
    const result = buildBreadcrumbList(items);
    for (let i = 0; i < items.length; i++) {
      const el = result.itemListElement[i];
      expect(el?.position).toBe(i + 1);
      expect(el?.name).toBe(items[i]!.name);
      expect(el?.item).toBe(items[i]!.url);
    }
  });

  it("handles empty items (edge case)", () => {
    const result = buildBreadcrumbList([]);
    expect(result.itemListElement).toHaveLength(0);
    expect(BreadcrumbListSchema.safeParse(result).success).toBe(true);
  });

  it("URLs must be valid for schema", () => {
    const result = buildBreadcrumbList([{ name: "Home", url: "https://example.com/" }]);
    expect(BreadcrumbListSchema.safeParse(result).success).toBe(true);
  });

  it("rejects non-URL item values", () => {
    const bad = {
      "@type": "BreadcrumbList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "not-a-url" }],
    };
    expect(BreadcrumbListSchema.safeParse(bad).success).toBe(false);
  });
});
