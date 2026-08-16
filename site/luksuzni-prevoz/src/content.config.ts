import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { BaseContentSchema, BaseSeoSchema } from "@astro-foundation/core/content";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: BaseContentSchema.merge(BaseSeoSchema).extend({
    h1: z.string().min(1),
    intro: z.string().optional(),
    sections: z
      .array(
        z.object({
          heading: z.string().optional(),
          body: z.string(),
        }),
      )
      .optional(),
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { pages };
