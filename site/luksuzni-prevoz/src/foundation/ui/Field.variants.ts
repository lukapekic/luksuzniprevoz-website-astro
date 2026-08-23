/**
 * Field variant definitions — local to the luksuzni site.
 *
 * Overrides the core re-export. The core fieldVariants size axis used
 * `text-[var(--text-sm)]` which Tailwind v4 compiles to `color` (untyped
 * arbitrary `text-[…]` defaults to color, not font-size) — a latent bug. This
 * override keeps the field as a layout wrapper (label → control → hint/error
 * stack) and fixes sizing via the length type hint.
 *
 * Field is a light-surface form primitive: labels/hints/errors consume the
 * on-light token family. class passthrough is layout-only (FND-UI-06).
 */
import { variants } from "@astro-foundation/core/ui";

export const fieldVariants = variants({
  base: "flex flex-col gap-[var(--space-2)]",
  axes: {
    size: {
      sm: "text-[length:var(--text-sm)]",
      md: "",
      lg: "text-[length:var(--text-lg)]",
    },
  },
  defaults: {
    size: "md",
  },
});
