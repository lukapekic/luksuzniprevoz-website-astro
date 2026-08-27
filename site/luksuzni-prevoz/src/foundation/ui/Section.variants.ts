/**
 * Section variant definitions — local to the luksuzni site.
 *
 * Section owns VERTICAL section rhythm + optional semantic surface treatment.
 * It owns NO horizontal gutter / max-width / centering — that is the container's
 * job (PageContainer / ReadingContainer compose inside Section). It owns no
 * page-specific copy or imagery (design-foundation-governance.md §6/§11).
 *
 * Spacing axis — page-level rhythm tiers (spacing.json `section`), NOT internal
 * component gaps:
 *   compact   → --space-section-compact   clamp(3rem, 5vw, 4rem)
 *   standard  → --space-section-standard  clamp(4rem, 7vw, 6rem)
 *   feature   → --space-section-feature   clamp(5rem, 9vw, 8rem)
 *
 * Surface axis — the locked visual vocabulary ONLY (no theme matrix):
 *   open-dark       transparent; content sits on the page canvas. No fake
 *                   rounded container (design-foundation-governance.md §6).
 *   contained-dark  architectural panel on --color-surface, capped to
 *                   --container-main, centered, --radius-section (16px).
 *   elevated        same panel shape on --color-surface-elevated.
 *   light           light-neutral panel on --color-surface-light; flips the
 *                   inherited text color to --color-text-on-light so children
 *                   (headings, body) render legibly without per-element work.
 *
 * Contained/elevated/light panels are self-capping (max-w + mx-auto) so they
 * read as floating architectural panels on the page canvas; the caller still
 * nests a container for the horizontal gutter. Open sections have no radius.
 * Radius roles: section/hero/feature = 16px (§10); the 6px control radius is
 * never used here. class passthrough is layout-only (FND-UI-06). Logical
 * properties only (FND-I18N-13).
 */
import { variants } from "@astro-foundation/core/ui";

export const sectionVariants = variants({
  base: "w-full",
  axes: {
    spacing: {
      compact: "py-[var(--space-section-compact)]",
      standard: "py-[var(--space-section-standard)]",
      feature: "py-[var(--space-section-feature)]",
    },
    surface: {
      "open-dark": "",
      "contained-dark":
        "mx-auto max-w-[var(--container-main)] bg-[var(--color-surface)] rounded-[var(--radius-section)]",
      elevated:
        "mx-auto max-w-[var(--container-main)] bg-[var(--color-surface-elevated)] rounded-[var(--radius-section)]",
      light:
        "mx-auto max-w-[var(--container-main)] bg-[var(--color-surface-light)] text-[var(--color-text-on-light)] rounded-[var(--radius-section)]",
    },
  },
  defaults: {
    spacing: "standard",
    surface: "open-dark",
  },
});
