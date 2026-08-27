/**
 * FleetShowcase — Homepage fleet showcase (V1.1).
 *
 * Presentation-only composition (blueprint §11 / 08-fleet-showcase). It owns NO
 * data and NO localization: the editorial heading/intro/CTA label arrive from
 * the canonical `fleet` block of the home content (homePageSchema `fleet: {
 * heading: sectionHeadingSchema, cta: ctaSchema }` in src/content/schemas/
 * pages.ts), and the per-vehicle presentation facts (display name, localized
 * class label, localized passenger-capacity text) arrive pre-resolved by the
 * page from canonical `src/data/fleet.ts` + the UI dictionary, so this
 * component never hardcodes vehicle identity, capacities, class labels, or
 * Serbian/English/Russian strings (FND-ARCH-03).
 *
 * Three concerns kept separate (08-fleet-showcase §Content/data boundaries):
 *   • editorial content  → heading + cta label (home content `fleet`)
 *   • vehicle facts      → vehicles (name/classLabel/passengerText) from fleet.ts
 *   • route destination  → cta.href resolved via resolveCtaHref in the page
 *
 * The shapes below mirror the canonical `sectionHeadingSchema` (heading) and
 * the `Vehicle` presentation projection (vehicles), matching the convention
 * HowItWorks.types.ts / PrivateChauffeurFeature.types.ts use for resolved props.
 */
import type { LocaleCode } from "@astro-foundation/core";
import type { ImageMetadata } from "astro";

/**
 * The editorial heading block: a title + an optional short intro. Structurally
 * identical to the canonical `sectionHeadingSchema` ({ title, intro? }).
 */
export interface FleetShowcaseHeading {
  /** Localized H2 heading title (fleet.heading.title). */
  title: string;
  /** Optional concise localized intro line (fleet.heading.intro). */
  intro?: string;
}

/**
 * Resolved section CTA: a localized label + a routing-helper-resolved href
 * (never a manual locale URL — FND-I18N-03). The page resolves the href via
 * resolveCtaHref(fleet.cta, locale) before passing it here.
 */
export interface FleetShowcaseCta {
  /** Localized CTA label (fleet.cta.label — e.g. "View fleet" / "Pogledaj vozila"). */
  label: string;
  /** Route-helper-resolved fleet page URL (resolveCtaHref → getPath). */
  href: string;
}

/**
 * One vehicle card's presentation facts — the page's projection of a
 * canonical `Vehicle` (src/data/fleet.ts) into display-only strings.
 *
 * `name` is `vehicle.displayName` verbatim (display names are NOT translated —
 * fleet.ts vocabulary). `classLabel` is the localized `vehicleClass` label from
 * the UI dictionary (`fleet.class.{sedan|van|minivan|bus}`). `passengerText` is
 * the localized capacity chip text and is set ONLY where
 * `vehicle.passengers !== null` — null capacities are omitted, never
 * fabricated as "0"/"N/A"/"unknown" (08-fleet-showcase §Forbidden; fleet.ts
 * comment).
 */
export interface FleetVehicle {
  /** Stable vehicle id (vehicle.id) — used as a render key only. */
  id: string;
  /** Display name, verbatim from fleet.ts (not translated). */
  name: string;
  /** Localized vehicle-class label (UI dictionary `fleet.class.*`). */
  classLabel: string;
  /**
   * Localized passenger-capacity chip text, only where passengers !== null
   * (e.g. "6 putnika" / "6 passengers" / "6 пассажиров"). Undefined for
   * null-capacity vehicles — the chip is simply not rendered.
   */
  passengerText?: string;
  /** Optional verified local presentation image; missing media keeps the neutral stage. */
  image?: ImageMetadata;
}

/** Localized carousel control/grouping labels (UI dictionary `fleet.carousel.*`). */
export interface FleetCarouselLabels {
  /** aria-label for the semantic <ul> grouping (fleet.carousel.ariaLabel). */
  ariaLabel: string;
  /** Previous control accessible name (fleet.carousel.previous). */
  previous: string;
  /** Next control accessible name (fleet.carousel.next). */
  next: string;
}

export interface FleetShowcaseProps {
  /** Editorial H2 heading block (fleet.heading — title + optional intro). */
  heading: FleetShowcaseHeading;
  /** Resolved section CTA (fleet.cta — label + href). */
  cta: FleetShowcaseCta;
  /** All canonical vehicles in declaration order (fleet.ts `vehicles`). */
  vehicles: FleetVehicle[];
  /** Localized carousel control/grouping labels (UI dictionary). */
  carouselLabels: FleetCarouselLabels;
  /** Current locale — forwarded to <Link> for localized route resolution. */
  locale: LocaleCode;
}
