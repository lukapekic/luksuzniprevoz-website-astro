import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { pageSchema } from "./content/schemas/pages";

// Editorial content layer — one build-time collection, `pages`.
//
// The loader globs Markdown recursively, so both the per-page folder layout
// (pages/<routeKey>/<locale>.md) and a flat layout are discovered. Authoritative
// identity is the frontmatter `routeKey` + `locale`, never the file path.
//
// The schema is the discriminated union of seven page archetypes (see
// ./content/schemas/pages.ts). Astro validates frontmatter against it at
// `astro sync`; content:validate adds the cross-artifact checks (route binding,
// pageType ↔ route kind, lifecycle, parity, cross-ref resolution).
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: pageSchema,
});

export const collections = { pages };
