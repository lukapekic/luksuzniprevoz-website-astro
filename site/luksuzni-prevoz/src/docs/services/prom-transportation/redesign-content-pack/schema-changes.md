# Prom Transportation V2 — Schema Changes

**Required schema changes: NONE.**

The current `servicePageSchema` already supports the full Prom V2 shape:

- Hero;
- overview with principle items;
- keyed editorial sections;
- section items;
- optional section CTA;
- vehicle recommendations;
- FAQ;
- Final CTA.

The existing CTA target schema already supports booking/quote flows.

Do not add layout, image-position, Prom/Wedding variant, color, theme or component-choice fields to content. Contextual image selection remains blueprint/implementation-owned through static Astro imports.
