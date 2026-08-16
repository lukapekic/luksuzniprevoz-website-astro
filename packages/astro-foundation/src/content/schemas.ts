import { z } from "zod";

/** FND-DATA-07: BaseContentSchema — identity and lifecycle */
export const BaseContentSchema = z.object({
  routeKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/),
  status: z.enum(["draft", "in-review", "published"]).default("draft"),
  translationState: z.enum(["missing", "draft", "reviewed"]).default("missing"),
  sourceLocale: z.string().optional(),
  sourceDigest: z.string().optional(),
  // Accept both a string ("2026-01-15", from the minimal frontmatter parser
  // used by the validators) and a Date (Astro's YAML parser auto-parses bare
  // ISO dates). The staleness-window check normalizes via Date.parse.
  reviewedOn: z.union([z.string(), z.date()]).optional(),
});

/** FND-DATA-07: BaseSeoSchema — SEO fields */
export const BaseSeoSchema = z.object({
  seoTitle: z.string().min(1),
  seoDescription: z.string().min(1).max(300),
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
  noindex: z.boolean().default(false),
});

/**
 * FND-LIFE-08: a structured image declaration for the frontmatter `images`
 * field. Replaces inline Markdown `![alt](url)` so alt text, role, and the
 * asset path are validated and rendered through the Image primitive.
 */
export const ContentImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  /** "decorative" → alt="" + role; "informative" → alt required (FND-A11Y) */
  role: z.enum(["informative", "decorative"]).default("informative"),
});

/** FND-LIFE-08: optional structured images on a content entry. */
export const ContentImagesSchema = z.array(ContentImageSchema).default([]);

/**
 * FND-A11Y-10: the WHATWG autocomplete token set (the fixed vocabulary an
 * `autocomplete` attribute may take). Validating against this set means
 * `autocomplete="emial"` is a schema error, and a screen reader reliably
 * announces each field's purpose. Composed values (e.g. "section-main shipping
 * street-address") are split on whitespace and each token validated.
 */
const AUTOCOMPLETE_TOKENS = [
  // on / off
  "on", "off",
  // name group
  "name", "honorific-prefix", "given-name", "additional-name", "family-name",
  "honorific-suffix", "nickname", "organization-title", "organization",
  "street-address", "address-line1", "address-line2", "address-line3",
  "address-level4", "address-level3", "address-level2", "address-level1",
  "country", "country-name", "postal-code", "cc-name", "cc-given-name",
  "cc-additional-name", "cc-family-name", "cc-number", "cc-exp",
  "cc-exp-month", "cc-exp-year", "cc-csc", "cc-type",
  // transaction group
  "transaction-currency", "transaction-amount",
  // contact group
  "tel", "tel-country-code", "tel-national", "tel-area-code", "tel-local",
  "tel-local-prefix", "tel-local-suffix", "tel-extension", "email", "impp",
  // url group
  "url", "photo", "webauthn",
  // date-time group
  "bday", "bday-day", "bday-month", "bday-year",
  // section / address-mode qualifiers (prefix tokens)
  "section-main", "section-billing", "section-shipping",
  "shipping", "billing",
  // username + current-password + new-password + one-time-code
  "username", "current-password", "new-password", "one-time-code",
  // webauthn qualifiers
  "webauthn-sign", "webauthn-create",
] as const;

export const AutocompleteTokenSchema = z.enum(AUTOCOMPLETE_TOKENS);

/**
 * Validates a full `autocomplete` attribute value: a whitespace-separated
 * sequence of WHATWG tokens (e.g. "section-main shipping street-address").
 * @returns the canonical value or throws a Zod error naming the bad token.
 */
export const AutocompleteSchema = z
  .string()
  .min(1, "autocomplete must not be empty — omit the attribute instead")
  .refine(
    (val) => val.split(/\s+/).filter(Boolean).every((tok) => (AUTOCOMPLETE_TOKENS as readonly string[]).includes(tok)),
    (val) => {
      const bad = val.split(/\s+/).filter(Boolean).find((tok) => !(AUTOCOMPLETE_TOKENS as readonly string[]).includes(tok));
      return { message: `Invalid autocomplete token: "${bad}". Must be a WHATWG autofill token.` };
    },
  );

export type AutocompleteToken = z.infer<typeof AutocompleteTokenSchema>;

export type BaseContent = z.infer<typeof BaseContentSchema>;
export type BaseSeo = z.infer<typeof BaseSeoSchema>;
export type ContentImage = z.infer<typeof ContentImageSchema>;
