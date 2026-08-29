/**
 * Google Reviews — MOCK DEVELOPMENT DATA adapter. FND-ARCH-03 / FND-TYPE-02.
 *
 * Until the owner's real Google Reviews package lands, the review dataset is a
 * LOCAL mocked JSON fixture shaped like the Google Places API (New) Place
 * response (src/data/fixtures/google-place-reviews.mock.json). This module is
 * the SINGLE boundary that normalizes that raw external-API shape into the
 * stable ReviewViewModel / ReviewsSummaryViewModel the UI consumes, so the
 * future package can replace the fixture + this adapter's INPUT without
 * touching ReviewCard / ReviewsShowcase (the view models are the contract).
 *
 * MOCK DEVELOPMENT DATA — replace with the future reviews package. The fixture
 * is synthetic only (mock IDs, mock Google URLs, fabricated review text); no
 * entry is an actual customer review and no mock URL is a verified production
 * Google destination.
 *
 * No Zod: the fixture is trusted LOCAL development data (a versioned source
 * file, not untrusted runtime input), so typing + a module-load structural guard
 * is the validation — the same pattern as fleet.ts / services.ts / contact.ts.
 * The future LIVE package will own its own boundary validation for genuinely
 * untrusted Places API responses (the view models stay unchanged).
 *
 * Localized review text is NOT translated per page locale (an external Google
 * review keeps its own language); only the UI chrome (heading, CTA, carousel
 * controls, rating unit) is localized via content/ui/*.json in the components.
 *
 * External-link safety (task §22): the place-level Google Maps URL surfaced by
 * getReviewsSummary() is the MOCK fixture URL for structural testing only. The
 * page wires the verified production URL (contact.office.googleMapsUrl) and lets
 * it take precedence; only when that is absent does the mock URL render, and the
 * mock URL is an obviously-fake path so it can never be mistaken for a verified
 * production Google Business profile.
 */
import rawMock from "./fixtures/google-place-reviews.mock.json";

// --- Raw Google Places (New) Place shape (subset relevant to the UI) ---------

/** Localized text wrapper used by the Places API for review text/name. */
export interface GooglePlaceLocalizedText {
  text: string;
  languageCode?: string | null;
}

/** Author attribution attached to a Places review. */
export interface GoogleAuthorAttribution {
  displayName: string;
  uri?: string | null;
  photoUri?: string | null;
}

/** A single review as returned by the Places API (New). */
export interface GooglePlaceReview {
  name: string;
  relativePublishTimeDescription?: string | null;
  text: GooglePlaceLocalizedText;
  originalText?: GooglePlaceLocalizedText | null;
  rating: number;
  authorAttribution: GoogleAuthorAttribution;
  publishTime?: string | null;
  googleMapsUri?: string | null;
}

/** The Place-level response carrying the review set + place summary. */
export interface GooglePlaceReviewsResponse {
  id: string;
  displayName: GooglePlaceLocalizedText;
  rating?: number | null;
  userRatingCount?: number | null;
  googleMapsUri?: string | null;
  reviews: GooglePlaceReview[];
}

// --- Stable internal UI view models (the future package targets these) -------
//
// ReviewCard / ReviewsShowcase consume ONLY these clean models — never the raw
// Google field names (no authorAttribution / originalText / googleMapsUri leak
// into markup). The normalizer below is the only place that knows the raw shape.

export interface ReviewViewModel {
  /** Stable, safe id (derived from the review `name`, never user-supplied raw). */
  id: string;
  authorName: string;
  authorProfileUrl: string | null;
  authorPhotoUrl: string | null;
  /** Integer rating 1–5 (clamped + rounded from the raw value). */
  rating: number;
  /** Displayable/localized review text (preferred over originalText). */
  text: string;
  /** Original-language text when it differs from `text`; null otherwise. */
  originalText: string | null;
  languageCode: string | null;
  relativeTime: string | null;
  publishedAt: string | null;
  googleMapsUrl: string | null;
}

export interface ReviewsSummaryViewModel {
  placeName: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUrl: string | null;
  reviews: ReviewViewModel[];
}

const mockResponse = rawMock as GooglePlaceReviewsResponse;

/** Clamp + round a raw rating into the 1–5 integer range the UI renders. */
function normalizeRating(raw: number | undefined | null): number {
  if (typeof raw !== "number" || Number.isNaN(raw)) return 5;
  const clamped = Math.min(5, Math.max(1, raw));
  return Math.round(clamped);
}

