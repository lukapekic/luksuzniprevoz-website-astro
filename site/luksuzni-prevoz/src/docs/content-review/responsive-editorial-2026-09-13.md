# Editorial responsive regression — 13 September 2026

Status: corrections verified on the frozen editorial corpus. The later
[checkpoint](serbian-editorial-checkpoint-2026-09-13.md) supersedes the pending
items below and records the new concurrent-work integration blocker.

## Scope and authority

Root `AGENTS.md`, `DESIGN.md`, the affected component/page contracts, and the
content-quality-review, design-governance, design-foundation-governance,
typography-system, tailwind-v4, component-architecture, responsive-ui,
accessibility-wcag, design-harden and functional-ui procedures guided this work.
No theme values, routes, CTA destinations, business facts or backend behavior
were changed by these responsive corrections.

## Applied corrections

- FinalCTA: content-driven desktop height, shrinkable grid columns and wrapping
  contacts/actions. The image fills the existing media region. No text is hidden
  or reduced to fit; the existing split identity remains.
- SiteHeader: shrinkable navigation track, wrapped desktop navigation, and an
  explicit narrow-container text-fit state for actions. The scrolled surface
  covers the resulting header height. API and focus order are unchanged.
- HorizontalCarousel: controls can wrap while preserving counter/button order.
- Global content typography: emergency word wrapping for words and addresses
  that cannot fit at enlarged text sizes; semantic fonts and sizes are unchanged.
- Airport booking-start form: grid children may shrink below native min-content
  width and its primary button stays inside the panel. Typed handoff is unchanged.
- Contact: the 12-column 5/7 split now uses the semantic desktop column gutter,
  rather than repeating section-spacing gaps eleven times. This fixes excessive
  gap width at tablet landscape with 200% text.
- Five existing service smoke tests now expect the owner's canonical
  Mercedes-Benz model names. Assertions were updated, not removed.

## Evidence already obtained

- FinalCTA, SiteHeader and HorizontalCarousel component profiles passed all
  13 gates. Exact evidence is in `.design/.cache/serbian-finalcta-content-height.json`,
  `serbian-header-after.json` and `serbian-carousel-after.json`.
- Global wrapping and Airport form `small-ui` profiles passed all 11 gates:
  `serbian-text-wrap.json` and `serbian-airport-form-width.json`.
- 54 Chromium tests passed for CTA contact containment and enlarged shared
  controls across the applicable pages/locales and five viewport states.
- 46 rendered SEO tests passed, including metadata, canonical/hreflang,
  schema/visible FAQ alignment, sitemap and internal-link resolution.
- The first full form/airport/enlarged-page run had 68 passes and four failures:
  one outdated Airport vehicle-name expectation and Contact 1024px enlarged
  overflow in three locales. Corrections are applied; rerun is still required.
  Contact/Booking mocked submissions, validation/focus, no-JS fallback and
  Airport handoff passed in that run. No real enquiry was sent.

## Harness and environment limitations

The first corpus screenshot helper stalled on element stability and was stopped.
Its partial homepage captures are diagnostic evidence only, not final acceptance.
A replacement uses bounded capture timeouts and document-coordinate CTA clips.
Sticky headers are hidden only for isolated CTA screenshots, then restored;
full-page screenshots retain the actual header.

A temporary attempt to enable submission by replacing only a public-key data
attribute was insufficient because the server-rendered disabled state remained.
It was stopped and superseded by the repository's normal public test-key build.
Production availability/Turnstile safeguards were not bypassed or weakened.
Passing mocked form tests does not certify live Cloudflare delivery.

Remaining: final Contact gate, exact remaining content profiles, full rebuilt
corpus browser/visual acceptance, final consistency review and tracker handoff.
