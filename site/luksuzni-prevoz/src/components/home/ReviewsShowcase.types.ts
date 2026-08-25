/**
 * ReviewsShowcase — Homepage Google Reviews section props (FND-ARCH-03).
 *
 * Presentation-only: the showcase owns the section composition (heading row +
 * carousel) and maps the normalized ReviewViewModel[] to <li><ReviewCard>. It
 * holds NO review data of its own — the page passes the summary from
 * data/reviews.ts (getReviewsSummary) + the localized editorial heading/CTA.
 */
import type { ReviewViewModel } from "../../data/reviews.ts";
import type { LocaleCode } from "@astro-foundation/core";

/** Localized editorial heading for the section (entry.data.reviews.heading). */
export interface ReviewsHeading {
  title: string;
  intro?: string;
}

export interface ReviewsShowcaseProps {
  /** Section heading + short intro (from the per-locale home editorial content). */
  heading: ReviewsHeading;
  /** Localized external-profile CTA label (entry.data.reviews.externalProfileLabel). */
  profileLabel: string;
  /**
   * External Google Maps profile URL. Gated: when null/empty the section CTA is
   * NOT rendered (10-reviews.md — do not invent a verified URL). In MOCK DATA
   * MODE the page passes the mock place-level URL for structural testing; once
   * contact.office.googleMapsUrl is verified it takes precedence (see HomePage).
   */
  profileUrl: string | null;
  /** Normalized review entries (from getReviewsSummary().reviews). */
  reviews: ReviewViewModel[];
  /** Current locale — forwarded to <Link> + t() for localized chrome. */
  locale: LocaleCode;
  /** Layout-only class (FND-UI-06). */
  class?: string;
}