/** Derive a safe, stable id for a review (fallback when the raw `name` is bad). */
function normalizeReviewId(rawName: unknown, fallback: string): string {
  return typeof rawName === "string" && rawName.trim().length > 0 ? rawName.trim() : fallback;
}

/** Normalize one raw Places review into the stable UI view model. Handles
 *  optional fields, author fallback, rating normalization, and text selection
 *  (prefers `text.text` as the displayable text; keeps `originalText` only when
 *  its language differs from `text`). */
function normalizeReview(raw: GooglePlaceReview, index: number): ReviewViewModel {
  const author = raw.authorAttribution;
  const displayText = raw.text?.text?.trim() ?? "";
  const original = raw.originalText?.text?.trim() ?? "";
  const originalLang = raw.originalText?.languageCode ?? null;
  const textLang = raw.text?.languageCode ?? null;
  // Keep originalText only when it is a genuinely different-language source.
  const originalText = original.length > 0 && originalLang !== textLang ? original : null;

  return {
    id: normalizeReviewId(raw.name, `mock-review-${index + 1}`),
    authorName: author?.displayName?.trim() || "—",
    authorProfileUrl: author?.uri?.trim() || null,
    // Kept for the future avatar slot; ReviewCard renders no avatar today
    // (wireframe has none), so this is never requested at render time.
    authorPhotoUrl: author?.photoUri?.trim() || null,
    rating: normalizeRating(raw.rating),
    text: displayText,
    originalText,
    languageCode: textLang,
    relativeTime: raw.relativePublishTimeDescription?.trim() || null,
    publishedAt: raw.publishTime?.trim() || null,
    googleMapsUrl: raw.googleMapsUri?.trim() || null,
  };
}

/** Normalize the whole Places response into the stable summary view model. */
function normalizeReviews(raw: GooglePlaceReviewsResponse): ReviewsSummaryViewModel {
  return {
    placeName: raw.displayName?.text?.trim() || "—",
    rating: typeof raw.rating === "number" && !Number.isNaN(raw.rating) ? raw.rating : null,
    userRatingCount:
      typeof raw.userRatingCount === "number" && !Number.isNaN(raw.userRatingCount)
        ? raw.userRatingCount
        : null,
    googleMapsUrl: raw.googleMapsUri?.trim() || null,
    reviews: (raw.reviews ?? []).map(normalizeReview),
  };
}

// --- Module-load structural guard -------------------------------------------
//
// Trusted local fixture, so the guard is a structural sanity check (not Zod).
// It fails the build loudly if the fixture is malformed — no silent fallback
// that could mask broken mock data behind an empty carousel. Mirrors the
// assertXConsistency() pattern in fleet.ts / services.ts.
function assertReviewsMockConsistency(raw: GooglePlaceReviewsResponse): void {
  if (!raw || typeof raw !== "object") {
    throw new Error(
      "reviews.ts: google-place-reviews.mock.json is not an object — fixture is malformed.",
    );
  }
  if (!Array.isArray(raw.reviews) || raw.reviews.length === 0) {
    throw new Error(
      "reviews.ts: google-place-reviews.mock.json has no reviews[] — the Reviews carousel requires at least one mock review.",
    );
  }
  raw.reviews.forEach((review, i) => {
    if (!review?.authorAttribution?.displayName) {
      throw new Error(
        `reviews.ts: mock review #${i + 1} is missing authorAttribution.displayName — fixture is malformed.`,
      );
    }
    if (typeof review.rating !== "number" || review.rating < 1 || review.rating > 5) {
      throw new Error(
        `reviews.ts: mock review #${i + 1} has an out-of-range rating (${String(review.rating)}) — must be 1–5.`,
      );
    }
    if (!review.text?.text) {
      throw new Error(
        `reviews.ts: mock review #${i + 1} is missing text.text — fixture is malformed.`,
      );
    }
  });
}

assertReviewsMockConsistency(mockResponse);

const summary: ReviewsSummaryViewModel = normalizeReviews(mockResponse);

/**
 * The single entry point the page uses. The future real Google Reviews package
 * replaces the `rawMock` import + normalizer input (its own fetch + boundary
 * validation) but keeps returning the same ReviewsSummaryViewModel, so neither
 * ReviewCard nor ReviewsShowcase needs to change.
 *
 * MOCK DATA MODE: returns the normalized local mock fixture. Pure/synchronous
 * — no network, no caching, no auth.
 */
export function getReviewsSummary(): ReviewsSummaryViewModel {
  return summary;
}
