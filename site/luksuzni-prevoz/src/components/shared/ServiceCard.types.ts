/**
 * ServiceCard — reusable service-navigation card (shared component-pattern).
 *
 * Presentation-only: all copy, links, and imagery arrive via props
 * (component-architecture.md §18 — the component owns NO copy). One premium,
 * editorial service-navigation card vocabulary for later Homepage and
 * service-family compositions. This is NOT the homepage ServiceShowcase
 * (imagery-art-direction.md §8 — the full-card-image-over-scrim pattern is a
 * homepage-specific exception that must not be generalized to ServiceCard).
 *
 * Anatomy: ONE full-bleed 3:2 object-cover image (the card surface) + a
 * bottom-concentrated darkening scrim + overlaid title → one concise supporting
 * sentence → visible CTA anchored bottom-left. No separate body below the
 * image, no border, no shadow, no glass, no boxed dashboard appearance
 * (design-foundation-governance.md §8 card philosophy).
 *
 * Navigation: the CTA is the ONLY interactive element. Internal service pages
 * pass `to: RouteKey` so the foundation <Link> resolves via getPath
 * (FND-I18N-03 — never manual URLs); flow/external targets pass a pre-resolved
 * `href` (the caller runs resolveCtaHref), mirroring shared/FinalCTA. The card
 * itself is NOT a link — no whole-card anchor, no absolute invisible click
 * overlay, no JS click handler, no cursor:pointer on the card surface.
 *
 * Surface independence: the card owns its own full-bleed image + bottom dark
 * scrim, so it has a STABLE internal contrast environment and renders
 * unchanged on a dark OR light parent <Section>. There is therefore NO `on`
 * surface prop (the prior open-body implementation needed `on` only because text
 * sat directly on the parent page surface; the overlay design removes that
 * coupling — task §7/§8/§9).
 *
 * Image: an imported ImageMetadata asset rendered through astro:assets <Image>
 * (the approved pipeline — FND-IMG-08 only bans raw <img>/<picture>). The
 * foundation Image primitive types `src: string` and cannot accept an imported
 * ImageMetadata, so astro:assets <Image> is used directly, mirroring HomeHero /
 * FinalCTA. The whole card is 3:2 / object-cover — the locked service/card
 * image role (imagery-art-direction.md §1/§2/§3) applied to the entire card.
 *
 * Alt contract: the caller makes the accessibility decision. `imageAlt: ""` →
 * decorative (alt="" + role="presentation"); non-empty → informative image
 * with that alt. The title is never copied into alt automatically
 * (imagery-art-direction.md §19).
 */
// `ImageMetadata` is the type returned by ESM imports of image assets
// (`import x from "./car.webp"`) and the `src` shape accepted by astro:assets
// <Image> for imported assets. It is bound by the ambient `*.webp` module
// declarations in Astro's client types but is NOT re-exported by the
// `astro:assets` module in this Astro version, so it is anchored here via a
// type-only import of a representative asset. `import type` is erased at
// compile time — there is no runtime or bundle coupling to this file; only its
// inferred type (`ImageMetadata`) is used. Mirrors shared/FinalCTA.types.ts.
import type sampleAsset from "../../assets/hero.webp";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

// `ImageMetadata` (typeof an imported image asset) — see the comment above the
// import. `import type` is erased at compile time; only the inferred type is used.
type ServiceCardImage = typeof sampleAsset;

/**
 * Neutral Black & Platinum placeholder media — used when no photographic asset
 * is supplied yet (development/asset-gap phase). Each variant is a subtle
 * semantic-surface gradient so the four cards stay distinguishable by tone
 * alone, entirely inside the active theme (no raw colors, no gold/blue). The
 * media LAYER architecture is unchanged: the placeholder renders in the same
 * `.service-card__image` slot as a real `<Image>`, so swapping to real imagery
 * later is just passing `image` — no component rewrite (DESIGN.md §14: missing
 * assets do not authorize redesign).
 */
export type ServiceCardPlaceholder =
  | "graphite" // dark graphite (subtle)
  | "graphite-light" // slightly lighter graphite
  | "near-black-graphite" // near-black → graphite
  | "graphite-near-black"; // graphite → near-black

/** A single CTA. Exactly one of `to` / `href` should be supplied by the caller. */
export interface ServiceCardAction {
  /** Localized CTA label — from the caller, never hardcoded (FND-ARCH-03). */
  label: string;
  /** Internal route destination — <Link> resolves via getPath (FND-I18N-03). */
  to?: RouteKey;
  /** Pre-resolved href (flow target via resolveCtaHref, or external). Used when `to` is absent. */
  href?: string;
}

export interface ServiceCardProps {
  /** Service name (localized, from caller). Rendered as the card title. */
  title: string;
  /** One concise supporting sentence (localized, from caller). Wraps naturally. */
  description: string;
  /** Service image — an imported ImageMetadata asset, rendered via astro:assets <Image>.
   *  Optional: when absent, a neutral placeholder media layer renders instead (see `placeholder`). */
  image?: ServiceCardImage;
  /** Alt text; empty string = decorative (alt="" + role="presentation"). */
  imageAlt: string;
  /**
   * Neutral placeholder variant used when `image` is absent (asset-gap phase).
   * Ignored when `image` is supplied. Defaults to "graphite".
   */
  placeholder?: ServiceCardPlaceholder;
  /** Visible navigation CTA — the only interactive element on the card. */
  action: ServiceCardAction;
  /** Current locale — passed to <Link> for localized route resolution. */
  locale?: LocaleCode;
  /** Heading level (default 3 — the card normally sits beneath a section <h2>). */
  headingLevel?: 2 | 3;
  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
