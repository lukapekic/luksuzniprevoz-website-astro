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
 *   - restrained graphite gradient (Final-CTA-only exception);
 *   - CTA hierarchy: primary Book (platinum accent cta link) > secondary Request a Quote
 *     (outlined button link) > tertiary phone/email (muted text links — ONE
 *     phone + ONE email only; WhatsApp is intentionally not rendered here,
 *     task 2D);
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
// <Image> for imported assets (responsive srcset delivery). In this Astro
// version (5.18.2) the canonical export lives on the `astro` package entry
// (astro/dist/index.d.ts re-exports it from types/public → assets/types), NOT
// on the `astro:assets` virtual module — so the type is imported from
// `"astro"`. `import type` is erased at compile time — no runtime/bundle
// coupling; only the type is used. (Earlier this file anchored the type via a
// fixture-asset type-only import; task 6A replaced that with the canonical
// Astro export.)
import type { ImageMetadata } from "astro";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

// ImageMetadata (typeof an imported image asset) — see the comment above the
// import. `import type` is erased at compile time; only the type is used.
type FinalCtaImage = ImageMetadata;

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
 *  renders ONE phone + ONE email only (task 2D) — WhatsApp is intentionally
 *  not rendered here (it stays available in the SiteFooter contact column and
 *  the home FinalCTA adapter, gated via contact.ts). Absent channels are
 *  omitted; the caller passes only verified channels. */
export interface FinalCtaContacts {
  phone?: string;
  email?: string;
}

export interface FinalCTAProps {
  /** H2 heading text (localized, from caller). */
  heading: string;
  /** Short supporting paragraph (localized, from caller). */
  description?: string;
  /** Primary conversion action — Book (platinum accent <Link variant="cta">). Required. */
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
  /** Optional semantic media treatment; integrated blends full-bleed media into the panel. */
  mediaTreatment?: "default" | "integrated";
  /** Current locale — passed to <Link> for localized route resolution. */
  locale?: LocaleCode;
  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
