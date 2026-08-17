import { z } from "astro/zod";
import {
  basePageFields, ctaSchema, editorialSectionSchema, faqSchema,
  finalCtaSchema, imageReferenceSchema, sectionHeadingSchema, textItemSchema,
} from "./shared";

const routeCardSchema = z.object({
  routeKey: z.string().min(1),
  title: z.string().min(1),
  text: z.string().min(1).optional(),
  image: imageReferenceSchema.optional(),
  ctaLabel: z.string().min(1),
});

export const homePageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("home"),
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

export const servicePageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("service"),
  overview: z.object({
    heading: sectionHeadingSchema,
    body: z.string().min(1),
    items: z.array(z.string().min(1)).optional(),
  }),
  sections: z.array(editorialSectionSchema).max(8).default([]),
  vehicleRecommendations: z.object({
    heading: sectionHeadingSchema,
    vehicleIds: z.array(z.string().min(1)).min(1).max(4),
    cta: ctaSchema,
  }).optional(),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const hubPageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("hub"),
  overview: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  childServices: z.object({
    heading: sectionHeadingSchema,
    items: z.array(routeCardSchema).min(2),
  }),
  sections: z.array(editorialSectionSchema).max(8).default([]),
  vehicleRecommendations: z.object({
    heading: sectionHeadingSchema,
    vehicleIds: z.array(z.string().min(1)).min(1).max(4),
    cta: ctaSchema,
  }).optional(),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const fleetPageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("fleet"),
  intro: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  fleetSection: z.object({
    heading: sectionHeadingSchema.optional(),
    vehicleIds: z.array(z.string().min(1)).min(1),
  }),
  sections: z.array(editorialSectionSchema).max(6).default([]),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const pricingPageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("pricing"),
  intro: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  pricing: z.object({ heading: sectionHeadingSchema, source: z.literal("pricing-data") }),
  sections: z.array(editorialSectionSchema).max(6).default([]),
  faq: faqSchema.optional(),
  finalCta: finalCtaSchema,
});

export const aboutPageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("about"),
  story: z.object({
    heading: sectionHeadingSchema,
    body: z.string().min(1),
    image: imageReferenceSchema.optional(),
  }),
  sections: z.array(editorialSectionSchema).max(8).default([]),
  clients: z.object({
    heading: sectionHeadingSchema,
    clientIds: z.array(z.string().min(1)).min(1),
  }).optional(),
  finalCta: finalCtaSchema,
});

export const contactPageSchema = z.object({
  ...basePageFields,
  pageType: z.literal("contact"),
  intro: z.object({ heading: sectionHeadingSchema, body: z.string().min(1) }),
  contact: z.object({
    source: z.literal("contact-data"),
    formHeading: z.string().min(1),
    formIntro: z.string().min(1).optional(),
  }),
});

export const pageSchema = z.discriminatedUnion("pageType", [
  homePageSchema, servicePageSchema, hubPageSchema, fleetPageSchema,
  pricingPageSchema, aboutPageSchema, contactPageSchema,
]);
