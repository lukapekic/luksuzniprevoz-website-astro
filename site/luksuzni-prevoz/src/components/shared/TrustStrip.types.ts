/**
 * TrustStrip — reusable compact confidence checkpoint (shared section-pattern).
 *
 * Presentation-only: all copy arrives via `items` (component-architecture §18
 * — the component owns NO copy). The item shape is the canonical `{ title, text }`
 * owned by `textItemSchema` in `src/content/schemas/shared.ts` — the same schema
 * that validates home `trust.items` and `process.steps` — inferred here so one
 * shape owner feeds the visible component with no manual duplicate (FND-ARCH-03,
 * mirroring FAQ's `FaqItem` import). `textItemSchema` has no exported TS alias
 * (unlike `faqItemSchema`), and the schema file is outside this task's scope, so
 * the alias is derived locally via `z.infer` instead of re-exported from
 * `shared.ts`. `import type` is erased at compile time — there is no runtime or
 * bundle coupling to the schema module, and no circular import.
 *
 * `textItemSchema` is `{ title: string; text: string }` (both required, no
 * `icon`, no `description`). The locked TrustStrip visual direction allows a
 * small *restrained accent marker* (07-trust-strip.md §Icon) — a single
 * decorative platinum accent check applied uniformly per item, not a data-driven icon key
 * (there is no icon system to resolve a key against, and the content model
 * authors no icon field). So the presentation API carries no `icon` prop: the
 * marker is purely decorative presentation, `aria-hidden` (see TrustStrip.astro).
 */

import type { z } from "astro:content";
import type { textItemSchema } from "../../content/schemas/shared.ts";

/** Canonical trust item — the single { title, text } shape owned by textItemSchema. */
export type TrustItem = z.infer<typeof textItemSchema>;

export interface TrustStripProps {
  /** Trust items, rendered in the order given. TrustStrip is intentionally a
   *  FIXED four-item pattern: the locked responsive divider design is built
   *  around exactly 4 (4 stacked on mobile → 2×2 on tablet → 4 columns on
   *  desktop), and the canonical content contract confirms it — home
   *  `trust.items` is `z.array(textItemSchema).length(4)`. The component
   *  asserts `items.length === 4` at render/build time and throws on any other
   *  count, so a malformed divider layout is never silently produced. The
   *  array type is kept (not a 4-tuple) so Zod-validated `TrustItem[]` content
   *  passes through with no cast or awkward adapter; the count is enforced at
   *  the render boundary where the content contract and the visual contract
   *  already agree on 4. */
  items: TrustItem[];
  /** Surface the panel sits on — drives panel bg, text, and divider color
   *  (default "dark" → elevated dark panel; "light" → light-neutral panel with
   *  on-light text + color-mix divider, mirroring <FAQ>/<SectionHeading>). */
  on?: "dark" | "light";
  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
