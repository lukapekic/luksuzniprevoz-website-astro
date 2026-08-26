import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { pageSchema } from "./content/schemas/pages";

const pages = defineCollection({
  loader: glob({
    base: "./src/content/pages",
    pattern: "**/*.{md,mdx}",
  }),
  schema: pageSchema,
});

export const collections = { pages };
