# Design refinement handoff

Owner-approved planning and preview artifacts for `luksuzniprevoz-website-astro`, collected on 24 September 2026. This commit packages the design work; production implementation is pending.

## Start here

Read [the refinement backlog, v1.7](./luksuzniprevoz-design-refinement-backlog.md) first. It records the status of each recommendation, locked decisions, implementation scope, source locations, and acceptance criteria. Follow its explicit supersession notes; an older proposal or preview must not override a later locked decision.

Before implementation, read the repository root `AGENTS.md`, `DESIGN.md`, and the applicable component/page contracts and skills. Reconcile this owner-approved direction with those contracts as part of the scoped implementation. These previews are visual references, not production components or substitutes for the repository's theme, localization, routing, and validation systems.

## Included files

| File | Purpose |
| --- | --- |
| [Refinement backlog](./luksuzniprevoz-design-refinement-backlog.md) | Full agent handoff, including universal fleet cards, booking flow, date/time format, footer, brand cleanup, imagery, image quality, and final CTA. |
| [Fleet preview](./luksuzniprevoz-fleet-showcase-preview.html) | Standalone visual example of the shared fleet card and showcase. |
| [Booking preview](./luksuzniprevoz-booking-preview.html) | Interactive design prototype of the booking flow; no production booking submission. |
| [Final CTA preview](./luksuzniprevoz-final-cta-preview.html) | Responsive full-width interior CTA with embedded photo and fonts. |
| [Footer reference source](./belgradetransfers-SiteFooter.reference.astro) | Preserved sibling-project component for reference; its imports and branding are not directly portable. |
| [Footer reference guide](./belgradetransfers-footer-reference.md) | Source context and adaptation instructions for the footer. |

## Preview and asset notes

- Open the HTML files directly in a browser. The embedded preview assets are for review; implement production image delivery through the existing Astro pipeline.
- The booking preview predates the later locked date/time decision. Production must display day/month/year and 24-hour time as specified in the backlog, even if a browser renders the prototype's native inputs differently.
- Incoming owner-supplied images retain their basenames and use `.webp` extensions. The final CTA source is `site/luksuzni-prevoz/src/assets/shared/final-cta-interior-v2.webp`.
- The CTA preview embeds the supplied original JPEG so it is self-contained. This does not change the production WebP decision.
- The owner will add the production image files to the shared assets directory. This handoff does not claim those assets have been installed or the website changes implemented.
- The preserved footer source contains sibling-project details. Adapt it to the locked Luksuzni transport identity and verified project contacts; do not copy sibling branding or operational data into production.

## Verification scope

The six supplied artifacts are copied without content changes. The final CTA preview was previously checked at 320, 390, 768, 1023, 1024, 1440, and 1920 CSS pixels, including image loading, overflow, target sizes, enlarged text, and keyboard focus. See the backlog for the precise evidence and limits. This packaging commit does not constitute a production build or a full-site acceptance pass.
