import { z } from "astro/zod";

export const localeSchema = z.enum(["sr", "en", "ru"]);

export const seoSchema = z.object({
  title: z.string().min(20),
  description: z.string().min(50),
  noindex: z.boolean().default(false),
  ogTitle: z.string().min(1).optional(),
  ogDescription: z.string().min(1).optional(),
  ogImage: z.string().min(1).optional(),
});

export const actionTargetSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("route"), routeKey: z.string().min(1) }),
  z.object({ type: z.literal("flow"), flowKey: z.string().min(1) }),
]);

export const ctaSchema = z.object({
  label: z.string().min(1),
  target: actionTargetSchema,
});

export const imageReferenceSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  focalPoint: z.object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
  }).optional(),
});

export const heroSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  image: imageReferenceSchema.optional(),
});

export const sectionHeadingSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1).optional(),
});

export const textItemSchema = z.object({
  title: z.string().min(1),
  text: z.string().min(1),
});

export const editorialSectionSchema = z.object({
  key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
  heading: sectionHeadingSchema,
  body: z.string().min(1).optional(),
  items: z.array(textItemSchema).optional(),
  image: imageReferenceSchema.optional(),
  relatedRouteKeys: z.array(z.string().min(1)).optional(),
});

export const faqSchema = z.object({
  heading: z.string().min(1),
  items: z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
  })).min(1).max(10),
});

export const finalCtaSchema = z.object({
  heading: z.string().min(1),
  text: z.string().min(1),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema.optional(),
  image: imageReferenceSchema.optional(),
});

export const basePageFields = {
  routeKey: z.string().min(1),
  locale: localeSchema,
  seo: seoSchema,
  hero: heroSchema,
};
