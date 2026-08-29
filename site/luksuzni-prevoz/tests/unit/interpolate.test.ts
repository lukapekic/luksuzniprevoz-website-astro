import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { interpolateTokens } from "../../src/lib/interpolate.ts";

describe("content interpolation", () => {
  it("resolves repeated string and numeric tokens deterministically", () => {
    assert.equal(
      interpolateTokens("{name}: {count}; {name}", { name: "Corporate", count: 3 }, "test"),
      "Corporate: 3; Corporate",
    );
  });

  it("fails unknown tokens with their content context", () => {
    assert.throws(
      () => interpolateTokens("{unknown}", {}, "Corporate FAQ"),
      /Unknown interpolation token.*Corporate FAQ/,
    );
  });
});
