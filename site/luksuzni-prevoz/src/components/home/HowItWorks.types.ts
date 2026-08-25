/**
 * HowItWorks — Homepage intentional light contained section (V1.1).
 *
 * Presentation-only composition (blueprint §12 / 09-how-it-works). It owns NO
 * data: the editorial heading/intro and the three step title/text pairs arrive
 * as resolved props from the canonical `process` block of the home content
 * (homePageSchema `process: { heading: sectionHeadingSchema, steps:
 * z.array(textItemSchema).length(3) }` in src/content/schemas/pages.ts), so
 * this component never hardcodes Serbian/English/Russian strings (FND-ARCH-03).
 * The step numbers 01/02/03 are presentation-derived from ordered position,
 * never stored per locale.
 *
 * The shapes below are structurally identical to the canonical
 * `sectionHeadingSchema` / `textItemSchema` (src/content/schemas/shared.ts) so
 * the validated `process.heading` / `process.steps` arrays feed this component
 * with no mapping — same convention PrivateChauffeurFeature.types.ts uses for
 * its package/cta props.
 */

/**
 * One process step: a short title + a concise supporting line. Structurally
 * identical to the canonical `textItemSchema` ({ title, text }).
 */
export interface HowItWorksStep {
  /** Short localized step title. */
  title: string;
  /** One concise localized supporting line. */
  text: string;
}

/**
 * The editorial heading block: a title + an optional short intro. Structurally
 * identical to the canonical `sectionHeadingSchema` ({ title, intro? }).
 */
export interface HowItWorksHeading {
  /** Localized H2 heading title (process.heading.title). */
  title: string;
  /** Optional concise localized intro line (process.heading.intro). */
  intro?: string;
}

export interface HowItWorksProps {
  /** Editorial H2 heading block (process.heading — title + optional intro). */
  heading: HowItWorksHeading;
  /** Exactly three process steps in canonical order (process.steps). */
  steps: HowItWorksStep[];
}
