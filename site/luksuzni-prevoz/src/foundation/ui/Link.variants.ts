/**
 * Link variant definitions — local to the luksuzni site.
 *
 * Overrides the core re-export (which used legacy token names that do
 * not exist here). Uses the shared `variants()` engine with complete static
 * class strings on locked tokens. The Link primitive itself (Link.astro) owns
 * routing: internal links resolve via getPath() (FND-I18N-03); external links
 * get noopener/noreferrer; cross-locale links get hreflang/lang. These variants
 * only style the five legitimate link treatments — no open-ended matrix.
 *
 *   default → inline text/action link (accent, underline on hover)
 *   on-light → inline text/action link on a light semantic surface
 *   nav     → navigation link (Header/NavList)
 *   cta     → primary CTA link (platinum accent, button-shaped) for navigation CTAs
 *   button  → secondary CTA link (outlined, button-shaped)
 *
 * Links must stay distinguishable from <Button> (restrained color/underline,
 * no hidden full-card link pattern). Focus-visible is mandatory. No positional
 * movement on hover (design-foundation-governance.md §18).
 */
import { variants } from "@astro-foundation/core/ui";

export const linkVariants = variants({
  base: [
    "inline-flex min-h-11 items-center gap-[var(--space-2)]",
    "font-body",
    "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-dark)]",
  ].join(" "),
  axes: {
    variant: {
      default:
        "text-[length:var(--text-ui)] font-medium text-[var(--color-accent)] underline-offset-4 decoration-1 hover:text-[var(--color-accent-hover)] hover:underline",
      "on-light":
        "text-[length:var(--text-ui)] font-medium text-[var(--color-text-on-light)] underline underline-offset-4 decoration-1 hover:no-underline focus-visible:outline-[var(--color-focus-light)]",
      nav: "text-[length:var(--text-ui)] font-medium text-[var(--color-text-primary)] px-[var(--space-3)] py-[var(--space-2)] rounded-[var(--radius-control)] min-h-11 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-accent)]",
      cta:
        "min-h-11 px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-control)] font-semibold text-[length:var(--text-ui)] tracking-[var(--letter-spacing-ui)] leading-none bg-[var(--color-accent)] text-[var(--color-text-on-light)] hover:bg-[var(--color-accent-hover)]",
      button:
        "min-h-11 px-[var(--space-4)] py-[var(--space-3)] rounded-[var(--radius-control)] font-semibold text-[length:var(--text-ui)] tracking-[var(--letter-spacing-ui)] leading-none border border-solid border-[var(--color-border-subtle)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-input-border)]",
    },
    size: {
      sm: "text-[length:var(--text-sm)]",
      md: "",
      lg: "text-[length:var(--text-lg)]",
    },
  },
  defaults: {
    variant: "default",
    size: "md",
  },
});
