/**
 * HorizontalCarousel — public API types.
 *
 * Reusable horizontal-carousel MECHANICS only (component-architecture.md §16).
 * Owns: horizontal overflow viewport, scroll snapping, previous/next controls,
 * responsive item sizing, instance isolation, reduced motion, and progressive
 * enhancement. It does NOT know what a vehicle or a review is — callers supply
 * their own cards as slotted `<li>` children.
 *
 * Future consumers: FleetShowcase (itemSize "compact"), GoogleReviews
 * (itemSize "standard"). The component imports neither.
 *
 * The API is intentionally small. This is not Swiper — there is no autoplay,
 * loop, speed, slidesPerView, centerMode, dots, pagination, animation, or
 * drag-sensitivity knob (locked design contract, design-foundation-governance.md
 * §16: understated carousel transitions, no autoplay).
 */

/** Item-width preset. Only two presets — no arbitrary widths. */
export type CarouselItemSize = "standard" | "compact";

export interface HorizontalCarouselProps {
  /**
   * Stable, page-unique instance id. REQUIRED (hard contract) because multiple
   * carousels (Fleet, Reviews) later coexist on the same page. Used to scope
   * aria-controls relationships and for dev/debugging. Do NOT generate random
   * ids at runtime — the caller is responsible for uniqueness.
   */
  id: string;

  /**
   * Localized accessible name for the carousel list (e.g. "Fleet vehicles",
   * "Guest reviews"). The site is multilingual (sr/en/ru), so the component
   * hardcodes NO UI strings — every visible/accessible label comes via props.
   */
  ariaLabel: string;

  /** Localized accessible name for the previous control (e.g. "Previous"). */
  previousLabel: string;

  /** Localized accessible name for the next control (e.g. "Next"). */
  nextLabel: string;

  /**
   * Item-width preset. "standard" → content/review cards; "compact" → fleet/
   * visual cards. Maps to internal fluid width tokens (see scoped CSS). The
   * width stays responsive (mobile peek → tablet 1.5–2 → desktop 2.5–3).
   * Defaults to "standard".
   */
  itemSize?: CarouselItemSize;

  /** Layout-only class passthrough (FND-UI-06). */
  class?: string;
}
