/**
 * ReviewCard — presentation-only props (FND-ARCH-03).
 *
 * Clean, stable contract: the card consumes ONLY these normalized fields, never
 * raw Google Places field names (no authorAttribution / originalText / relative
 * PublishTimeDescription leak into markup). data/reviews.ts owns the raw → view-
 * model normalization; this component stays dumb so the future real Google
 * Reviews package can replace the data source without rewriting the card.
 *
 * Wireframe §REVIEWS card anatomy: rating → review excerpt → reviewer name (+
 * relative time). No per-card Google destination link and no avatar (the
 * wireframe draws neither), so neither is rendered here. The view model still
 * carries authorPhotoUrl/authorProfileUrl/googleMapsUrl for the future package
 * slot; this card just does not surface them yet.
 */
export interface ReviewCardProps {
  /** Stable unique id (for any future keyed rendering / aria references). */
  id: string;
  /** Reviewer display name. */
  authorName: string;
  /** Numeric rating 1–5 (already clamped/rounded by the adapter). */
  rating: number;
  /** Displayable/localized review excerpt. */
  text: string;
  /** Relative publish-time label ("pre 2 nedelje"); null = omit the time. */
  relativeTime?: string | null;
  /** Full localized accessible rating label ("5 od 5"); visible stars are aria-hidden. */
  ratingLabel: string;
  /** Layout-only class (FND-UI-06). */
  class?: string;
}
