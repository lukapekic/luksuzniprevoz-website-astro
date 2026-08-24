/**
 * Container variant definitions — local to the luksuzni site.
 *
 * Overrides the core re-export. The core containerVariants is written against
 * reference-site token names (--container-sm/md/lg/xl, --gutter-md) that do not
 * exist in this site's locked theme, so the re-export resolved to nothing. This
 * local override keeps the shared `variants()` engine but supplies complete
 * static class strings built only on the locked Luxury Transportation layout
 * tokens (DESIGN.md §13, design-foundation-governance.md §13).
 *
 * Width axis maps the semantic container roles to their tokens:
 *   main     → --container-main   (~1280px, page-wide content cap)
 *   reading  → --container-reading (~920px,  prose / body measure)
 *   narrow   → --container-narrow  (~736px,  compact forms / captions)
 *   full     → no cap
 *
 * Containers own the horizontal gutter + max-width + centering ONLY. They carry
 * no surface, no vertical rhythm, no radius — that is Section's job
 * (design-foundation-governance.md §6/§11). A container composes cleanly inside
 * a <Section>: Section provides py + optional surface; the container provides
 * px-[var(--gutter-page)] and the width cap. class passthrough is layout-only
 * (FND-UI-06). CSS logical properties only (FND-I18N-13).
 */
import { variants } from "@astro-foundation/core/ui";

export const containerVariants = variants({
  base: "mx-auto w-full px-[var(--gutter-page)]",
  axes: {
    width: {
      main: "max-w-[var(--container-main)]",
      reading: "max-w-[var(--container-reading)]",
      narrow: "max-w-[var(--container-narrow)]",
      full: "max-w-full",
    },
  },
  defaults: {
    width: "main",
  },
});
