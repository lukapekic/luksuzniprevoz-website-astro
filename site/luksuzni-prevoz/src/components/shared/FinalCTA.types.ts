/**
 * FinalCTA — reusable closing conversion section (shared section-pattern).
 *
 * Presentation-only: all copy, links, contacts, and imagery arrive via props
 * (component-architecture.md §18 — the component owns NO copy). It composes the
 * approved foundation primitives (Section / PageContainer / SectionHeading /
 * Link) and the locked Final-CTA contract
 * (docs/home/home-components/11-final-cta.md, DESIGN.md §7/§8):
 *
 *   - contained architectural panel, content left, vehicle image right;
 *   - desktop 62/38 content/image, 22–26rem panel;
 *   - warm-charcoal → warm-brown restrained gradient (Final-CTA-only exception);
 *   - CTA hierarchy: primary Book (gold cta link) > secondary Request a Quote
 *     (outlined button link) > tertiary phone/email/WhatsApp (muted text links);
 *   - right-zone vehicle blended on the panel, no hard edge, not a bordered
 *     card; object-contain for transparent cutouts, object-cover for
 *     contextual photos;
 *   - <h2> (the page's single <h1> lives in the hero) — no second-hero scale.
 *
 * Reuses foundation routing types: internal CTAs pass `to: RouteKey` so <Link>
 * resolves via getPath (FND-I18N-03 — never manual URLs); flow/external targets
 * pass a pre-resolved `href` (the caller runs `resolveCtaHref`). The component
 * is intentionally NOT coupled to the content-model `Cta` union so it stays
 * reusable on pages that don't use the editorial content model.
 *
 * Contact hrefs (tel:/mailto:/wa.me) are external contact points, not internal
 * routes — FND-I18N-03 scope is internal-route URLs. They are built from prop
 * values (identifier bindings) in the component frontmatter, not inline JSX.
 */
// `ImageMetadata` is the type returned by ESM imports of image assets
// (`import x from "./car.webp"`) and the `src` shape accepted by astro:assets
// <Image> for imported assets (responsive srcset delivery). It is bound by the
// ambient `*.webp` module declarations in Astro's client types but is NOT
// re-exported by the `astro:assets` module in this Astro version, so it is
// anchored here via a type-only import of a representative asset. `import type`
// is erased at compile time — there is no runtime or bundle coupling to this
// file; only its inferred type (`ImageMetadata`) is used.
import type sampleAsset from "../../assets/final-cta-bg.webp";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

// `ImageMetadata` (typeof an imported image asset) — see the comment above the
// import. `import type` is erased at compile time; only the inferred type is used.
type FinalCtaImage = typeof sampleAsset;

/** A single CTA. Exactly one of `to` / `href` should be supplied by the caller. */
export interface FinalCtaAction {
  /** Localized CTA label — from the caller, never hardcoded (FND-ARCH-03). */
  label: string;
  /** Internal route destination — <Link> resolves via getPath (FND-I18N-03). */
  to?: RouteKey;
  /** Pre-resolved href (flow target via resolveCtaHref, or external). Used when `to` is absent. */
  href?: string;
}

/** Tertiary contact paths. Any combination may be supplied; absent ones are omitted. */
export interface FinalCtaContacts {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

export interface FinalCTAProps {
  /** H2 heading text (localized, from caller). */
  heading: string;
  /** Short supporting paragraph (localized, from caller). */
  description?: string;
  /** Primary conversion action — Book (gold <Link variant="cta">). Required. */
  primaryAction: FinalCtaAction;
  /** Secondary conversion action — Request a Quote (<Link variant="button">). */
  secondaryAction?: FinalCtaAction;
  /** Tertiary contact paths — restrained muted text links, subordinate to the CTAs. */
  contacts?: FinalCtaContacts;
  /** Right-zone vehicle image. Transparent cutout → contain; contextual photo → cover. */
  image?: FinalCtaImage;
  /** Alt text; empty string (default) = decorative marketing imagery. */
  imageAlt?: string;
  /** object-fit: "contain" (default — locked S-Class cutout intent) | "cover" (contextual photo). */
  imageFit?: "contain" | "cover";
  /** Current locale — passed to <Link> for localized route resolution. */
  locale?: LocaleCode;
  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
