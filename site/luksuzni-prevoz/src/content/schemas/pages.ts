/**
 * Page archetype schemas — the editorial content model contract (FND-DATA-07).
 *
 * Seven explicit authored archetypes plus a strict empty scaffold shape,
 * composed as a discriminated union on `pageType`
 * rather than one giant schema with dozens of optional fields. Each archetype
 * extends the foundation's BaseContentSchema (identity + lifecycle) merged with
 * BaseSeoSchema (SEO) and a shared `h1` + `intro` (the generic renderer's
 * heading + lede contract), then adds its archetype-specific editorial fields.
 *
 * Editorial copy only — no operational facts, no URLs, no presentation. See
 * shared.ts for the separation contract and referential-integrity model.
 *
 * `pageType` ↔ route `kind` consistency is enforced by content:validate
 * (FND-DATA-09), not here: home/fleet/pricing/about/contact → kind:"page";
 * service → kind:"service"; hub → kind:"hub". The schema declares the page's
 * editorial shape; the route declares its structural kind; the validator
 * asserts they agree.
 */
import { z } from "astro:content";
import { BaseContentSchema, BaseSeoSchema } from "@astro-foundation/core/content";
import {
  ctaSchema,
  heroSchema,
  imageReferenceSchema,
  sectionHeadingSchema,
  textItemSchema,
  editorialSectionSchema,
  faqSchema,
  finalCtaSchema,
  routeCardSchema,
  vehicleIdEnum,
  clientIdEnum,
} from "./shared.ts";

/**
 * Fields shared by every archetype: identity + lifecycle (BaseContentSchema),
 * SEO (BaseSeoSchema), and the generic renderer's heading (`h1`) + lede
 * (`intro`, a string — never the proposal's object-intro, which gets a distinct
 * field name per archetype to keep `content.data.intro` a string everywhere).
 *
 * `h1` is optional: archetypes with a hero render `hero.title` as the page's
 * single <h1>, so hero-bearing pages omit `h1`. Pages without a hero set `h1`.
 */
const pageBase = BaseContentSchema.merge(BaseSeoSchema).extend({
  h1: z.string().min(1).optional(),
  intro: z.string().optional(),
});

/**
 * Empty, non-indexable editorial placeholder. Scaffolds reserve every required
 * route/locale identity without fabricating copy. They render through the
 * dedicated ScaffoldPage and must be replaced by a full archetype entry before
 * publication.
 */
export const pageScaffoldSchema = BaseContentSchema.extend({
  pageType: z.literal("scaffold"),
  targetPageType: z.enum(["service", "hub", "fleet", "pricing", "about", "contact"]),
  scaffold: z.literal(true),
  status: z.literal("draft"),
  translationState: z.literal("missing"),
  noindex: z.literal(true),
});

/**
 * Homepage hero — the shared heroSchema with `supportText` REQUIRED. The
 * Homepage locks the 7/5 content split (blueprint §7 / 03-home-hero §Desktop
 * content grid), whose right column is the support/trust statement; every
 * locale authors it, so the field is required here. Other archetypes reuse the
 * shared heroSchema where supportText stays optional (they have no 7/5 split).
 */
const homeHeroSchema = heroSchema.extend({
  supportText: z.string().min(1),
});

export const homePageSchema = pageBase.extend({
  pageType: z.literal("home"),
  hero: homeHeroSchema,
  services: z.object({
    heading: sectionHeadingSchema,
    items: z.array(routeCardSchema).length(4),
  }),
  flagshipFeature: z.object({
    heading: sectionHeadingSchema,
    body: z.string().min(1),
    points: z.array(z.string().min(1)).optional(),
    image: imageReferenceSchema.optional(),
    cta: ctaSchema,
  }),
  trust: z.object({
    heading: sectionHeadingSchema.optional(),
    items: z.array(textItemSchema).length(4),
  }),
  fleet: z.object({ heading: sectionHeadingSchema, cta: ctaSchema }),
  process: z.object({
    heading: sectionHeadingSchema,
    steps: z.array(textItemSchema).length(3),
  }),
  reviews: z.object({
    heading: sectionHeadingSchema,
    externalProfileLabel: z.string().min(1),
  }),
  finalCta: finalCtaSchema,
});

export const servicePageSchema = pageBase.extend({
  pageType: z.literal("service"),
  hero: heroSchema.optional(),
  overview: z.object({
    heading: sectionHeadingSchema,
    body: z.string().min(1),
    items: z.array(z.string().min(1)).optional(),
  }),
  sections: z.array(editorialSectionSchema).max(8).default([]),
  vehicleRecommendations: z
    .object({
      heading: sectionHeadingSchema,
      vehicleIds: z.array(vehicleIdEnum).min(1).max(4),
      cta: ctaSchema,
    })
    .optional(),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const hubPageSchema = pageBase.extend({
  pageType: z.literal("hub"),
  hero: heroSchema.optional(),
  overview: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  childServices: z.object({
    heading: sectionHeadingSchema,
    items: z.array(routeCardSchema).min(2),
  }),
  sections: z.array(editorialSectionSchema).max(8).default([]),
  vehicleRecommendations: z
    .object({
      heading: sectionHeadingSchema,
      vehicleIds: z.array(vehicleIdEnum).min(1).max(4),
      cta: ctaSchema,
    })
    .optional(),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const fleetPageSchema = pageBase.extend({
  pageType: z.literal("fleet"),
  hero: heroSchema.optional(),
  introSection: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  fleetSection: z.object({
    heading: sectionHeadingSchema.optional(),
    vehicleIds: z.array(vehicleIdEnum).min(1),
  }),
  sections: z.array(editorialSectionSchema).max(6).default([]),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const pricingPageSchema = pageBase.extend({
  pageType: z.literal("pricing"),
  hero: heroSchema.optional(),
  introSection: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  pricing: z.object({ heading: sectionHeadingSchema, source: z.literal("pricing-data") }),
  sections: z.array(editorialSectionSchema).max(6).default([]),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const aboutPageSchema = pageBase.extend({
  pageType: z.literal("about"),
  hero: heroSchema.optional(),
  story: z.object({
    heading: sectionHeadingSchema,
    body: z.string().min(1),
    image: imageReferenceSchema.optional(),
  }),
  sections: z.array(editorialSectionSchema).max(8).default([]),
  clients: z
    .object({
      heading: sectionHeadingSchema,
      clientIds: z.array(clientIdEnum).min(1),
    })
    .optional(),
  finalCta: finalCtaSchema,
});

export const contactPageSchema = pageBase.extend({
  pageType: z.literal("contact"),
  hero: heroSchema.optional(),
  introSection: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  contact: z.object({
    source: z.literal("contact-data"),
    formHeading: z.string().min(1),
    formIntro: z.string().min(1).optional(),
  }),
});

const authoredPageSchema = z.discriminatedUnion("pageType", [
  homePageSchema,
  servicePageSchema,
  hubPageSchema,
  fleetPageSchema,
  pricingPageSchema,
  aboutPageSchema,
  contactPageSchema,
]);

export const pageSchema = z.union([pageScaffoldSchema, authoredPageSchema]);
