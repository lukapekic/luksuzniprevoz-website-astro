/**
 * FinalCTA — reusable closing conversion section (shared section-pattern).
 *
 * Presentation-only: all copy, links, and contacts arrive via props
 * (component-architecture.md §18 — the component owns NO copy). It composes the
 * approved foundation primitives (PageContainer / SectionHeading /
 * Link) and the locked Final-CTA contract
 * (docs/home/home-components/11-final-cta.md, DESIGN.md §7/§8):
 *
 *   - one full-width continuous photographic section with container-aligned copy;
 *   - content-driven height and a separate localized copy scrim;
 *   - CTA hierarchy: primary Book (platinum accent cta link) > secondary Request a Quote
 *     (outlined button link) > tertiary phone/email (muted text links — ONE
 *     phone + ONE email only);
 *   - a single approved contextual interior image from closing-media.ts;
 *   - <h2> (the page's single <h1> lives in the hero) — no second-hero scale.
 *
 * Reuses foundation routing types: internal CTAs pass `to: RouteKey` so <Link>
 * resolves via getPath (FND-I18N-03 — never manual URLs); flow/external targets
 * pass a pre-resolved `href` (the caller runs `resolveCtaHref`). The component
 * is intentionally NOT coupled to the content-model `Cta` union so it stays
 * reusable on pages that don't use the editorial content model.
 *
 * Contact hrefs (tel:/mailto:) are external contact points, not internal
 * routes — FND-I18N-03 scope is internal-route URLs. They are built from prop
 * values (identifier bindings) in the component frontmatter, not inline JSX.
 */
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

/** A single CTA. Exactly one of `to` / `href` should be supplied by the caller. */
export interface FinalCtaAction {
  /** Localized CTA label — from the caller, never hardcoded (FND-ARCH-03). */
  label: string;
  /** Internal route destination — <Link> resolves via getPath (FND-I18N-03). */
  to?: RouteKey;
  /** Pre-resolved href (flow target via resolveCtaHref, or external). Used when `to` is absent. */
  href?: string;
}

/** Tertiary contact paths for the FinalCTA visual-contact row. The component
 *  renders one verified phone and one verified email. Absent channels are
 *  omitted. */
export interface FinalCtaContacts {
  phone?: string;
  email?: string;
}

export interface FinalCTAProps {
  /** H2 heading text (localized, from caller). */
  heading: string;
  /** Short supporting paragraph (localized, from caller). */
  description?: string;
  /** Primary conversion action — Book (platinum accent <Link variant="cta">). Omit when its canonical destination is unresolved. */
  primaryAction?: FinalCtaAction | null;
  /** Secondary conversion action — Request a Quote (<Link variant="button">). */
  secondaryAction?: FinalCtaAction | null;
  /** Tertiary contact paths — restrained muted text links, subordinate to the CTAs. */
  contacts?: FinalCtaContacts;
  /** Current locale — passed to <Link> for localized route resolution. */
  locale?: LocaleCode;
  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
