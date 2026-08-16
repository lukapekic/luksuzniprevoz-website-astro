/**
 * Unit tests for the variants() function and allCombinations().
 */
import { describe, it, expect } from "vitest";
import { variants, allCombinations } from "../../../src/ui/variants.ts";
import { linkVariants } from "../../../src/ui/link.variants.ts";
import { buttonVariants } from "../../../src/ui/button.variants.ts";
import { containerVariants } from "../../../src/ui/container.variants.ts";
import { dialogVariants } from "../../../src/ui/dialog.variants.ts";
import { fieldVariants } from "../../../src/ui/field.variants.ts";
import { inputVariants } from "../../../src/ui/input.variants.ts";

describe("variants()", () => {
  it("returns a function", () => {
    const v = variants({
      base: "base",
      axes: {},
      defaults: {},
    });
    expect(typeof v).toBe("function");
  });

  it("applies base class", () => {
    const v = variants({
      base: "base-class",
      axes: {},
      defaults: {},
    });
    expect(v()).toContain("base-class");
  });

  it("applies default axis values", () => {
    const v = variants({
      base: "base",
      axes: {
        color: { red: "text-red", blue: "text-blue" },
      },
      defaults: { color: "red" },
    });
    expect(v()).toContain("text-red");
    expect(v()).not.toContain("text-blue");
  });

  it("applies selected axis values over defaults", () => {
    const v = variants({
      base: "base",
      axes: {
        color: { red: "text-red", blue: "text-blue" },
      },
      defaults: { color: "red" },
    });
    expect(v({ color: "blue" })).toContain("text-blue");
    expect(v({ color: "blue" })).not.toContain("text-red");
  });

  it("applies layout class last", () => {
    const v = variants({
      base: "base",
      axes: {
        size: { sm: "text-sm" },
      },
      defaults: { size: "sm" },
    });
    const result = v({}, "my-layout");
    const parts = result.split(" ");
    expect(parts[parts.length - 1]).toBe("my-layout");
  });

  it("handles multiple axes", () => {
    const v = variants({
      base: "base",
      axes: {
        color: { red: "text-red", blue: "text-blue" },
        size: { sm: "text-sm", lg: "text-lg" },
      },
      defaults: { color: "red", size: "sm" },
    });
    const result = v();
    expect(result).toContain("base");
    expect(result).toContain("text-red");
    expect(result).toContain("text-sm");
  });

  it("selectively overrides one axis while keeping other defaults", () => {
    const v = variants({
      base: "base",
      axes: {
        color: { red: "text-red", blue: "text-blue" },
        size: { sm: "text-sm", lg: "text-lg" },
      },
      defaults: { color: "red", size: "sm" },
    });
    const result = v({ size: "lg" });
    expect(result).toContain("text-red"); // default
    expect(result).toContain("text-lg"); // overridden
  });

  it("works with no base class", () => {
    const v = variants({
      axes: { color: { red: "text-red" } },
      defaults: { color: "red" },
    });
    expect(v()).toContain("text-red");
  });
});

describe("allCombinations()", () => {
  it("returns empty array for no axes", () => {
    expect(allCombinations({})).toEqual([{}]);
  });

  it("returns correct number of combinations for single axis", () => {
    const combos = allCombinations({
      color: { red: "r", blue: "b" },
    });
    expect(combos).toHaveLength(2);
    expect(combos.some((c) => c.color === "red")).toBe(true);
    expect(combos.some((c) => c.color === "blue")).toBe(true);
  });

  it("returns correct number of combinations for two axes", () => {
    const combos = allCombinations({
      color: { red: "r", blue: "b" },
      size: { sm: "s", lg: "l" },
    });
    expect(combos).toHaveLength(4); // 2 × 2
  });

  it("returns correct number of combinations for three axes", () => {
    const combos = allCombinations({
      color: { red: "r" },
      size: { sm: "s", lg: "l" },
      variant: { a: "a", b: "b", c: "c" },
    });
    expect(combos).toHaveLength(6); // 1 × 2 × 3
  });

  it("all combinations have all axis keys", () => {
    const combos = allCombinations({
      color: { red: "r", blue: "b" },
      size: { sm: "s" },
    });
    for (const combo of combos) {
      expect("color" in combo).toBe(true);
      expect("size" in combo).toBe(true);
    }
  });
});

describe("linkVariants", () => {
  it("has base class with inline-flex", () => {
    expect(linkVariants()).toContain("inline-flex");
  });

  it("defaults to variant=default and size=md", () => {
    const result = linkVariants();
    expect(result).toContain("text-[var(--text-secondary)]");
    expect(result).toContain("text-[var(--text-base)]");
  });

  it("applies nav variant", () => {
    const result = linkVariants({ variant: "nav" });
    expect(result).toContain("font-medium");
    expect(result).toContain("hover:bg-[var(--accent-subtle)]");
  });

  it("applies cta variant", () => {
    const result = linkVariants({ variant: "cta" });
    expect(result).toContain("bg-[var(--accent-primary)]");
    expect(result).toContain("text-[var(--text-on-accent)]");
  });

  it("applies size sm", () => {
    const result = linkVariants({ size: "sm" });
    expect(result).toContain("text-[var(--text-sm)]");
  });
});

describe("buttonVariants", () => {
  it("has base class with min-h-11 for 44px target size", () => {
    expect(buttonVariants()).toContain("min-h-11");
  });

  it("defaults to variant=primary and size=md", () => {
    const result = buttonVariants();
    expect(result).toContain("bg-[var(--accent-primary)]");
    expect(result).toContain("px-4");
  });

  it("applies secondary variant", () => {
    const result = buttonVariants({ variant: "secondary" });
    expect(result).toContain("bg-[var(--surface-raised)]");
  });

  it("applies ghost variant", () => {
    const result = buttonVariants({ variant: "ghost" });
    expect(result).toContain("hover:bg-[var(--accent-subtle)]");
  });

  it("applies outline variant", () => {
    const result = buttonVariants({ variant: "outline" });
    expect(result).toContain("border-2");
  });
});

describe("containerVariants", () => {
  it("has base class with mx-auto", () => {
    expect(containerVariants()).toContain("mx-auto");
  });

  it("defaults to size=lg", () => {
    expect(containerVariants()).toContain("max-w-[var(--container-lg)]");
  });

  it("applies size sm", () => {
    expect(containerVariants({ size: "sm" })).toContain("max-w-[var(--container-sm)]");
  });

  it("applies size full", () => {
    expect(containerVariants({ size: "full" })).toContain("max-w-full");
  });
});

describe("dialogVariants", () => {
  it("has backdrop styling", () => {
    expect(dialogVariants()).toContain("backdrop:");
  });

  it("defaults to size=md", () => {
    expect(dialogVariants()).toContain("max-w-md");
  });
});

describe("fieldVariants", () => {
  it("has flex flex-col base", () => {
    expect(fieldVariants()).toContain("flex");
    expect(fieldVariants()).toContain("flex-col");
  });
});

describe("inputVariants", () => {
  it("has focus ring styling", () => {
    expect(inputVariants()).toContain("focus:ring-2");
  });

  it("has min-h-11 for 44px target", () => {
    expect(inputVariants()).toContain("min-h-11");
  });
});
