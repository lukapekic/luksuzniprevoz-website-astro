/**
 * HomepageHero — homepage hero panel (homepage-specific component).
 *
 * Presentation-only: all copy, links, and imagery arrive via props
 * (component-architecture.md §18 — the component owns NO copy). One known
 * composition — a contained cinematic photographic panel — there are no slots
 * for arbitrary hero layouts and no generalized `Hero`/`ImageTextPanel`
 * (component-architecture.md §25; blueprint §7).
 *
 * Contract: docs/home/home-components/03-home-hero.md (exact V1 spec)
 * Blueprint: docs/home/reference/blueprint.md §7 (Hero)
 * Tokens: docs/home/home-components/00-token-matrix.md (locked color/space/radius)
 *
 * The hero `title` IS the page's single <h1> (blueprint §18 — exactly one
 * meaningful page H1 in Hero). Copy + CTAs + support text + image all arrive
 * via props; the component embeds no production copy (FND-ARCH-03).
 *
 * Routing mirrors shared/FinalCTA + shared/ServiceCard: internal CTAs pass
 * `to: RouteKey` so the foundation <Link> resolves via getPath
 * (FND-I18N-03 — never manual URLs); flow/external targets pass a
 * pre-resolved `href` (the caller runs resolveCtaHref). The component is
 * intentionally NOT coupled to the content-model `Cta` union, so it stays
 * reusable on pages that don't use the editorial content model.
 *
 * `supportText` is OPTIONAL only because the editorial hero block does not
 * yet author a right-side statement (blueprint §20 — pending content pass).
 * When supplied, the desktop 7/5 split activates and the right-side support
 * statement renders (blueprint §7 / 03-home-hero §Desktop content grid);
 * when absent the hero degrades to a single left content column. The support
 * composition is fully implemented and exercised in /dev/ui.
 */
// `ImageMetadata` is the type returned by ESM imports of image assets
// (`import x from "./car.webp"`) and the `src` shape accepted by astro:assets
// <Image> for imported assets (responsive srcset delivery). It is bound by the
// ambient `*.webp` module declarations in Astro's client types but is NOT
// re-exported by the `astro:assets` module in this Astro version, so it is
// anchored here via a type-only import of a representative asset. `import type`
// is erased at compile time — there is no runtime or bundle coupling to this
// file; only its inferred type (`ImageMetadata`) is used. Mirrors
// shared/FinalCTA.types.ts / shared/ServiceCard.types.ts.
import type sampleAsset from "../../assets/hero.webp";
import type { LocaleCode, RouteKey } from "@astro-foundation/core";

// `ImageMetadata` (typeof an imported image asset) — see the comment above the
// import. `import type` is erased at compile time; only the inferred type is used.
type HomepageHeroImage = typeof sampleAsset;

/** A single CTA. Exactly one of `to` / `href` should be supplied by the caller. */
export interface HomepageHeroAction {
  /** Localized CTA label — from the caller, never hardcoded (FND-ARCH-03). */
  label: string;
  /** Internal route destination — <Link> resolves via getPath (FND-I18N-03). */
  to?: RouteKey;
  /** Pre-resolved href (flow target via resolveCtaHref, or external). Used when `to` is absent. */
  href?: string;
}

export interface HomepageHeroProps {
  /** The page's single <h1> (localized, from caller). Left-aligned, semantic h1 role. */
  title: string;
  /** Short proposition / lede (localized, from caller). ~2–3 desktop lines. */
  description?: string;
  /** Primary conversion action — Book (gold-... platinum <Link variant="cta">). Required. */
  primaryAction: HomepageHeroAction;
  /**
   * Secondary conversion action — the locked hero composition's "Request a Quote"
   * (<Link variant="button">). Optional ONLY because the editorial hero block does
   * not yet author the final secondary: the current `secondaryCta` is "View fleet"
   * → fleet, which is NOT the final approved secondary hero action, and is wired
   * only as temporary compatibility (see [locale]/index.astro). Do NOT treat "View
   * fleet" as the final secondary.
   *
   * TODO(home-visual-lock): promote `secondaryAction` to required once the
   *   editorial home content authors the final "Request a Quote" secondary.
   */
  secondaryAction?: HomepageHeroAction;
  /**
   * Right-side supporting/trust statement (blueprint §7). Optional only while
   * the editorial hero block does not author it (heroSchema has no support field;
   * blueprint §20 — pending content pass); when supplied the 7/5 split activates.
   *
   * TODO(home-visual-lock): promote `supportText` to required once the editorial
   *   home content authors the right-side support statement.
   */
  supportText?: string;
  /** Full-bleed hero image — an imported ImageMetadata asset, rendered via astro:assets <Image>. */
  image: HomepageHeroImage;
  /** Alt text; empty string (default) = decorative atmosphere behind the H1/copy. */
  imageAlt?: string;
  /** Current locale — passed to <Link> for localized route resolution. */
  locale?: LocaleCode;
  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
