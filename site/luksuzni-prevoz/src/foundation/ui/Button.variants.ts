/**
 * Button variant definitions — local to the luksuzni site.
 *
 * The core `@astro-foundation/core/ui` buttonVariants is written against the
 * legacy token names (--accent-primary, --radius-lg, --focus-ring …),
 * which do not exist in this site's locked theme, so the re-exported map
 * resolved to nothing. This local override keeps the shared `variants()` engine
 * but supplies complete static class strings built only on the locked Luxury
 * Transportation tokens.
 *
 * Roles (locked CTA hierarchy, FND-UI-03 / DESIGN.md §8):
 *   primary   → highest-emphasis action (Book). Platinum accent surface, dark text.
 *   secondary → supporting action (Request a Quote). Dark elevated surface.
 *
 * No ghost/outline/tertiary variants — added only when a blueprint requires one
 * (component-architecture.md §13). No scale/bounce hover; color shift only
 * (design-foundation-governance.md §18). Min 44×44 target (FND-A11Y-05).
 * class passthrough is layout-only (FND-UI-06). Logical properties only.
 */
import { variants } from "@astro-foundation/core/ui";

export const buttonVariants = variants({
  base: [
    "inline-flex items-center justify-center gap-[var(--space-2)]",
    "min-h-11 min-w-11",
    "rounded-[var(--radius-control)]",
    "font-body font-semibold",
    "text-[length:var(--text-ui)] tracking-[var(--letter-spacing-ui)] leading-none",
    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-dark)]",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ].join(" "),
  axes: {
    variant: {
      // Platinum accent is the primary CTA surface (design-foundation-governance.md §5).
      // Dark text on accent is required for contrast.
      primary:
        "bg-[var(--color-accent)] text-[var(--color-text-on-light)] enabled:hover:bg-[var(--color-accent-hover)] enabled:active:bg-[var(--color-accent)]",
      secondary:
        "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-solid border-[var(--color-border-subtle)] enabled:hover:bg-[var(--color-surface)] enabled:hover:border-[var(--color-input-border)] enabled:active:bg-[var(--color-surface)]",
    },
    size: {
      sm: "px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--text-sm)]",
      md: "px-[var(--space-4)] py-[var(--space-3)]",
      lg: "px-[var(--space-6)] py-[var(--space-4)] text-[length:var(--text-lg)]",
    },
  },
  defaults: {
    variant: "primary",
    size: "md",
  },
});
