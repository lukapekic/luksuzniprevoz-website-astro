/**
 * Shared content schemas — editorial content layer (FND-DATA-07 / FND-ARCH-03).
 *
 * These extend the foundation's BaseContentSchema / BaseSeoSchema (identity +
 * lifecycle + SEO) with the editorial vocabulary shared across all page
 * archetypes: CTAs, image references, hero, section headings, editorial
 * sections, FAQs, final CTA, and route cards.
 *
 * SEPARATION (content-model contract): content frontmatter holds EDITORIAL
 * COPY only — localized headings, intros, CTA labels, FAQ Q/A, section prose.
 * It MUST NOT duplicate operational facts (prices, phone/email, address,
 * office hours, vehicle capacities, service limits) which live in
 * src/data/*.ts. It references routes by `routeKey`, vehicles by `vehicleId`,
 * and clients by `clientId` — never by raw URL. It MUST NOT choose presentation
 * (no layout/theme/columns/imagePosition fields) — blueprints/components own
 * that.
 *
 * Referential integrity is enforced at the Zod level where the referent is
 * site data (route keys, vehicle ids, client ids → z.enum against the live
 * data modules), so a bad reference is a parse error at `astro sync`. Cross-
 * artifact consistency (pageType ↔ route kind, routeKey+locale uniqueness,
 * lifecycle, parity) is enforced by content:validate (see validate-content.ts).
 *
 * `z` is imported from "astro:content" (astro/zod) — the same zod instance the
 * foundation's BaseContentSchema is built from, so .merge/.extend compose.
 */
import { z } from "astro:content";
import { ContentImageSchema } from "@astro-foundation/core/content";
import { routeMap } from "../../data/routes.ts";
import { vehicleIds } from "../../data/fleet.ts";
import { clients } from "../../data/clients.ts";

// --- Live referent sets (single source of truth → Zod enums) ----------------

/** Every known route key, as a Zod enum tuple. */
const routeKeyEnum = z.enum(Object.keys(routeMap) as [string, ...string[]]);
/** Every known fleet vehicle id, as a Zod enum tuple. */
const vehicleIdEnum = z.enum(vehicleIds as [string, ...string[]]);
/** Every known client id, as a Zod enum tuple. */
const clientIdEnum = z.enum(clients.map((c) => c.id) as [string, ...string[]]);

// --- CTA -------------------------------------------------------------------

/**
 * A CTA target. Routes resolve to a localized URL via getPath() (never a raw
 * URL authored here); flows are app-internal (e.g. a booking wizard). Mirrors
 * the NavTarget union in navigation.ts (route | flow), narrowed to the two
 * target kinds editorial content uses (external links are not authored in CTAs
 * — the content contract forbids raw URLs where a route key is required).
 */
export const actionTargetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("route"), routeKey: routeKeyEnum }),
  z.object({ type: z.literal("flow"), flowKey: z.string().min(1) }),
]);

export const ctaSchema = z.object({
  label: z.string().min(1),
  target: actionTargetSchema,
});

// --- Image reference -------------------------------------------------------

/**
 * An image declaration. Reuses the foundation's ContentImageSchema (src + alt
 * + a11y role: "informative" | "decorative") and adds an optional normalized
 * focal point (x/y in 0–1) for art direction — a presentation hint, not layout.
 */
export const imageReferenceSchema = ContentImageSchema.extend({
  focalPoint: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
    })
    .optional(),
});

// --- Hero ------------------------------------------------------------------

/**
 * The hero block. The hero `title` IS the page's <h1> (the single page heading)
 * and the hero `description` is its lede; hero carries the heading + lede plus
 * the CTAs and an optional image. Pages without a hero use the base `h1`/`intro`
 * fields instead, so a page has exactly one <h1> — either hero.title or base h1.
 */
export const heroSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  image: imageReferenceSchema.optional(),
});

// --- Sections --------------------------------------------------------------

export const sectionHeadingSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1).optional(),
});

export const textItemSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

/**
 * An editorial section: a semantic camelCase key (stable across locales for
 * keyed lookups), a heading, optional body prose, optional titled items, an
 * optional image, and optional references to related routes. `relatedRouteKeys`
 * are route enums — never raw URLs.
 */
export const editorialSectionSchema = z.object({
  key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
  heading: sectionHeadingSchema,
  body: z.string().min(1).optional(),
  items: z.array(textItemSchema).optional(),
  image: imageReferenceSchema.optional(),
  relatedRouteKeys: z.array(routeKeyEnum).optional(),
});

// --- FAQ -------------------------------------------------------------------

/**
 * A single FAQ question/answer pair. Extracted as a named schema (mirroring
 * `textItemSchema`) so one canonical contract owns the TypeScript item type
 * consumed by BOTH the visible <FAQ> component AND the `buildFaqPage`
 * structured-data builder — single shape, no manual duplicate (FND-ARCH-03,
 * structured-data.md). `z.infer<typeof faqItemSchema>` is structurally
 * identical to `buildFaqPage`'s `Array<{ question: string; answer: string }>`,
 * so the same validated `faq.items` array feeds visible rows and FAQ schema
 * with no mapping.
 */
export const faqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

/** Canonical FAQ item type — the single owner of the { question, answer } shape. */
export type FaqItem = z.infer<typeof faqItemSchema>;

export const faqSchema = z.object({
  heading: z.string().min(1),
  items: z.array(faqItemSchema).min(1).max(10),
});

// --- Final CTA -------------------------------------------------------------

export const finalCtaSchema = z.object({
  heading: z.string().min(1),
  text: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  image: imageReferenceSchema.optional(),
});

// --- Route card (links to another route) -----------------------------------

export const routeCardSchema = z.object({
  routeKey: routeKeyEnum,
  title: z.string().min(1),
  text: z.string().min(1).optional(),
  image: imageReferenceSchema.optional(),
  ctaLabel: z.string().min(1),
});

// --- Re-exports for pages.ts -----------------------------------------------

export { routeKeyEnum, vehicleIdEnum, clientIdEnum };
