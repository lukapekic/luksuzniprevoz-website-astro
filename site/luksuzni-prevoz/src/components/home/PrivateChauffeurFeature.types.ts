/**
 * PrivateChauffeurFeature — Homepage flagship-service editorial split (V1.1).
 *
 * Presentation-only composition of the shared `OpenSplitSection` primitive
 * inside a page-owned `<Section>` + `<PageContainer>` (blueprint §9 /
 * 06-private-chauffeur-feature). It owns NO data: the editorial heading/body,
 * the canonical package facts (sourced from services.ts by the page adapter),
 * and the CTA href (resolved via the routing abstraction by the page adapter)
 * all arrive as resolved props (FND-ARCH-03 / task §15 — three concerns kept
 * out of one hardcoded component object).
 *
 * The package summary is informational duration/km structure, never a fare
 * table — no monetary price is rendered here (task §14). Operational numbers
 * are assembled by the caller from `services.privateChauffeur.bookingOptions`
 * with localized unit labels from the UI dictionary, so this component never
 * hardcodes 1 / 5 / 10 / 100 / 200 (task §13 / §16).
 */
import type { ImageMetadata } from "astro";
import type { LocaleCode } from "@astro-foundation/core";

/** One package column: a localized mode label + a concise duration/km detail. */
export interface PrivateChauffeurPackage {
  /** Localized mode name, e.g. "Hourly" / "Half day" / "Full day". */
  label: string;
  /** Concise operational detail, e.g. "from 1 h" / "5 h · up to 100 km". */
  detail: string;
}

/** A resolved service-level CTA (label + localized href). */
export interface PrivateChauffeurCta {
  label: string;
  href: string;
}

export interface PrivateChauffeurFeatureProps {
  /** Editorial H2 title (flagshipFeature.heading.title). */
  heading: string;
  /** Concise editorial body copy (flagshipFeature.body). */
  body: string;
  /** Resolved service-level CTA (label + localized href). */
  cta: PrivateChauffeurCta;
  /** Three package columns (Hourly / Half Day / Full Day) — order is locked. */
  packages: PrivateChauffeurPackage[];
  /** Contextual chauffeur/S-Class split image (imported ImageMetadata). */
  image: ImageMetadata;
  /** Alt text; empty string = decorative (blueprint split role). */
  imageAlt: string;
  /** Current locale (forwarded to <Link> for routing/hreflang). */
  locale: LocaleCode;
}
