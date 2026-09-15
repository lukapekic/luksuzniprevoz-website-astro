import { describe, it, expect } from "vitest";
import { AutocompleteSchema, AutocompleteTokenSchema } from "../../../src/content/schemas.ts";

/**
 * FND-A11Y-10: the `autocomplete` attribute must take a WHATWG autofill
 * token. A typo like "emial" is a schema error so a screen reader reliably
 * announces each field's purpose.
 */
describe("AutocompleteSchema (FND-A11Y-10)", () => {
  it("accepts a single known token", () => {
    expect(AutocompleteSchema.safeParse("email").success).toBe(true);
    expect(AutocompleteSchema.safeParse("given-name").success).toBe(true);
    expect(AutocompleteSchema.safeParse("street-address").success).toBe(true);
  });

  it("accepts a composed whitespace-separated value", () => {
    expect(AutocompleteSchema.safeParse("section-main shipping street-address").success).toBe(true);
  });

  it("rejects a typo", () => {
    const r = AutocompleteSchema.safeParse("emial");
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toContain('Invalid autocomplete token: "emial"');
    }
  });

  it("rejects an unknown token in a composed value", () => {
    const r = AutocompleteSchema.safeParse("section-main shipping nonsense-token");
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toContain('Invalid autocomplete token: "nonsense-token"');
    }
  });

  it("rejects an empty string", () => {
    const r = AutocompleteSchema.safeParse("");
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.message).toBe(
        "autocomplete must not be empty — omit the attribute instead",
      );
    }
  });

  it("AutocompleteTokenSchema is the enum of valid tokens", () => {
    expect(AutocompleteTokenSchema.safeParse("tel").success).toBe(true);
    expect(AutocompleteTokenSchema.safeParse("telephone").success).toBe(false);
  });
});
