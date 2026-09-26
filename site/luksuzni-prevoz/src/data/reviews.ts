/**
 * Google reviews data boundary. FND-ARCH-03 / FND-TYPE-02.
 *
 * Temporary manual snapshot transcribed from the owner's Google Maps screenshots.
 * See google-reviews.snapshot.json source metadata and docs/home/reviews-source.md.
 * Text is the English wording visible in the screenshots (including Google's
 * translations); original-language text and exact dates were not supplied.
 * Do not invent dates, author profile URLs, avatars, or individual review links.
 * Display text lives in content/reviews/{locale}.json. Serbian and Russian are
 * site translations of supplied English, not reconstructed Google originals.
 *
 * The trusted local snapshot is structurally checked below. A future API source
 * must validate untrusted responses while preserving the existing view models.
 */
import type { LocaleCode } from "@astro-foundation/core";
import { localeCodes } from "./locales.ts";
import rawSnapshot from "./google-reviews.snapshot.json" with { type: "json" };
import srContent from "../content/reviews/sr.json" with { type: "json" };
import enContent from "../content/reviews/en.json" with { type: "json" };
import ruContent from "../content/reviews/ru.json" with { type: "json" };

interface ReviewsLocaleContent {
  locale: string;
  reviews: Record<string, { text: string; excerpt?: string }>;
}

const localizedContent: Record<LocaleCode, ReviewsLocaleContent> = {
  sr: srContent,
  en: enContent,
  ru: ruContent,
};

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
  /** Optional verbatim excerpt; the full source text remains stored above. */
  displayExcerpt?: string;
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

const snapshotResponse = rawSnapshot satisfies GooglePlaceReviewsResponse;

/** Verified independently of unrelated office/contact facts. */
export const reviewsSourceVerified = rawSnapshot.source.verificationStatus === "verified";

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
  const displayText = raw.displayExcerpt?.trim() || raw.text?.text?.trim() || "";
  const original = raw.originalText?.text?.trim() ?? "";
  const originalLang = raw.originalText?.languageCode ?? null;
  const textLang = raw.text?.languageCode ?? null;
  // Keep originalText only when it is a genuinely different-language source.
  const originalText = original.length > 0 && originalLang !== textLang ? original : null;

  return {
    id: normalizeReviewId(raw.name, `review-${index + 1}`),
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
// Trusted local snapshot, so the guard is a structural sanity check (not Zod).
// It fails the build loudly if the snapshot is malformed — no silent fallback
// that could mask broken review data behind an empty carousel. Mirrors the
// assertXConsistency() pattern in fleet.ts / services.ts.
function assertReviewsConsistency(raw: GooglePlaceReviewsResponse): void {
  if (!raw || typeof raw !== "object") {
    throw new Error(
      "reviews.ts: google-reviews.snapshot.json is not an object — snapshot is malformed.",
    );
  }
  if (!Array.isArray(raw.reviews) || raw.reviews.length === 0) {
    throw new Error(
      "reviews.ts: google-reviews.snapshot.json has no reviews[] — the Reviews carousel requires at least one review.",
    );
  }
  raw.reviews.forEach((review, i) => {
    if (!review?.authorAttribution?.displayName) {
      throw new Error(
        `reviews.ts: review #${i + 1} is missing authorAttribution.displayName — snapshot is malformed.`,
      );
    }
    if (typeof review.rating !== "number" || review.rating < 1 || review.rating > 5) {
      throw new Error(
        `reviews.ts: review #${i + 1} has an out-of-range rating (${String(review.rating)}) — must be 1–5.`,
      );
    }
    if (!review.text?.text) {
      throw new Error(
        `reviews.ts: review #${i + 1} is missing text.text — snapshot is malformed.`,
      );
    }
  });
}

assertReviewsConsistency(snapshotResponse);

/** All configured locales must cover exactly the verified review IDs. */
function assertLocalizedReviewsConsistency(): void {
  const ids = new Set(snapshotResponse.reviews.map((review) => review.name));
  if (ids.size !== snapshotResponse.reviews.length) {
    throw new Error("reviews.ts: duplicate review IDs in the source snapshot.");
  }
  for (const locale of localeCodes) {
    const content = localizedContent[locale];
    if (!content || content.locale !== locale) {
      throw new Error(`reviews.ts: missing or mismatched review content for ${locale}.`);
    }
    const contentIds = Object.keys(content.reviews);
    if (contentIds.length !== ids.size || contentIds.some((id) => !ids.has(id))) {
      throw new Error(`reviews.ts: review ID parity failed for ${locale}.`);
    }
    for (const [id, review] of Object.entries(content.reviews)) {
      if (!review.text.trim() || (review.excerpt !== undefined && !review.excerpt.trim())) {
        throw new Error(`reviews.ts: empty review text or excerpt for ${locale}/${id}.`);
      }
      if (review.excerpt && !review.text.startsWith(review.excerpt)) {
        throw new Error(`reviews.ts: excerpt must preserve the opening text for ${locale}/${id}.`);
      }
    }
  }
}

assertLocalizedReviewsConsistency();

/** Required locale; missing content is an error, never an English fallback.
 * Compatibility: callers now pass their configured page locale. */
export function getReviewsSummary(locale: LocaleCode): ReviewsSummaryViewModel {
  const content = localizedContent[locale];
  if (!content) throw new Error(`reviews.ts: missing review content for ${locale}.`);
  const summary = normalizeReviews(snapshotResponse);
  return {
    ...summary,
    reviews: summary.reviews.map((review) => {
      const localized = content.reviews[review.id];
      if (!localized) throw new Error(`reviews.ts: missing review ${review.id} for ${locale}.`);
      return {
        ...review,
        text: localized.excerpt ?? localized.text,
        languageCode: locale,
      };
    }),
  };
}
