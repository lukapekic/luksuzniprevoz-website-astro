# Luksuzni transport — Design Refinement Backlog

Version: 1.7  
Created: 2026-09-24  
Updated: 2026-09-24  
Status: DR-06 fleet, DR-07 booking, DR-08 footer, DR-09 public identity, DR-10 imagery, DR-11 image delivery, and DR-12 full-width interior CTA directions selected; production implementation not started  
Purpose: Standalone context and task backlog for a coding agent. No prior conversation is required.

## 1. Project and scope

- Repository: https://github.com/lukapekic/luksuzniprevoz-website-astro
- Reviewed branch: `master`
- Reviewed commit: `7cb3e9b2f606615138a3c0c99b2e0f51e08d31dd`
- Product site root: `site/luksuzni-prevoz/`
- Owner-selected public identity: **Luksuzni transport** (DR-09). The reviewed checkout still mixes `Luxury Transportation`, `Luksuzni Prevoz`, and parent-company branding; these are migration findings, not the new identity.
- Stack: Astro static site, TypeScript, Tailwind CSS v4, pnpm workspace.
- Locales: Serbian Latin (default, unprefixed), English (`/en/`), Russian (`/ru/`). Use the route map for exact localized paths.

The website is approaching final design review. This backlog records bounded refinements to the existing design. DR-06 is the owner-selected shared fleet-card direction and replaces the narrower DR-02 and DR-04 proposals. DR-07 is the owner-approved booking presentation and navigation direction described in section 13. This is not a request to rebuild unrelated pages.

The latest instruction locks the full-width interior Final CTA and incoming WebP filenames under DR-12 (section 18), with a new standalone CTA preview. DR-11 (section 17) retains image output sizes, crop-aware resolution limits, accurate responsive selection, and moderately reduced compression without a production-build scan. DR-10 (section 16) retains selected image assignments and visibility treatments using owner-supplied assets with their exact filenames. Earlier deliverables include the footer migration reference and site-wide identity-cleanup plan (DR-08/DR-09), an extracted reference footer source, and a companion source/adaptation guide. Existing fleet and booking previews remain separate artifacts; neither is updated in this task. The new standalone Final CTA preview is documented in section 18. Production repository implementation is a later step. Do not interpret the existence of a backlog item as a direction to implement, commit, push, or deploy it now. When implementation is subsequently authorized, work on the selected items and follow the repository's current instructions.

All repository file paths below are relative to the repository root. Confirm them against the working checkout before editing. If the checkout has advanced beyond the reviewed commit, recheck each finding; already resolved findings should not be reintroduced as work.

## 2. Evidence and limitations

The initial review examined the route map, page assemblies, shared components, relevant blueprints and contracts, active theme JSON, and selected source imagery. It was a source-based review, not a completed browser visual audit.

Checks actually completed during that review:

- Design doctor reported coherent governance and no drift.
- Design snapshot check reported the snapshot current for `version-2`.
- Targeted design detector runs were clean for `FleetShowcase.astro` and `ContactPage.astro`.
- Repository working tree had no tracked changes.

These results do not certify all pages or prove visual quality. No completed build, responsive browser audit, accessibility audit, or performance comparison is claimed. Initial package installation used an incompatible ambient pnpm version; a retry through Corepack used the pinned version but was stopped before completion. No dependency or lockfile change is part of this backlog.

Separate verified implementation observations from expected visual benefits. In particular, vehicle clipping and final spacing must be assessed in rendered pages before choosing exact adjustments.

## 3. Design context and authorities

Read the current versions of:

1. `AGENTS.md` — technical requirements, workflow, and quality gates.
2. The locked blueprint for each affected page.
3. `DESIGN.md` — visual direction.
4. `site/luksuzni-prevoz/foundation.config.ts` — active theme selection.
5. Active theme JSON under `site/luksuzni-prevoz/src/theme/versions/`.
6. Approved shared component contracts and task-relevant `.skills/*.md` procedures.

This backlog distinguishes proposed work from owner-approved directions. DR-06 through DR-12 record explicit owner decisions; they authorize the described design direction, not production implementation. When implementation is authorized, update conflicting locked page/component contracts to match these decisions before changing the affected code. Follow all unrelated repository authorities.

### Current system, for orientation

The reviewed configuration selects Theme V2, Black & Platinum. Its character is calm, contemporary, discreet, image-led, and restrained. Headings use Inter Tight, body/UI use Manrope, and the brand wordmark role uses Cormorant Garamond Italic. The reviewed header/footer use the GS mark-only variant; **DR-09 supersedes that branding** and requires the approved Luksuzni transport logo instead.

Use semantic roles from the active theme: `background`, `surface`, `surfaceElevated`, `surfaceLight`, `accent`, `textPrimary`, `textMuted`, and `textOnLight`. Section rhythm uses `compact`, `standard`, and `feature`. Radius roles are `control`, `card`, and `section`.

Raw palette, spacing, type, and radius values deliberately remain in theme JSON. Do not copy values from this document or create a parallel token system.

Preserve:

- Page order and distinct page identities.
- Cinematic full-bleed heroes where required by page blueprints.
- Dark-first presentation with purposeful light functional surfaces.
- Booking as the primary conversion, quote as secondary, and direct contacts as tertiary.
- Verified business facts, localized copy, route helpers, and data gating.
- Shared component identity, meaningful focus states, and reduced-motion support.

## 4. Work tracker

| ID | Proposed change | Suggested order | Status | Evidence type |
| --- | --- | --- | --- | --- |
| DR-01 | Tighten Contact introduction-to-form spacing; booking incorporated into DR-07 | First pass | Contact proposed; booking superseded | Source-confirmed spacing composition |
| DR-02 | Simplify homepage fleet-card framing | Incorporated into DR-06 | Superseded | Original observation retained below |
| DR-03 | Strengthen active navigation cues | First pass | Proposed | Source-confirmed current-state treatment |
| DR-04 | Tune vehicle image crops and darkening | Incorporated into DR-06 | Superseded | Remove overlays entirely under DR-06 |
| DR-05 | Compare genuine semibold heading rendering | Optional comparison | Proposed | Intentional font-file mapping confirmed |
| DR-06 | One universal fleet card: natural photography, separate details, model-family naming | Fleet priority | Selected — specification and preview | Owner direction; detailed contract in section 12 |
| DR-07 | One centered booking panel, visible progress, compact summary, explicit actions | Booking priority | Locked direction — layout preview complete; date/time refinement specified, preview update pending; production pending | Owner approval; detailed contract in section 13 |
| DR-08 | Adopt Belgrade Transfers three-tier footer with target theme, identity, contacts, and routes | Footer priority | Selected — source extracted; implementation pending | Pinned reference source; section 14 |
| DR-09 | Remove parent-company/GS branding site-wide; use Luksuzni transport | Coordinate with DR-08 | Locked identity decision — audit and implementation brief complete; production pending | Source-confirmed inventory; section 15 |
| DR-10 | Exact shared-asset image assignments, own chauffeur homepage card, natural visibility and localized scrims | Imagery priority | Locked direction — specification complete; production and responsive verification pending | Owner asset handoff; source/photo review; section 16 |
| DR-11 | Responsive width ladders, crop-aware density, accurate sizes and modest compression reduction | Coordinate with DR-06/DR-10 | Locked source-level specification; implementation/build verification pending | Confirmed component settings; section 17 |
| DR-12 | Full-width interior Final CTA; exact shared WebP image names | Closing-section priority | Locked direction — standalone responsive preview delivered; production pending | Owner image selection and file handoff; section 18 |

Suggested sequence is not an implementation authorization. Keep these IDs stable as this file is updated. Status values: Proposed, Selected, In progress, Implemented / awaiting verification, Verified, Deferred, Rejected, Already resolved, Superseded.

## 5. DR-01 — Bring functional forms closer to their introductions

### Observation

Contact renders breadcrumbs in one `compact` Section, the H1/introduction in a second `compact` Section, and the contact/form region in a `feature` Section. Booking places its introduction/progress in a `compact` Section and its form region in a `feature` Section. Section spacing applies padding on both block edges, so adjacent sections accumulate whitespace.

### Files and authorities

- `site/luksuzni-prevoz/src/components/contact/ContactPage.astro`
- `site/luksuzni-prevoz/src/components/booking/BookingPage.astro`
- `site/luksuzni-prevoz/src/foundation/ui/Section.astro`
- `site/luksuzni-prevoz/src/foundation/ui/Section.variants.ts`
- `site/luksuzni-prevoz/src/docs/contact/blueprint.md`
- `site/luksuzni-prevoz/src/docs/booking/blueprint.md`
- Corresponding Contact and Booking wireframes.

### Proposed correction

Render both pages first. Reduce accumulated spacing at the breadcrumb/introduction and introduction/form transitions using existing semantic spacing roles. Keep the change local to these page compositions; do not reduce global Section spacing to solve a page-specific issue.

Preserve Contact's details-then-form DOM order and 5/7 desktop split. For Booking, DR-07 supersedes this original preservation instruction: move progress into the form panel, make completed steps revisitable, remove the sidebar, and use the revised assurance sequence. Exact spacing choices should follow the rendered evidence and updated contracts.

### Acceptance

- First useful form interaction sits higher than in the baseline without crowding the introduction.
- Breadcrumbs, heading, progress, and form read as related groups.
- Mobile and tablet retain comfortable separation and accessible controls.
- No field, validation, submission, progress, or booking logic changes.
- Other pages retain their spacing.

## 6. DR-02 — Simplify homepage fleet-card framing (superseded)

Original observation: the homepage card combines a rounded outer surface, an inset bordered image, and a bordered capacity chip.

The original proposal only removed nested framing on the homepage. The owner subsequently selected a universal fleet card across homepage and service recommendations. Follow **DR-06** instead: its scope explicitly replaces both card implementations, removes overlays, and standardizes the information panel. Do not retain the earlier homepage-only restriction or old image footprint as an active requirement.

## 7. DR-03 — Make navigation location more explicit

### Observation

Top-level current-page links mainly change to the platinum accent color. The Services dropdown trigger has no current-section treatment when a descendant service page is active. Current destination links inside dropdowns already have `aria-current` handling.

### Files and authorities

- `site/luksuzni-prevoz/src/components/site/SiteHeader.astro`
- `site/luksuzni-prevoz/src/data/navigation.ts`
- `site/luksuzni-prevoz/src/data/routes.ts`
- `site/luksuzni-prevoz/src/docs/home/home-components/02-site-header.md`
- Header-related requirements in affected page blueprints.

### Proposed correction

Add a restrained underline or equivalent non-color cue for active top-level destinations. Give Services a matching active-section cue when the current route belongs to its existing navigation subtree. Derive membership from the canonical navigation/route model rather than URL substring checks or a second hardcoded service list.

Keep `aria-current="page"` on the actual current destination. Treat the Services button as a dropdown trigger, not as the current-page link. Preserve `aria-expanded`, keyboard behavior, focus management, and its accessible name.

### Acceptance

- Current location is recognizable without relying only on a subtle color difference.
- The correct service/hub routes activate the Services section cue; unrelated pages do not.
- Current-page links in the mobile menu receive an equally clear cue where appropriate.
- No header-height change, layout jump, changed hit area, or competing emphasis with the booking CTA.
- Treatment works over hero imagery and on the scrolled header surface in all locales.

## 8. DR-04 — Tune vehicle crops and darkening (superseded)

Original observation: tall service recommendation cards crop landscape photographs and apply filters plus a dark scrim directly over the vehicle.

The original proposal retained overlay copy and merely reduced darkening. The owner subsequently requested **complete removal of fleet-card overlays and a separate information panel**. Follow DR-06. Per-image focal-point review remains relevant; overlay text, active/inactive brightness differences, and the old portrait-card composition do not.

## 9. DR-05 — Optional genuine semibold heading comparison

### Observation and trade-off

`fonts.css` intentionally maps Inter Tight weights 500, 600, and 700 to the same 700 font files. The comments explain that this reduces font downloads and avoids synthetic bold. Consequently, those nominal weights share the same underlying bold appearance.

This is an intentional performance compromise, not an accidental loading bug. The proposal is to compare an alternative before deciding whether the visual improvement warrants the cost.

### Files and authorities

- `site/luksuzni-prevoz/src/styles/fonts.css`
- `site/luksuzni-prevoz/src/theme/versions/version-2/typography.json` at the reviewed baseline; resolve the active version before work.
- `site/luksuzni-prevoz/src/foundation/ui/Page.astro` for locale-aware font preloads.
- `site/luksuzni-prevoz/scripts/generate-font-subsets.mjs`
- `site/luksuzni-prevoz/foundation.config.ts` for performance budgets.
- `.skills/typography-system.md`

### Proposed comparison

Compare the current rendering with a genuine 600 face for semibold section headings. Preserve Inter Tight, existing font roles, semantic sizes, and layout. Check Serbian diacritics, Latin text, and Russian Cyrillic. A genuine face must be supplied consistently across the relevant subsets; merely renaming or relabeling the 700 file does not implement this proposal.

Measure the additional route font bytes/requests and verify preload behavior. Do not assume a variable font is smaller or replace the entire font strategy without evidence. Medium 500 handling is a separate decision unless explicitly included in the authorized scope.

### Acceptance / decision

- Provide a representative visual comparison and measured font-delivery difference.
- Confirm the actual loaded face, not just the computed CSS weight label.
- No missing glyphs, synthetic weights, inconsistent locale rendering, or material layout instability.
- Applicable performance budgets remain satisfied.
- Adopt the change only within the subsequently authorized scope; otherwise record the comparison outcome and retain the baseline.

## 10. Implementation and verification protocol

When selected work begins, use the current root `AGENTS.md` workflow and pinned package manager (`pnpm@10.14.0` at the reviewed baseline; `corepack pnpm` resolved it in the review environment). Do not change dependencies or regenerate the lockfile merely to accommodate a mismatched ambient pnpm.

For each exact target, run the repository preflight, for example:

```bash
pnpm design:context --target site/luksuzni-prevoz/src/components/home/FleetShowcase.astro --surface home
```

Resolve the surface from the current configuration. Relevant baseline surfaces include `home`, `contact`, `booking`, and `shared-ui`. Regenerate the design snapshot only when preflight reports it stale. Never edit generated theme CSS directly.

Before modifying shared components, inspect all consumers and follow the component-contract and cross-consumer checks required by `AGENTS.md`. After implementation, use the applicable `verify:ui` profile and scope/review evidence requirements. Run the site check/build and any additional gates required by the actual changed files; this document does not replace the repository's gate selection.

Visual acceptance must cover:

| State | Reference width |
| --- | --- |
| Mobile | 320px |
| Tablet portrait | 768px |
| Tablet landscape | 1024px |
| Desktop | 1440px |
| Wide desktop | 1920px |

Also inspect both sides of a changed responsive threshold. Cover Serbian Latin, English, and Russian, applicable keyboard/focus/hover/active states, enlarged text, minimum 44×44 interactive targets, reduced motion, and accidental horizontal overflow. Do not submit real forms during design verification.

Record automated checks and manual visual findings separately. If a check cannot run, document the limitation and leave verification pending rather than marking the item Verified.

## 11. Updating this document

For each selected item, record:

- Decision and date, including any scope adjustment from the owner.
- Implementation branch and commit once they exist.
- Files changed and affected consumers.
- Before/after evidence and locale/viewport coverage.
- Commands actually run and their results.
- Remaining issues, asset needs, or deferred decisions.

Add later requests as new stable IDs. Preserve the original observation and decision history; do not silently convert optional comparisons into mandatory changes.

### Change log

| Date | Version | Change |
| --- | --- | --- |
| 2026-09-24 | 1.0 | Created standalone backlog containing DR-01 through DR-05. All items proposed; no implementation performed. |
| 2026-09-24 | 1.1 | Added detailed DR-06 universal fleet-card specification and standalone showcase preview. DR-02/DR-04 superseded. Other recommendations unchanged. Production implementation not started. |
| 2026-09-24 | 1.2 | Locked DR-07 booking direction; incorporated booking portion of DR-01; added detailed implementation contract and separate interactive booking preview. Production unchanged. |
| 2026-09-24 | 1.3 | Locked DR-07 date/time refinement: DD/MM/YYYY, 24-hour HH:mm, Belgrade local time, dependency-free controls and canonical internal values. Documentation only; HTML preview and production unchanged. |
| 2026-09-24 | 1.4 | Added DR-08 footer migration from pinned Belgrade Transfers source and DR-09 site-wide Luksuzni transport identity cleanup. Saved full source/reference artifacts. Production and earlier HTML previews unchanged. |
| 2026-09-24 | 1.5 | Locked DR-10 selected shared-asset filenames and placements, own chauffeur service card, homepage duplicate-use resolution, scoped visibility/overlay rules, responsive crop instructions, and acceptance checks. Reserve images explicitly excluded from new placements. Documentation only. |
| 2026-09-24 | 1.6 | Locked DR-11: hero AVIF 55, fleet/non-hero AVIF 60, WebP photos 85; role-specific output ladders, source caps, 2× density target, crop-aware sizing equations and component-specific responsive width contract. No build scan or production changes. |
| 2026-09-24 | 1.7 | Locked DR-12 full-width interior CTA with final-cta-interior-v2.webp and a standalone HTML preview; migrated incoming photographic filenames to WebP; superseded old closing-image bindings and clarified full-width CTA delivery. Production unchanged. |

## 12. DR-06 — Universal FleetCard and showcase migration

### 12.1 Owner decision and delivery boundary

The owner wants one recognizable fleet-card design across homepage and service-page fleet recommendations. Their current screenshot shows a heavy black overlay obscuring vehicles. Their supplied front/three-quarter photographs establish the desired natural color treatment.

Selected visual direction:

- Photograph above, information below; never text over the vehicle.
- Natural image colors and full image opacity in every state.
- Edge-to-edge image inside a single restrained outer card boundary.
- A consistent landscape image footprint, proposed and previewed at **4:3**.
- A separate graphite information panel, model name first.
- One public V-Class model family, without Extra Long or seating suffixes in showcase titles.

The owner's initial 80/20 image/data split expressed image dominance. Implement the agreed recommendation as a fixed image aspect ratio plus content-driven details, not literal 80%/20% heights. On a typical desktop card the photo will occupy roughly two-thirds to three-quarters of the total height. The exact fraction varies with width, translated text, and metadata; readability takes precedence.

Current deliverables are this specification and `luksuzniprevoz-fleet-showcase-preview.html`. The preview is a visual proposal for review, not a production build or evidence that the shared component has been migrated.

“Universal” in this task covers this repository's fleet-card consumers. Do not modify sibling repositories or other applications without an explicit later scope. Dedicated Fleet-page vehicle-detail features remain larger detail layouts; share canonical names and media relationships without flattening them into carousel cards.

### 12.2 Component responsibility

Create one shared Astro card, provisionally:

`site/luksuzni-prevoz/src/components/shared/FleetCard.astro`

Use the current component conventions for its typed props/contract. It owns the image and information panel only. It must not own a section heading, route-specific copy, carousel state, vehicle lookup, pricing calculation, or fleet selection policy.

Responsibilities:

| Layer | Owns |
| --- | --- |
| Canonical data / presentation adapter | Family identity, public model name, source image/focal point, resolved verified facts |
| Page/section wrapper | Localized heading/intro, selected families/order, optional commercial context, section CTA |
| FleetCard | Identical card markup, image geometry, type hierarchy, facts layout |
| HorizontalCarousel | Scroll mechanics, controls, count, keyboard support, responsive track sizing |

`FleetShowcase` and `VehicleRecommendations` may remain as section wrappers. Both must render the same FleetCard. No separate `home`, `airport`, `VIP`, `dark-overlay`, or `portrait` card skin. Optional data does not justify a new visual variant.

Reuse `HorizontalCarousel` instead of embedding the standalone preview's JavaScript in production. Shared mechanics may be adjusted only where necessary for the agreed responsive geometry, with cross-consumer checks.

### 12.3 Inventory and migration targets

Start with:

- `src/components/home/FleetShowcase.astro`
- `src/components/services/shared/VehicleRecommendations.astro`
- `src/components/shared/HorizontalCarousel.astro` and its prop types
- `src/components/home/HomePage.astro` and `FleetShowcase.types.ts`
- `src/data/fleet.ts`, `fleet-media.ts`, `fleet-page.ts`, and `fleet-page-media.ts`
- `src/data/pricing.ts` and the existing pricing formatting/resolver paths

The paths in this subsection are relative to the product site root. Discover all imports of the two fleet wrappers and all fleet-card markup before editing. At the reviewed baseline, service consumers include Airport, Private Chauffeur, Business, Corporate, Delegation, Conference/Congress, Special Events, Wedding, Prom, and VIP. Verify the current list rather than treating this enumeration as exhaustive.

Preserve each page's selected vehicles, section order, headings, and conversion destinations. Deduplicate configurations into model families while preserving the first intended family position. Do not add every vehicle to every service merely because the renderer is now shared.

### 12.4 Card structure and semantics

Required order:

1. Media region.
2. Model heading.
3. Localized vehicle category.
4. Optional compact metadata row.

Use an `article` within the existing carousel list item, with a logical heading level (normally H3 under the section H2). Keep meaningful reading order identical to visual order. The component must have no duplicate fixed IDs across cards or repeated sections.

The image is decorative when the adjacent model heading communicates its purpose; use `alt=""` in that case. If the image communicates additional necessary information, supply a localized description through the data contract. Do not render the file name as alt text.

No description paragraphs, suitability paragraphs, rating badges, equipment badges, or individual booking buttons inside the compact card. Existing service-specific suitability copy must be reviewed during migration: retain useful unique information in the section intro or another approved content location, or obtain the relevant editorial decision. Do not silently lose unique operational claims or manufacture replacement copy.

### 12.5 Photography contract

- Use the approved three-quarter/left-facing photograph as the default showcase image where available.
- Keep front-facing images available for the dedicated fleet detail presentation; no hover swap or gallery is introduced here.
- Use a media wrapper with `aspect-ratio: 4 / 3`, width 100%, and no inner padding or outline.
- The image fills that region with `object-fit: cover`; preserve the whole recognizable car through focal-point review. The supplied opaque landscape photographs do not require transparent-cutout handling.
- Begin with a centered horizontal position. The supplied E-Class three-quarter image has a low subject, but because 4:3 crops a 3:2 source horizontally, vertical `object-position` alone cannot change that crop. Inspect actual source/target ratios before adjusting coordinates.
- Put vehicle-specific focal-point metadata in the existing media data layer or a justified extension, not in route-specific CSS selectors.
- Preserve bumpers, wheels, roof, and mirrors wherever the approved source composition permits. Use a different approved photograph or report an asset need if fitting the subject is impossible; do not stretch the photo or generate a replacement vehicle.
- No black overlay, image scrim, gradient fade, brightness/contrast/saturation filter, opacity fade, dark pseudo-element, or darkened parent wrapper.
- No darkening for inactive carousel items. The first, middle, last, hovered, focused, and partially visible items use the same natural image treatment.
- No image zoom, lift, parallax, or decorative motion. Sharpness means clean natural presentation; do not add artificial sharpening.
- Retain Astro image optimization, responsive widths/sizes, intrinsic dimensions, and below-the-fold lazy loading. Data-URI embedding is for the standalone preview only.

### 12.6 Surface and typography contract

Use active semantic tokens in production. The outer card uses `surface` and the existing `card` radius. Clip the top image to the top corners, retain a straight image/content boundary, and round only the outer bottom corners of the information panel. Avoid an inner rounded image, card border, heavy shadow, or detached frame.

Use existing space tokens for panel padding and gaps. A reasonable initial mapping is `space-5` padding with small `space-2`/`space-3` content gaps. Preserve the actual approved theme rather than hardcoding screenshot dimensions.

- Model: Inter Tight, the existing compact heading role, primary text, semibold semantic weight. Do not change global font loading as part of DR-06; DR-05 remains separate.
- Category: Manrope, small body/UI role, muted text.
- Facts: Manrope, small text; capacity clear, price value emphasized without becoming a CTA.
- Price label: compact caption, readable muted text. Allow wrapping.
- Use a quiet divider above metadata if needed. No border around individual facts and no decorative icon required.

Do not truncate names with ellipses, use fixed line clamps, or shrink fonts to force one line. Allow wrapping, including at 200% text size. Equal-height cards may stretch naturally within a carousel row; never enforce a total card height or a fixed-height data panel.

### 12.7 Metadata and commercial context

| Context | Permitted card information |
| --- | --- |
| Homepage | Model, category, verified capacity; no price |
| Service recommendation without a public applicable fare | Same base facts; no invented price or empty price placeholder |
| Airport recommendation | Base facts plus the canonical airport fare and localized label when scope/eligibility are established |
| Other existing fleet listing card | Same renderer and valid contextual facts; no new commercial behavior |

Keep metadata to a compact row: capacity on the leading side and optional price on the trailing side. If capacity is absent, preserve trailing alignment of the fare. If the fare is absent, capacity remains leading-aligned. If both are absent, omit the row and divider; allow the surrounding row to stretch naturally rather than adding fake content.

On narrow cards or enlarged text, stack metadata when the card's available width drops below the approved component threshold. No overlap or clipping. Do not reduce caption size merely to retain two columns.

Prices come from canonical data and the existing formatter. Preserve currency, unit, route scope, fare eligibility, and whether a value is fixed/from/estimated. Do not add “from” to a fixed price or silently promote a configuration-specific value to a family-wide promise. No fare calculations inside FleetCard.

The example preview uses the reviewed Airport values: S-Class €90, E-Class €45, V-Class €60, and Sprinter €100. Both canonical V-Class configurations have the same €60 airport fare at the reviewed commit; this supports the example family card for that scope. Production must re-evaluate the actual current data. Preview copy identifies the airport-to-Belgrade-city context; it is not a new all-destinations price promise.

### 12.8 Canonical V-Class family normalization

Public showcase name: **Mercedes-Benz V-Class**. Reuse `fleetModelDisplayNames.mercedesVClass` or a deliberate canonical extension. Do not build the name by stripping substrings in the UI.

Group these reviewed records under one stable presentation-family key:

```text
mercedes-v-class-6-plus-1-extra-long
mercedes-v-class-7-plus-1-extra-long
  → one Mercedes-Benz V-Class showcase card
```

Keep the original configuration IDs and facts in `fleet.ts`, pricing, and booking. They describe real operational choices. The change is to the public showcase model and name, not a deletion or rewriting of inventory.

The adapter must:

1. Map every referenced vehicle ID to its presentation family.
2. Deduplicate by family key while preserving page-specific family order.
3. Resolve one canonical public title and matching photograph.
4. Omit a singular capacity for generic V-Class cards by default; do not inherit 6 or 7 from whichever record appears first.
5. Resolve a family fare only when valid for the relevant configuration set and service scope. Equal verified fares can produce one exact value; differing/unknown fares require the existing approved quote/from policy or omission.
6. Keep model family identity separate from priced configuration identity in typed APIs.

Avoid deduplication by translated display text. Never mutate shared roster arrays while grouping. Brand/model names remain canonical proper names across locales; category, labels, and plurals are localized through approved sources.

### 12.9 Suggested view-model boundary

Use the following as conceptual guidance, adapting to current repository types:

```ts
type FleetCardViewModel = {
  familyKey: string;            // canonical typed family identity in implementation
  displayName: string;          // resolved canonical public model name
  categoryLabel: string;        // localized upstream
  image: ImageMetadata | null;
  imageAlt: string;
  focalPoint?: { inline: number; block: number };
  passengerText?: string;       // verified/localized upstream; absent for generic V-Class
  fare?: { label: string; formattedValue: string };
};
```

Do not expose raw configuration display names as a fallback when a family mapping is expected; fail clearly or resolve the approved mapping. The card should not inspect `locale` to invent copy, read service prices, or choose which configurations are commercially equivalent. Validate relationships in the adapter/data layer.

### 12.10 Section and carousel presentation

Preserve a left-aligned section heading and concise introduction. Carousel controls remain together above the track; count and arrows are restrained. Retain the existing route-specific section CTA and its approved placement rather than moving every page's CTA solely to match the sample.

The preview follows the airport example: heading/intro, count and arrows, card track, then “Pogledajte vozila”. No site header, hero, footer, booking form, or extra promotional section appears in the preview.

No autoplay or drag-only navigation. Native swipe/scroll, keyboard access, and previous/next buttons remain available. Keep a partial next card as a continuation cue when more items exist. Controls must disable or hide appropriately at boundaries and when all cards fit; no fake endless wrap.

A track may show several visible cards. The counter should describe a documented position consistently, not jump to “4 of 4” merely because the fourth card is partly visible. The preview announces a visible range separately for assistive technology.

### 12.11 Responsive topology

Use the active semantic breakpoint tokens (reviewed `md` and `lg`) and container width for actual card sizing. Proposed explicit carousel geometry for this shared fleet use:

| Width state | Fleet card sizing | Content behavior |
| --- | --- | --- |
| Below `md` | Card basis 88% of available track width; next card peeks after the gap | 4:3 image, text below; model wraps; metadata stacks if needed |
| `md` through below `lg` | About 1.8 cards per track; basis `(100% - gap) / 1.8` | Same structure, same image ratio, no overlay |
| `lg` and above | About 3.2 cards per track; basis `(100% - 3 × gap) / 3.2` | Same structure; capped main container prevents uncontrolled growth |
| All cards fit | Preserve consistent sizing unless an existing page contract requires a grid | Hide unavailable navigation; no empty carousel controls |

The ratio figures above describe approximate visible-card counts; the formulas define deterministic sizing. For very small recommendation sets, preserve existing approved layout behavior and document any required adjustment rather than adding blank filler cards.

At the approved component threshold (reviewed 16rem), stack metadata in logical order when necessary. Align the price to the leading edge in stacked mode. Maintain sensible gaps and do not use viewport width alone to infer card-internal space.

Verify 320/768/1024/1440/1920px and each changed threshold on both sides. The DOM order remains media, model, category, metadata; controls precede the track and section CTA follows in the sample. Page-level horizontal overflow is forbidden; carousel overflow is intentional and contained. Do not hide overflow globally to mask a sizing defect.

### 12.12 Interaction/accessibility

Base cards are non-interactive articles in this specification and preview. Do not give them pointer cursors, tabindex, button roles, or hover effects suggesting a missing action. The real section CTA links to the localized Fleet route.

If a later authorized scope makes cards clickable, link to an existing exact vehicle destination, provide clear focus/hover treatment, avoid nested controls, and update the component contract. Do not invent fleet-detail routes or dead `#` links now.

Use labelled native buttons for carousel arrows, `aria-controls` to the actual track/viewport, clear focus outlines, minimum 44×44 targets, no focus loss after scrolling, and reduced-motion-aware scrolling. Keep text selectable. Announce useful visible-range changes politely without reading the entire carousel repeatedly.

### 12.13 Contract migration order

1. Inventory current fleet card renderers, imports, applicable page blueprints, and approved consumer contracts.
2. Run current design preflight and shared-component checks.
3. Update the Homepage FleetShowcase and shared VehicleRecommendations contracts to reflect DR-06. Update page blueprint references that explicitly require overlaid copy, portrait imagery, or the old image footprint.
4. Preserve the global theme and unrelated hero/service-card imagery rules. The no-overlay change is scoped to fleet cards, not all photographic sections.
5. Implement typed family normalization and verified metadata resolution.
6. Build FleetCard with one structure and one visual treatment.
7. Replace the duplicated card markup inside both wrappers; pass resolved view models.
8. Migrate every service consumer and remove obsolete fleet-only overlay/filter CSS and unsupported card props after confirming no remaining consumers.
9. Verify all configured locales, affected pages, optional-data states, and responsive states.
10. Run required repository gates and report exact production changes separately from this preview.

### 12.14 Acceptance checklist

- [ ] Homepage and service recommendations render the same FleetCard component.
- [ ] No fleet-card image overlay, gradient, filter, reduced opacity, or active/inactive brightness rule remains.
- [ ] Every card uses the same 4:3 image-over-details composition and semantic card surface/radius.
- [ ] Cars remain clearly visible and sensibly cropped across required widths.
- [ ] Each showcase contains at most one V-Class card and titles it Mercedes-Benz V-Class.
- [ ] Configuration IDs/prices/booking choices remain intact; no singular V-Class capacity leaks into the generic card.
- [ ] Optional prices and capacities are verified, localized, and omitted safely when unavailable.
- [ ] No generic card inherits an arbitrary configuration's fare; grouping policy is explicit.
- [ ] Long titles and translated metadata wrap without truncation, overlap, or font shrinking.
- [ ] Carousel controls, keyboard/swipe behavior, focus visibility, boundaries, and reduced motion work.
- [ ] No unrelated page structure, section content, CTA destination, or image treatment changes.
- [ ] All required cross-consumer, contract, build, and responsive evidence is recorded before production completion.

Use focused tests for family deduplication/order, public naming, configuration preservation, and fare/capacity ambiguity; these protect business behavior. Avoid brittle tests that simply assert every CSS declaration. Inspect computed styles and actual loaded images to verify visual behavior.

### 12.15 Preview artifact and interpretation

Companion: `luksuzniprevoz-fleet-showcase-preview.html`.

This is a standalone Serbian airport-section preview containing S-Class, E-Class, V-Class, and Sprinter. It embeds the original photographs and font bytes, so it opens without adjacent asset folders or CDN access. The E-Class uses the supplied `left-facing.webp`; the other models use matching approved repository imagery. The supplied front-facing view remains a reference rather than replacing the agreed three-quarter card angle.

The preview snapshots the current theme and data solely to be self-contained. Production must consume active tokens, canonical data, localized content, Astro assets, route helpers, and the existing carousel. Do not copy its data URIs, handwritten route URL, hardcoded sample prices, inline JavaScript, or standalone CSS wholesale into the application.

The section CTA opens the current site's Fleet URL in a new tab. The preview does not implement a booking flow or submit data. Browser checks of this artifact, when recorded, are preview-only evidence and do not validate the production repository.

### 12.16 Preview verification record — 2026-09-24

- Standalone HTML rendered in headless Chromium 133.
- Checked widths: 320, 767, 768, 1023, 1024, 1440, and 1920px.
- All four embedded images loaded; all media regions retained a 4:3 aspect ratio.
- No document-level horizontal overflow or information-panel overflow at those widths.
- Computed heading/body families resolved to Inter Tight and Manrope; embedded font assets loaded before screenshots.
- Desktop and mobile screenshots were manually inspected: full vehicle subjects remain visible for the initially shown S-Class, E-Class, and V-Class cards; details sit entirely below the images.
- Next/previous state handling and keyboard Home navigation checked; next navigation reached the final scroll boundary.
- At 320px with root text enlarged to 200%, no document or information-panel horizontal overflow was detected.
- No browser JavaScript errors were recorded.
- Static checks confirmed one showcase section, four cards, unique IDs, embedded images, and no Extra Long title suffix.

This is limited evidence for the Serbian sample only, not a comprehensive accessibility audit, all-locale review, all-image crop signoff, or production gate completion. Production DR-06 remains unimplemented.


## 13. DR-07 — Make the booking flow explicit and compact

### 13.1 Decision, status, and authorization

**Locked by the owner on 2026-09-24.** Retain the four-step booking model and existing business rules. Recompose the page around one centered light panel, place readable progress inside it, replace the right summary sidebar with a compact expandable summary, and keep clearly labelled Back/Continue actions inside the panel.

This is an approved design direction, not an alternative awaiting selection. The authorized deliverables are this plan update and `luksuzniprevoz-booking-preview.html`. No production implementation, commit, push, deployment, booking submission, or API change is authorized by this preview task. A later coding agent should implement DR-07 when production work is requested.

DR-07 supersedes the booking portion of DR-01, including the earlier instruction to preserve passive progress and the existing form/summary arrangement. The Contact portion remains proposed. DR-06 and its preview remain unchanged.

### 13.2 Problem and intended result

The reviewed screenshot separates a small, low-emphasis progress indicator from the interactive panel with a large vertical gap. A repeated introductory heading competes with the active step question. The dark right sidebar spends substantial space on unfilled values, while the Continue action occupies a separate light block below the fields. These placements make the relationship between selection, steps, summary, and continuation harder to understand.

The new page must communicate, in order: what the visitor is arranging, where they are in the flow, what they need to do now, and what happens when they continue. Preserve the site's dark premium shell and light functional form treatment. Achieve clarity through grouping, contrast, labels, and spacing rather than introducing a new palette or decorative effects.

### 13.3 Production files and authorities

All paths relative to repository root:

- `site/luksuzni-prevoz/src/components/booking/BookingPage.astro`: page assembly, introduction and assurance.
- `site/luksuzni-prevoz/src/components/booking/BookingProgress.astro`: step indicator and navigation semantics.
- `site/luksuzni-prevoz/src/components/booking/BookingWizard.astro`: panels, conditional fields, summary and actions.
- `site/luksuzni-prevoz/src/components/booking/booking-controller.ts`: state, validation, navigation, handoff/draft behavior, pricing and submission.
- `site/luksuzni-prevoz/src/docs/booking/blueprint.md`, `wireframe.html`, and `theme-contract.md`: migrate the conflicting layout/navigation rules before production implementation.
- Booking page and shared UI locale content under `site/luksuzni-prevoz/src/content/pages/booking/` and `src/content/ui/`.
- Canonical data under `src/data/booking.ts`, `fleet.ts`, `pricing.ts`, `services.ts`, `operations.ts`, and `contact.ts`, relative to the product site root.
- Relevant domain helpers, route maps, shared form/button primitives, active theme roles, and current repository instructions.

Reconfirm file locations and behavior against the implementation checkout. The inspected controller has real Turnstile-backed submission to `/api/forms/booking`; do not treat stale validation-only comments or blueprint wording as authoritative descriptions of current behavior.

### 13.4 Page composition and sizing

Use the existing production header and footer. Below the header, render one H1 (`Isplanirajte svoj prevoz`) and one short introductory paragraph. Remove the duplicate middle heading `Vaš zahtev, korak po korak`. Avoid separate large sections between introduction, progress, and form.

Center the introduction and form on a shared content axis. Use a local booking panel cap of approximately 800–880px (preview: 864px/54rem). This is a booking-specific composition decision; document its semantic sizing through the foundation rather than changing the global site container. Intro copy should have a comfortable reading width. Keep spacing governed by existing semantic roles; the preview's pixel values are illustrative.

The light panel contains, in DOM order:

1. Progress and current step count.
2. Compact expandable summary, when applicable.
3. The current step heading, short help text, validation feedback, and fields.
4. An internal action row separated by a subtle divider.

Below the panel, render concise manual-confirmation assurance and a quiet direct-contact link. The direct-contact action uses the localized existing route; it is not a second primary button. A sticky footer is unnecessary for this direction. The panel grows naturally with content; do not give it a fixed height or internal vertical scrolling region.

### 13.5 Progress and navigation contract

| Step | Serbian label | Content |
| --- | --- | --- |
| 1 | Usluga | Service family and relevant subservice |
| 2 | Plan puta | Date/time, route and service-specific trip details |
| 3 | Putnici i vozilo | Passenger/luggage needs and vehicle preference |
| 4 | Pregled i kontakt | Editable complete review and contact details |

Desktop: show four readable labels with numbered circles. Active state uses a dark filled circle with light number and strong text. Completed state uses a checkmark plus a distinct readable treatment. Future state uses an outlined circle and sufficiently contrasting secondary text; it must not look nearly invisible. Include `Korak N od 4` above the sequence. Do not use color alone to distinguish states.

Completed steps are buttons that return to their panel. Future steps cannot bypass validation. Use a navigation label, an ordered list, `aria-current="step"` on the active step, and native buttons. Do not apply tab semantics unless the complete tab keyboard interaction model is intentionally implemented; a staged form is not automatically a tab interface.

Mobile: display the full current label alongside `Korak N od 4`, followed by four compact progress segments with accessible step names. Completed segments remain keyboard operable. Avoid squeezing all four long labels into a narrow horizontal line.

After a step changes, focus the new step heading (programmatically focusable with `tabindex="-1"`) and bring it into view without disorienting animation. On invalid Continue, focus the first invalid field and show associated inline guidance. Respect reduced motion.

### 13.6 Service selection

Use full-width, individually clickable native radio rows with a concise title and one supporting sentence. The entire label is the hit target. Give selected rows a stronger border and a subtle contrasting surface. Show a checked control; selected styling alone is insufficient. Hover and keyboard focus must remain distinguishable from selection.

Do not automatically advance when a service is selected. Continue is the explicit forward action. If a valid incoming service handoff or recovered draft exists, retain it. Without existing state, ask for a selection rather than fabricating a booking intent.

Business and special-event subservice choices appear immediately beneath the selected category, in the same visual group. Require applicable subservice selection before advancing. Preserve canonical subservice IDs, translations, eligibility, and conditional logic. Revealed content must enter the accessible reading order naturally.

### 13.7 Summary contract

Remove the desktop sidebar entirely; it must not remain hidden off-screen as a second accessible duplicate.

- Step 1: no summary. There is too little information to justify it.
- Steps 2–3: a shallow summary strip directly below progress. Show the chosen service and the most useful entered facts (date/time and passenger count when known). Allow wrapping at small widths.
- Expand the strip to expose entered details with clearly labelled Edit actions. Do not fill it with repeated `Još nije izabrano` rows. Use native `details/summary` or an equivalent correctly managed `aria-expanded` disclosure.
- Step 4: show the complete review before contact details, grouped into service, schedule, route, passengers, vehicle, and pricing as applicable. Hide the compact strip to avoid duplicate summaries.

Every review value derives from the same canonical state as the fields; no independent summary model with stale values. Render user-entered content as text, never executable HTML. Edit actions name their destination (for example `Izmeni: Plan puta`) and return to the relevant panel. Forward jumps must still validate any intervening required data.

Do not invent a price for an incomplete request. Use existing pricing resolvers and qualification rules. Preserve the distinction between fixed price, estimate, and quote required; show route scope, one-way/return context, duration, and other qualifying information when necessary. Missing prices are not zero. Recompute or remove a displayed fare when dependent fields change.

### 13.8 Actions, validation, and recovery

Place Back and the primary next action inside the same light panel as the fields. Use a dark filled button with light text, strong readable contrast, and a comfortable target of at least 44px. Back is visually secondary. On narrow screens, make the primary action full width and keep Back close below or beside it without overlapping content.

Suggested Serbian action labels:

- Step 1: `Nastavi na plan puta →`
- Step 2: `Nastavi na izbor vozila →`
- Step 3: `Pregledaj zahtev →`
- Step 4: `Pošalji zahtev` or `Zatraži ponudu`, following existing request eligibility and pricing logic.

Localize all customer-facing strings. Do not hardcode Serbian copy in the production component or force long translations to fit with truncation or smaller type.

Continue should be understandable and clickable before validity is known. Clicking it validates the current step and gives a clear, actionable reason if progress is blocked. Associate inline errors with inputs using `aria-describedby`, mark invalid fields, and announce a concise error summary. Do not expose technical validation details to customers. Corrected fields should clear their relevant errors; no stale error state after a legitimate step/service change.

Back/Edit preserves valid entered fields, including contact details. Changing service, passenger count, route, duration, or other dependencies revalidates or clears only affected selections according to existing domain rules. If an incompatible vehicle is reset, explain that change. Do not delete an entire request merely because the visitor edits an earlier step. Do not permit navigation shortcuts to preserve a falsely completed invalid later step.

### 13.9 Preserve production business and submission behavior

This is a presentation and interaction refinement, not a reduced replacement booking engine. Keep:

- URL handoff parsing and valid service preselection.
- Existing non-PII draft recovery rules and deliberate URL cleanup.
- Every canonical service branch, required field, package, lead-time rule, timezone rule, and supported option.
- Passenger/capacity, luggage, multiple-vehicle, child-seat, route, invoice, corporate recurring/one-off, waiting, schedule, return, multi-day, and international gating where currently supported.
- Canonical vehicle configurations and IDs. DR-06's generic showcase family naming does not authorize collapsing operational V-Class capacities. It is acceptable to show a short model name with a separate configuration/capacity label, while keeping choices distinguishable and existing data intact.
- Existing submission payload, server validation, Turnstile verification, unavailable-state handling, pending-state double-submit protection, failure recovery, and genuine success response handling.
- Manual confirmation: submitting a request does not guarantee availability or confirm a reservation.

Do not retain the preview's demo success screen, simplified validation, sample arrays, or no-network behavior in production. Conversely, the preview must never invoke production submission or imply that a request was actually delivered.

### 13.10 Visual and accessibility requirements

Reuse Theme V2 roles: dark page background, light functional surface, text-on-light, supporting text, input surface, control borders, and visible focus. Inter Tight headings and Manrope body/UI remain. Use existing card/section/control radius semantics. Do not change the global palette, fonts, or heading weight files under this task.

Primary and secondary text must be readable at normal size. Check text contrast, control boundaries, focus visibility, and all progress states using the actual resolved tokens. Do not rely on opacity to make inactive steps so dim that labels disappear. Required fields have visible labels; placeholders only give examples. Radio sets have legends. Hidden conditional fields and inactive panels are excluded from keyboard navigation and validation when inapplicable.

Support keyboard-only use, browser zoom, long localized labels, large text, native select/date controls, mobile screen keyboards, and screen readers. No page-level horizontal overflow. Do not mask overflow globally. Respect reduced motion. Validate all locales and all applicable service branches in production; this Serbian preview is not that validation.

### 13.11 Implementation sequence for the coding agent

1. Read current repository instructions, booking contracts, and the complete controller; inventory supported fields and service gates before editing.
2. Capture baseline rendered booking states and confirm the production submission path. Record behaviors that must remain.
3. Amend booking blueprint, wireframe, theme contract, and relevant component contracts to encode this owner-approved direction.
4. Recompose `BookingPage` and `BookingWizard` into one panel, moving existing progress/actions and removing duplicate introductory/sidebar composition. Avoid unnecessary controller rewrites.
5. Extend progress rendering/state tracking for readable active/completed/future states and validated navigation. Add compact summary from existing canonical state; reuse existing review helpers where possible.
6. Migrate copy in all supported locales. Preserve field IDs/payload contracts where appropriate; remove obsolete layout rules and duplicate summaries after verifying consumers.
7. Check handoff, draft recovery, step navigation, dependency changes, pricing, and real submission states with targeted tests and safe test fixtures.
8. Render each relevant state at responsive thresholds, keyboard and enlarged-text conditions. Run the currently required repository quality gates.
9. Report exact changes, production checks, remaining limitations, and contract updates. Mark DR-07 implemented only after production code is actually changed; mark verified only after evidence exists.

### 13.12 Acceptance checklist for production

- [ ] One centered light panel contains progress, active fields, conditional summary, and actions.
- [ ] H1/introduction lead directly to it; duplicate middle introduction and sidebar are removed.
- [ ] Four stages remain; completed stages are revisitable and future navigation cannot bypass validation.
- [ ] Active stage and total count are clear on desktop/mobile and do not rely on color alone.
- [ ] Radio rows have distinct selected/hover/focus states; subservices appear adjacent to their category.
- [ ] Summary is absent at step 1, compact/expandable at steps 2–3, and replaced by complete review at step 4.
- [ ] Summary/edit content stays synchronized with real request state; no empty-value clutter or stale fares.
- [ ] Clear primary labels, Back behavior, inline errors, focus handling, and value preservation work.
- [ ] All original domain options, configuration IDs, price qualifiers, validation, handoff, and recovery behavior remain intact.
- [ ] Final actions preserve manual confirmation and genuine server submission, failure, pending, and success handling.
- [ ] Serbian, English, and Russian content, keyboard use, large text, contrast, and required responsive widths are verified.
- [ ] Date/time fields, compact summary, and final review follow section 13.15, including return trips, validation, and browser-locale independence.
- [ ] Required contracts and repository gates are current; no unrelated global theme or page changes.

### 13.13 Standalone preview scope

Companion file: `luksuzniprevoz-booking-preview.html`. It embeds the font bytes and uses no CDN, adjacent assets, storage, or form API. It opens as a self-contained HTML document. It is a functional design prototype, not a complete export of the production booking engine.

The preview demonstrates all four stages; service/subservice selection; representative conditional trip fields; inline validation; optional return fields with chronology validation; passenger count and vehicle capacity feedback; compact summary disclosure; editable final review; preserved contact fields while navigating; fixed single-direction Belgrade airport sample fares where the chosen configuration has an existing rate; otherwise quote-required presentation; and a clearly labelled no-submission completion screen.

The source rate snapshot is from the reviewed repository. It is illustrative, not a current public quotation. The prototype does not verify address scope, availability, lead time, flight details, or the production package/pricing rules. It deliberately omits several advanced branches listed in 13.9; it does not implement URL handoff, draft recovery, production security checks, server validation, network submission, or all-locale copy. Numeric demo bounds are input guardrails, not new business capacity limits. The Kodiaq capacity is unknown and remains subject to team confirmation; never infer a verified capacity from its selection. All operational capacities still require production rules.

The prototype starts with no service selected so the active selection is unambiguous; this is not an instruction to discard valid incoming preselection in production. Model names are concise, with the two V-Class capacities distinguished in the select. The prototype has a minimal brand header, not a replacement production navigation/footer design. Its contact link opens the existing website in a new tab only if deliberately clicked.

Do not copy its embedded assets, hardcoded palette, inline JavaScript, simplified data, or static copy wholesale into Astro. Recreate the approved interaction with existing foundations and domain logic. No request is transmitted and no real reservation is created when the preview's final button is clicked.

### 13.14 Preview verification record — 2026-09-24

- Rendered in headless Chromium 133 with embedded fonts loaded.
- Initial panel checked at widths 320, 650, 651, 767, 768, 1023, 1024, 1440, and 1920px; no document horizontal overflow detected.
- Desktop and mobile initial states, desktop expanded summary, and desktop/mobile final review screenshots visually inspected.
- Exercised empty-service validation, required trip fields, return-transfer chronology, airport vehicle/price presentation, summary expansion, review Edit navigation, passenger-capacity fallback, contact value preservation, and the no-submission completion screen.
- Exercised business subservice selection, schedule input, quote action, and company validation.
- Fixed a review-button interruption caused by unnecessary summary replacement on contact-field blur; the full interaction check then passed.
- No browser JavaScript errors or HTTP(S) requests during the exercised flow. The external contact link was not followed.
- Production checkout remained unchanged.

These are bounded prototype checks, not a comprehensive accessibility audit, all-service/all-locale review, enlarged-text certification, pricing certification, production build, or submission test. Production DR-07 remains unimplemented.


### 13.15 Locked refinement — Serbian date and 24-hour time

**Owner-approved decision, 2026-09-24.** The booking interface must use an explicit day/month/year date and 24-hour time. This is part of DR-07, not a separate optional design proposal. Implement it without adding external date, input-mask, or calendar libraries.

| Concern | Required behavior | Example |
| --- | --- | --- |
| Visible date | Zero-padded `DD/MM/YYYY`, using slashes | `24/09/2026` |
| Visible time | Zero-padded `HH:mm`, 24-hour clock; no AM/PM | `18:30`, `09:05`, `00:00` |
| Booking summaries | Same numeric format in compact summary, expanded details, and final review | `24/09/2026 · 18:30` |
| Return trip | Same controls, formats, and timezone as outbound trip | `25/09/2026 · 10:00` |
| Time interpretation | Belgrade local time (`Europe/Belgrade`), with daylight-saving rules | Visible help: `Vreme je lokalno, za Beograd.` |
| Canonical state/payload | Preserve date `YYYY-MM-DD` and time `HH:mm` and existing API schema | `2026-09-24`, `18:30` |

This requirement is mandatory for the Serbian booking experience. Keep formatting separate from translated labels and avoid accidental dependence on the visitor's browser locale. Do not change the language declaration of English/Russian routes to Serbian as a formatting workaround, or expand this decision into an unrelated site-wide localization change.

#### Control implementation

1. Use a visibly labelled date text field with explicit `DD/MM/YYYY` guidance and a small vanilla JavaScript/TypeScript parser/formatter. Support typing, paste, correction, and clearing without aggressive cursor movement. A placeholder alone is not the label or format instruction. Normalize valid input on blur or successful validation; do not continually overwrite partial input.
2. Use separate native hour/minute select controls, visually grouped as one time field. Label both parts accessibly. Hours run `00`–`23`, minutes `00`–`59`; preserve any existing domain restriction rather than introducing arbitrary 15- or 30-minute rounding. Empty selections must remain empty until supplied by the user or a valid handoff/draft. Combine a complete selection into canonical `HH:mm`.
3. Retain an optional native calendar action where practical, synchronized to the same canonical date. Its browser-controlled popup may use the visitor's regional presentation; the visible application field and summary must still show `DD/MM/YYYY`. Feature-detect native picker support and keep manual entry available when it is unsupported. Do not make a full custom calendar a requirement of this refinement.
4. Set the appropriate Serbian page language, such as `sr-Latn-RS`, for semantics. Do not claim that `lang`, `placeholder`, or an invented `format` attribute forces the native `date`/`time` widget's rendering. Native date and time control presentation is browser/locale dependent even though their underlying values are normalized.
5. Keep one authoritative booking date/time value. Display controls, optional native picker, handoff restoration, draft recovery, Back/Edit, summary, and submission must all synchronize through it. If an edit becomes incomplete or invalid, block progression and avoid silently submitting the previous valid value.

#### Validation and timezone handling

Parse day, month, and year explicitly; never use ambiguous `Date.parse('24/09/2026')`. Validate actual calendar dates, month lengths, and leap years. A regex or HTML `pattern` only checks the shape, not whether a date exists. Reject impossible dates such as `31/02/2026`; never let JavaScript overflow silently convert them to another month. Accept `29/02/2028` and reject `29/02/2027`.

Use the established booking validation and timezone helpers for lead time, allowed dates, return-after-outbound ordering, and daylight-saving edge cases. Do not interpret a Belgrade booking as the visitor's local timezone or hardcode a permanent UTC offset. Do not turn a date-only string into a UTC timestamp and format it in the visitor's timezone, which can shift the day. Preserve date/time strings and apply `Europe/Belgrade` explicitly only when an instant/comparison is needed by existing business logic.

Keep inline localized errors, focus handling, `aria-invalid`, and associated help text consistent with section 13.8. Preserve server-side validation and payload compatibility. This refinement changes presentation and input handling, not booking eligibility or reservation status.

#### Acceptance and existing-preview status

- [ ] All Serbian outbound/return date fields and summaries display `DD/MM/YYYY`; all times display `HH:mm` without AM/PM.
- [ ] Manual entry, paste, clearing, optional calendar selection, Back/Edit, and handoff/draft restoration remain synchronized.
- [ ] Impossible dates and incomplete time selections block progression; leap years and midnight are handled correctly.
- [ ] Browser settings such as `en-US` do not change the visible application format. Exercise Chrome/Edge, Firefox, and Safari/iOS where available, including a non-Belgrade device timezone.
- [ ] Keyboard and screen-reader labels, mobile layout, and validation remain usable. Calendar support is an enhancement, not a prerequisite for entering a date.
- [ ] No external dependency added; no unintended API schema, pricing, lead-time, timezone, or service-rule changes.

**Documentation-only update:** the existing `luksuzniprevoz-booking-preview.html` still uses native date/time inputs and locale-formatted long dates in summaries. It predates this refinement and is not evidence of compliance with section 13.15. Its layout remains the approved reference; a future authorized preview/production update must apply the rules above. The browser checks in section 13.14 remain historical layout/interaction evidence and do not validate these new controls.

Browser behavior references checked during the decision discussion: [MDN date input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date) and [MDN time input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time).


## 14. DR-08 — Adopt the Belgrade Transfers footer composition

### 14.1 Owner decision and scope

Selected on 2026-09-24: use the footer style from `lukapekic/belgradetransfers-website-astro`, applying this site's own logo, contact details, Theme V2, and real navigation. The desired result is more structured and polished while remaining compact. This is a shared footer migration across the site, not a homepage-only alternative.

This task records the decision and supplies reference source for a coding agent. Production implementation is pending. Coordinate with DR-09: the new footer must display **Luksuzni transport** and the approved non-GS logo, with no parent-company attribution.

### 14.2 Source and handoff files

- Reference repository: `lukapekic/belgradetransfers-website-astro`.
- Pinned branch: `main`.
- Pinned commit: `ca16f7da6db86a3e75e8c1deea712e35d29101c5`.
- Component: `examples/reference-site/src/components/site/SiteFooter.astro`.
- Exact footer blob: `ed1c97d46564f7c5769600b96c8badb515729ba4`.
- The same footer blob was found on `homepage-section-design` and `fleet-page-design`; no different footer version was selected from those branches.
- Source design brief: `project-starter-docs/design/shared/06-site-footer.md`.
- Target component: `site/luksuzni-prevoz/src/components/site/SiteFooter.astro`.
- Target baseline remains `master` at `7cb3e9b2f606615138a3c0c99b2e0f51e08d31dd`, reconfirmed during this scan.

Companion deliverables:

1. `belgradetransfers-SiteFooter.reference.astro`: entire original component, byte-identical to the pinned Git blob; no adaptation mixed into the source.
2. `belgradetransfers-footer-reference.md`: self-contained source/adaptation guide with the complete footer, complete icon component, complete source brand component, source navigation data, dependency map, and verified blob provenance.

The original source contains Belgrade Transfers names and original contact/placeholder behavior deliberately for provenance. It is archival input, not target production code. The companion guide clearly separates it from the owner-approved adaptation. An agent can understand the migration from this backlog without prior conversation; the companion includes the exact code needed for reference without access to the sibling checkout.

### 14.3 Preserve the three-tier structure

| Tier | Composition | Target adaptation |
| --- | --- | --- |
| 1 — Utility | Logo plus direct contacts, secondary operational/social area at the opposite edge | Own logo, verified telephone and email; concise office hours. Add social/WhatsApp only when target data verifies them. |
| 2 — Navigation | Four balanced groups, readable labels, quiet links | Use the target group/route inventory below; do not copy destination or model-page placeholders. |
| 3 — Bottom | Copyright/legal left, location and inline languages right | `© {year} Luksuzni transport`, localized rights text, verified location, route-aware SR/EN/RU; legal links only when genuine published destinations exist. |

Retain thin semantic separators between tiers, aligned columns, clear contact emphasis, subdued secondary text, and restrained outline icons. Use the source's `full` composition. Do not import its temporary `holding` variant or change site mode. No newsletter, oversized logo watermark, campaign image, social widget, accordion, or additional primary CTA belongs inside this footer. FinalCTA remains a separate section.

Source code is not evidence that literal transplantation will make the footer shorter: its outer padding is 4rem/5rem, navigation tiers use 3rem padding, and link rows are 44px. Preserve the organized horizontal composition, then tune spacing using the target's semantic tokens and actual content. Do not reduce font sizes or targets to manufacture compactness.

### 14.4 Navigation adapted to real target routes

The source's Destinations group has no equivalent published destination pages in this project. Do not copy those labels or invent route URLs. Use the same four-column visual rhythm with these target groups, in order:

| Group label (SR) | Route keys in display order |
| --- | --- |
| Usluge | `privateChauffeur`, `airportTransportation` |
| Poslovni prevoz | `businessTransportation`, `corporateTransportation`, `delegationTransportation`, `conferenceCongressTransportation` |
| Posebne prilike | `specialEvents`, `weddingTransportation`, `promTransportation`, `vipTransportation` |
| Informacije | `fleet`, `pricing`, `contact` |

All these route keys exist and are published at the inspected baseline. Group labels require localized UI keys; link labels reuse canonical route/navigation labels. The first links in the two specialized groups lead to their hub; keep heading/anchor semantics explicit rather than using a decorative heading as a dead link.

Store this inventory in the target navigation layer. Update its types, flattening helpers, published-route filtering, and parity assertions to support the four groups. Do not leave a second hardcoded inventory in the footer, and do not alter the header tree as an accidental side effect. If route availability changes, omit unavailable links/groups cleanly.

There are currently no `about`, Privacy, or Terms routes in the target route map, despite the configuration's `legalPages` capability. Do not copy source placeholder labels or fabricate these URLs. Preserve/add bottom legal links only when existing published destinations are verified; creating legal pages is a separate content task. Do not introduce a second booking CTA merely to fill space.

### 14.5 Contacts and missing-data handling

The inspected target `src/data/contact.ts` marks these values verified:

| Fact | Source snapshot |
| --- | --- |
| Telephone | `+381 60 111 9999` |
| Email | `office@luksuzniprevoz.rs` |
| Office | `Antifašističke borbe 25`, `11070`, Belgrade, Serbia |
| Office hours | Every day, `08:00–18:00`, Europe/Belgrade |
| Maps URL | `null` |

These are repository-verified facts, not fresh external verification. Consume current data rather than copying this table into markup. Keep `tel:`/`mailto:` behavior and proper label formatting. Retain office hours as concise readable information, not an expanded marketing paragraph. Location/address may sit in the lower utility region with natural wrapping; avoid repeating the full address in multiple tiers.

The target has no verified WhatsApp or Instagram field in its contact model. Do not infer WhatsApp from the telephone number, use the sibling's details, or render disabled social placeholders. With current data, the top row is own logo + telephone + email, with office hours as the quieter counterpart. If genuine profiles are added later, use verification-gated optional slots and suppress empty headings. Preserve actual office/response policies; no 24/7 or instant-confirmation claims.

The source's email exclusion is source-specific and is explicitly not adopted: email is a verified target channel and remains present.

### 14.6 Theme, logo, and interaction mapping

Keep the active **Theme V2 Black & Platinum** palette, Manrope body/UI roles, existing semantic sizes/weights, and approved target brand artwork. Keep the source's hierarchy (compact group labels, readable quiet links, higher-contrast contact links) without importing its Sora/Inter typography, Midnight Titanium colors, or literal spacing values.

Use the target main container and gutters (`80rem` main at the inspected theme), not the sibling's `100rem` container. The target remains a full-width dark surface with contained tiers. Use a calm graphite background/surface treatment and semantic dividers. The source's radial/linear gradient is not an instruction to introduce a blue tint, glow, or a global theme change; the target's existing no-glow/no-heavy-shadow rules remain.

Use the approved non-GS target logo through the shared brand component; see DR-09. Footer placement should have a modest horizontal footprint and accessible home-link name. Preserve intrinsic aspect ratio and avoid a large brand column that forces utility contacts down unnecessarily.

Outline contact/location icons should inherit currentColor, be decorative when adjacent text supplies the name, and retain visible text labels. No permanent icon boxes, WhatsApp green, or Instagram gradient. Keep visible focus, understated hover, and non-color current-page cues where appropriate. If terminal link arrows move, reduced-motion disables positional movement. Prefer no dedicated footer JavaScript.

### 14.7 Responsive and locale contract

The target already has the reference's relevant breakpoint values. Use the target tokens and lock these deterministic compositions:

| Width | Composition |
| --- | --- |
| Below `md` / 48rem | Stacked utility tier; visible stacked navigation groups; bottom metadata/language/legal content wraps in reading order |
| `md` / 48rem up to `xl` / 80rem | Two-column utility composition; navigation 2×2 in the same group order; two-column bottom utility region |
| `xl` / 80rem and wider | Horizontal utility rows; four navigation columns; inline bottom groups with natural internal wrapping for long localized content |

Thus 1024px remains the two-column/tablet footer state; do not switch early just because the current footer uses 64rem. Check 767/768 and 1279/1280 as well as the repository's 320/768/1024/1440/1920 reference widths.

Use a single semantic bottom region. The source duplicates mobile/wide bottom markup; copying that is unnecessary and risks duplicate IDs, navigation landmarks, and focus stops. Keep meaningful DOM and keyboard order coherent across layouts. No horizontal clipping, line truncation, or smaller translated text to force a fit. Minimum interactive targets remain 44×44 at every width; narrow group lists do not get an exemption.

Include inline `SR · EN · RU` using shared route-preserving locale logic. The target `LanguageSwitcher.astro` currently implements a dropdown and **does not support the source's `presentation="inline"` prop**. Extend its shared contract with an inline presentation while retaining the existing dropdown default for the header. Reuse configured locale metadata, `getPath`, accessible names, and current-locale state; never hardcode language URLs or replace the header behavior to accommodate the footer.

### 14.8 Contract migration and implementation sequence

1. Read current AGENTS/DESIGN, footer/header/brand contracts, and this reference pack. Run the target's normal design preflight when production work begins.
2. Amend `src/docs/home/home-components/12-site-footer.md` to the new three-tier contract and remove its parent-company placement permission. Update related homepage blueprint/wireframe/checklist and applicable shared shell contracts. Update documentation before code so the prior three-zone/mark-only footer cannot be reinstated by a later agent.
3. Apply DR-09 canonical identity and brand asset changes; use that canonical public identity for copyright and accessible naming.
4. Extend footer navigation data and the shared language switcher API as described, without changing header navigation or dropdown defaults.
5. Rebuild `SiteFooter.astro` around the three tiers using target primitives, tokens, verified contacts, and real route keys. Remove obsolete old footer layout CSS. Avoid copying source-only data models, holding variants, placeholder spans, and duplicated bottom DOM.
6. Update source/footer tests that assert the old GS-only layout. Run route/locale validation and focused shared-component browser checks.
7. Check the footer below homepage/service/fleet/pricing/contact/booking endings across all locales and required widths. Inspect long email/address content, focus, reduced motion, and zoom. Run required repository gates and record production evidence separately.

### 14.9 Acceptance and evidence

- [ ] Same shared three-tier footer across all public page consumers.
- [ ] Own theme, approved logo, canonical Luksuzni transport name, and verified target contacts only.
- [ ] Four target navigation groups use real published localized routes; no sibling destinations, placeholders, or invented detail URLs.
- [ ] Copyright/location/inline locales are compact and legible; legal links resolve to real pages only.
- [ ] No GrandSolution text, GS logo, or parent-company attribution in any rendered footer state.
- [ ] Empty social blocks omitted; office hours retained accurately.
- [ ] Responsive 1/2/4-column composition, 44px targets, keyboard focus, zoom, and locale wrapping verified.
- [ ] Shared locale dropdown behavior in the header remains unchanged.
- [ ] Source hashes, migrated contracts, required gates, and production screenshot evidence recorded before marking complete.

Completed in this task: GitHub source/tree/branch review, dependency inspection, target comparison, and hash-verified source extraction. Not completed or claimed: a new footer HTML preview, rendered reference-site audit, production implementation/build, or browser validation of the proposed target footer.

## 15. DR-09 — Remove parent-company branding; use Luksuzni transport

### 15.1 Locked identity decision

Owner instruction, 2026-09-24: remove all GrandSolution/GrandSolutions/Grand Solutions references from the footer and entire customer-facing website; keep only **Luksuzni transport** as the public brand.

Use that exact spelling and casing for public entity identification, copyright, brand labels, accessible logo names, and metadata identity. Brand identity stays consistent across Serbian, English, and Russian; surrounding prose/navigation is localized. The prior `Luxury Transportation` and `Luksuzni Prevoz` entity labels in the reviewed source are migration inputs, not competing new brands. This does not mean replacing every ordinary descriptive phrase about luxury transportation or Serbian `luksuzni prevoz`: retain useful generic service wording where it is not acting as an entity name.

This decision supersedes older rules requiring the GS mark, a literal Luxury Transportation lockup, or quiet parent-company attribution. Update conflicting active contracts so future agents do not restore them. Domain `luksuzniprevoz.rs`, real contact addresses, route slugs, service facts, and booking behavior remain as configured; a public-name change does not imply changing those identifiers.

### 15.2 Source-confirmed cleanup inventory

Paths below are relative to the target repository root. Line numbers are intentionally omitted because the coding agent must resolve the current checkout.

| File/area | Finding | Required action |
| --- | --- | --- |
| `site/luksuzni-prevoz/src/components/site/SiteFooter.astro` | Visible copyright reads `business.parentCompany.name`; comments mandate parent attribution/GS mark | Bind copyright to canonical public identity, remove attribution markup and obsolete comments; migrate under DR-08 |
| `site/luksuzni-prevoz/src/data/business.ts` | `ParentCompany` interface and object name GrandSolution, relationship key, footer placement, operating-since value; publicBrand currently Luxury Transportation | Remove obsolete public parent relationship and unused types/references; unify public identity. Do not mechanically rename the parent company to Luksuzni transport or infer a new legal identity/founding claim |
| `site/luksuzni-prevoz/src/content/ui/{sr,en,ru}.json` | `business.parentCompanyDescription` describes branch relationship; `brand.monogram` is GS | Remove unused relationship keys through parity/generation workflow; rewrite any necessary company introduction without affiliation. Remove or replace GS monogram usage with approved brand assets, not an invented new monogram |
| `site/luksuzni-prevoz/src/foundation/ui/BrandLockup.astro` | Imports `GsMark`; literal Luxury Transportation wordmark also supplies hidden accessible name | Integrate own approved logo and canonical name for all variants and consumers |
| `site/luksuzni-prevoz/src/foundation/ui/GsMark.astro` and `src/assets/logo.webp` | Code-native GS symbol; raster asset visually inspected and also contains GS | Remove from active imports/served asset use; replace all customer-facing instances with approved own logo; delete unused legacy assets only after reference checks |
| `site/luksuzni-prevoz/src/components/site/SiteHeader.astro` | Shared GS lockup used in desktop/mobile header | Inherit corrected shared brand component; preserve header geometry/navigation behavior |
| `site/luksuzni-prevoz/foundation.config.ts` | Config brand is Luksuzni Prevoz, differing from business.publicBrand | Align canonical public identity and dependent configuration without changing site URL or locale routing |
| `site/luksuzni-prevoz/src/lib/seo.ts` and `src/layouts/BaseLayout.astro` | Metadata/schema draw brand from both config and business sources | Ensure one identity drives title suffixes, WebSite/LocalBusiness names, and rendered head data; verify output, not merely source replacement |
| `site/luksuzni-prevoz/src/content/pages/contact/contact.{sr,en,ru}.md` | Contact descriptions identify Luxury Transportation | Replace entity-name occurrences with approved identity while preserving localized meaningful copy |
| `site/luksuzni-prevoz/src/docs/home/home-components/{02-site-header,12-site-footer,14-visual-compliance-checklist}.md` and `src/docs/home/reference/{blueprint.md,wireframe.html}` | Active rules/checklists demand GS visuals or permit parent-company footer text | Amend to approved new identity and DR-08 before implementation; retain source history as superseded evidence where necessary |
| `site/luksuzni-prevoz/src/docs/fleet/wireframe.html` | GS header/footer placeholders and explicit GrandSolution copyright | Update maintained wireframe examples so agents cannot copy obsolete branding |
| `site/luksuzni-prevoz/src/pages/dev/ui.astro` | Dev demonstration prose still describes GS/literal old wordmark | Update reference prose and examples along with shared component; ensure dev pages are not treated as current brand authority |
| `site/luksuzni-prevoz/tests/smoke/footer.spec.ts` | Test name and accessible-name assertion expect GS-only / Luxury Transportation | Replace assertions with intended new brand and layout behavior; retain meaningful accessibility checks |
| `packages/astro-foundation/src/generated/types.ts` | Generated union includes removed relationship UI key | Regenerate via approved generator after canonical key changes; never hand-edit generated output |

Further search targets required during implementation: all page/UI content, additional metadata maps, JSON-LD payloads, SVG titles/alt text/aria labels, Open Graph image templates and generated images, favicon/app icons/webmanifest where present, form/customer-email templates, public downloads, and source/build output. `functions/_shared/email-rendering.ts` exists and should be checked for rendered brand/context use; no direct old-brand match was found in the functions scan, so this is a regression check, not a confirmed replacement location.

The inventory distinguishes actual matches from areas that require output verification. Do not claim every page contains GrandSolution merely because the global footer does; the visible footer affects all its consumers, while the localized relationship keys may be dormant.

### 15.3 Logo asset handoff

The inspected target checkout still uses GS in both vector code and its legacy `logo.webp`; renaming an alt attribute does not remove the visible logo. Use the owner's approved Luksuzni transport logo assets, not the sibling Belgrade Transfers logo and not a recreated GS mark.

The earlier supplied logo deliverable is named `luksuzni-prevoz-logo-package.zip`. That package is not present as an integrated asset set in the reviewed checkout. The implementation agent must obtain/inspect the approved package, select the appropriate on-dark/on-light symbol/lockup, and check its embedded lettering against the newly approved name. If the supplied lockup contains a different brand name, use the approved symbol with the canonical text treatment or obtain corrected lockup artwork; do not silently ship conflicting lettering. This scan did not modify or regenerate the logo package.

Apply the corrected shared branding in header, mobile navigation, footer, and any other logo consumers. Inspect favicons, app icons, and social preview artwork if present; text searches cannot detect GS paths or raster lettering. Do not replace business/customer/partner logos, car badges, or unrelated source illustrations.

### 15.4 Search and removal boundaries

Success means no customer-facing GrandSolution attribution, old GS identity, or conflicting entity name in visible HTML, accessible names, metadata, structured data, or published brand artwork.

Search case-insensitively for singular/plural/spaced forms: `GrandSolution`, `GrandSolutions`, `Grand Solution`, `Grand Solutions`, the old parent-company key/object, `GsMark`, and exact GS monogram values. Also inspect the actual artwork. Search public entity labels separately for `Luxury Transportation` and `Luksuzni Prevoz` and distinguish names from generic descriptive language.

Use `rg`/`git grep` for source inspection and inspect actual built HTML/assets after implementation. Audit all three locales and production consumers rather than fixing only the footer copyright. Retire unused parent-company/UI fields so future components cannot accidentally reintroduce the relationship. Regenerate typed/localization artifacts through their owned pipeline.

Historical SEO research files under `src/docs/content-review/` contain old-domain research and quotations. They may remain as explicitly historical, non-published evidence; mark them superseded for branding rather than falsifying their history. Current blueprints/wireframes/prompts must not continue instructing agents to use the old identity. This backlog necessarily names the old brand to describe what must be removed.

Preserve incoming-URL redirects such as `kontakt-limo-servisa-gs` and `vehicles-of-limo-service-gs-in-belgrade` in `routes.ts` previousSlugs. They are historical migration keys, not public branding. They should redirect to current clean routes and never appear as navigation labels or canonical URLs. Do not remove working redirects just to force a repository-wide zero-match result. Do not rewrite Git history or touch sibling projects.

### 15.5 Acceptance and verification

- [ ] Canonical public identity is Luksuzni transport; config, business data, accessible lockups, footer, and metadata agree.
- [ ] No parent-company attribution is emitted on any published route/locale.
- [ ] No GS symbol is rendered in header, mobile navigation, footer, or published brand artwork.
- [ ] Necessary public copy is rewritten coherently, not blindly substituted into a false parent-company relationship.
- [ ] Obsolete relationship UI keys/types are removed or migrated consistently; generated artifacts are regenerated.
- [ ] Footer/header/brand contracts and tests reflect the new decision rather than restoring old branding.
- [ ] Contact values, service rules, domain, route availability, and historic redirects remain correct.
- [ ] Post-build source/output scans and manual artwork inspection are recorded, with any historical/redirect matches explained.
- [ ] All configured locales and shared consumers pass applicable production gates and visual/accessibility checks.

Status at delivery: **audit and specification complete; removal has not yet been implemented in the production repository.** The current task created the reference pack and updated this plan. Earlier preview artifacts retain their historical labels until a later requested update.


## 16. DR-10 — Image assignments, natural visibility, and restrained overlays

### 16.1 Owner decision and scope

Decision date: 2026-09-24. Lock the reviewed image direction into this implementation backlog. The owner will add the supplied images to **`site/luksuzni-prevoz/src/assets/shared/`**, retaining their basenames with `.webp` extensions under the later DR-12 handoff decision. This is the site's source asset directory, not repository-root `assets/shared`, `public`, or the existing `shared/other` subdirectory. Treat this as an asset handoff commitment, not evidence that the uploads already exist in the checked-out repository.

The newly supplied chauffeur photograph is owner-confirmed as their own chauffeur. Assign it to the homepage Private Chauffeur service card. Together with the three selected stock photographs below, this defines the first image replacement batch. Preserve actual fleet photography under DR-06. Not every supplied file needs to appear on the website.

This update is a specification only. Production imports, CSS, source images, preview HTML, Git branches, commits, and deployment have not been changed. Selection is locked; final responsive focal positions and gradient stops require rendered verification. Do not call the item visually verified based on this document.

### 16.2 Exact incoming asset inventory

All filenames in this table are relative to `site/luksuzni-prevoz/src/assets/shared/`. Names were updated in v1.7 to the owner-selected WebP production extensions; dimensions refer to the inspected uploads and must be rechecked after conversion. Keep spelling, extension, UUID, hyphens, and parentheses unchanged; static import identifiers may use readable names. Use static Astro asset imports, not constructed public URLs.

| Exact filename | Supplied dimensions | Status and role |
| --- | --- | --- |
| `b58da850-396c-46da-a528-4143ea28d859.webp` | 1200 × 800 | Selected: own chauffeur, homepage Private Chauffeur service card |
| `pexels-georgesultan-11877375.webp` | 2048 × 1365 | Selected: Mercedes on the road, Corporate Transport hero |
| `pexels-triemli-32897253.webp` | 1366 × 2048 | Selected: grille/headlight detail, VIP discretion supporting image |
| `pexels-vishal-makwana-984383-31040135.webp` | 2047 × 1362 | Selected: hood emblem, Special Occasions hub hero |
| `pexels-oneilgonzales-11373655.webp` | 1638 × 2048 | Reserve only: side-mirror journey image; no new active placement |
| `vadym-kudriavtsev-4uCykQ0fNhY-unsplash.webp` | 1152 × 2048 | Reserve only: cockpit image; no active placement or model-specific claim |
| `s-class-interior-1(1).webp` | 1367 × 2048 | No new placement: visually duplicates the existing delegation CTA photograph; retain the existing higher-resolution source import |

The earlier fleet-photo uploads `front-facing.webp` and `left-facing.webp`, if included in the same owner handoff, also keep their exact names under this shared directory. They depict the supplied E-Class views and remain subject to DR-06's canonical fleet-media mapping; do not apply them across other models because their filenames are generic. Their supplied dimensions are 1621 × 1080 and 1620 × 1080 respectively. Do not import screenshot attachments as site imagery. The selected four-file batch above does not relocate the repository's existing fleet originals.

Retain source provenance in the asset inventory. Owner-confirmed authenticity applies to the chauffeur upload and should not be inferred for every stock photo. Vehicle model/generation, airport identity, hotel affiliation, and access privileges must not be inferred from a filename or scenic background.

### 16.3 Locked replacement map

For compactness, paths in this subsection are relative to `site/luksuzni-prevoz/src/`.

| Surface / implementation entry | Existing asset | Selected asset / action |
| --- | --- | --- |
| Homepage Private Chauffeur service card; `components/home/ServiceShowcase.astro`, private-chauffeur image mapping | `assets/services/private-chauffeur-card.webp` | Import `assets/shared/b58da850-396c-46da-a528-4143ea28d859.webp`. Preserve service title, description, CTA, route, and service-card composition. |
| Corporate Transport hero; `components/services/corporate-transportation/CorporateTransportationPage.astro`, `corporateHeroImage` | `assets/shared/other/chauffeur-inside-grayedout.webp` | Import `assets/shared/pexels-georgesultan-11877375.webp`. Remove the current fare-display/QR-code cabin from this hero. Keep the separate working-day image unchanged. |
| VIP discretion section; `components/services/vip-transportation/VipTransportationPage.astro`, `discretionImage` | `assets/shared/other/s-class-hotel-front-winter.webp` | Import `assets/shared/pexels-triemli-32897253.webp`. Remove the seasonal snowy-hotel scene from this section. Retain its content/image split and content hierarchy. |
| Special Occasions hub hero; `components/services/special-events/SpecialEventsPage.astro`, `heroImage` | `assets/shared/other/s-class-driving-forest-intheback.webp` | Import `assets/shared/pexels-vishal-makwana-984383-31040135.webp`. This stops sharing the road photograph with the Corporate Transport working-day section. Do not change Wedding or Prom heroes. |
| Homepage hero; `components/home/HomePage.astro`, `heroImg` | `assets/hero-example-2.jpg` | Keep this own-fleet side-profile photograph; revise the darkening in `HomepageHero.astro`. |
| VIP hero; `components/services/vip-transportation/VipTransportationPage.astro`, `heroImage` | `assets/pages/vip-transportation/hero.png` | Keep the current image for this batch and remove redundant darkening. If source detail remains inadequate, record an unresolved asset need; no unapproved replacement is selected here. |
| Delegation final CTA; `components/services/delegation-transportation/DelegationTransportationPage.astro`, `finalCtaImage` | `assets/shared/other/s-class-interior-1.webp` | Original DR-10 retention is superseded by DR-12: use `assets/shared/final-cta-interior-v2.webp` for this closing section. Do not substitute the lower-resolution duplicate incoming interior; retain the old source for any other valid consumers. |

For DR-10 placements, use only the four selected incoming files in new active imports. DR-12 additionally selects `final-cta-interior-v2.webp` for closing CTAs. Reserve images may exist in the asset directory without any active import. Do not force the mirror or unfamiliar cockpit into a page to consume all uploads. The externally researched chauffeur/luggage stock listing is not selected; the owner's chauffeur photo now fills the immediate homepage card need.

### 16.4 Avoid repeating the chauffeur photograph on the homepage

Source review found that `HomePage.astro` already supplies `assets/sections/home/private-chauffeur.webp` to the larger `PrivateChauffeurFeature`. That existing 1200 × 800 file depicts the same chauffeur-at-the-wheel composition as the new UUID-named upload. This is a visual duplicate even if byte encoding differs.

The new upload's primary homepage assignment is the service card. For the larger feature, use the existing `assets/shared/chauffeur-service/productivity-backseat.webp`: a passenger working on a laptop. This is a supporting editorial image already used on the related Private Chauffeur page, not proof of a named customer, a particular fleet model, or a guaranteed laptop/screen amenity. Reuse across these directly related service contexts is intentional; repeating the same driver composition twice on the homepage is not.

Change the feature image binding in `HomePage.astro`, retaining the existing 4:3 feature footprint, section content, package data, and CTA. This gives the two homepage sections distinct roles: the card shows the chauffeur; the feature explains productive passenger time. Do not copy unrelated service-page layout or text. If current content/asset verification invalidates that supporting photo, record the specific issue rather than silently repeating the driver photo or inventing an amenity claim.

Do not delete superseded physical assets until all live imports and other consumers have been checked. A replaced import is not permission to remove an asset still used elsewhere.

### 16.5 Visibility contract: image opacity and overlay opacity are different

**All selected image elements remain fully opaque (`opacity: 1`) in default, hover, focus, and selected states.** Do not lower parent/container opacity, since that also fades text and controls. Natural source colours are the baseline. Use `filter: none` for the selected incoming images, fleet photos, and supporting photos beside text. Do not stack a brightness reduction, desaturation, vignette, and full-frame overlay to make every photo look equally dark.

Darkening needed for overlaid text belongs on a separate decorative scrim layer above the image and below content. Its colour comes from existing semantic theme tokens. Numeric alpha/gradient geometry below describes image treatment, not a new palette. `transparent 80%` in a colour mix means approximately 20% colour contribution; do not invert that relationship when implementing the spec.

| Image role | Locked treatment |
| --- | --- |
| Fleet card (DR-06) | No overlay, tint, gradient, filter, or image fade; all information remains below the photo. This rule is stronger than the service-card rule. |
| Supporting photo beside text, including VIP grille and homepage passenger feature | Full opacity, no scrim, no brightness/contrast/saturation filter. Text stays outside the image. |
| Homepage chauffeur service card | Retain overlaid service copy and a localized bottom gradient; the upper and central image must remain clearly visible. Do not convert ServiceCard into FleetCard. |
| Homepage / selected service heroes | Full image opacity with a text-side gradient only where needed; no global brightness reduction or broad radial vignette. Protect header readability with a compact top treatment only if necessary. |
| Hover/focus | Preserve image exposure. Use existing link/CTA and focus cues; no darkening or zoom to indicate interaction. |

Starting gradient profile for the chauffeur card, measured from the top of its image box: 0% overlay alpha through the upper 45%; around 15% alpha at 60% height; around 55% at 80% height; around 90% at the bottom. These are initial rendering values, not a claim of achieved contrast. Adjust the gradient locally to the actual copy height and crop. Aim to keep the focal wheel/hands region under no more than approximately 20% overlay alpha. If legible text and visible hands cannot coexist in the current crop, reposition the photo/content or adjust that card's responsive height within its updated contract; do not apply a uniform black wash.

Starting hero profile: approximately 65–80% alpha directly behind the main copy, tapering to 0–15% over the subject area. A source that is already dark may need substantially less. Keep the header scrim restricted to its visual region rather than extending it across the entire photograph. Avoid accumulating several gradients over the same subject. No mandatory opacity number overrides text contrast or subject visibility; record the final measured/visually reviewed values by image and viewport.

Body/normal text needs at least 4.5:1 contrast and qualifying large text at least 3:1 against the actual composited background. Inspect the lightest background behind each line, including the longest localized text. Automated checks alone cannot certify text-on-photo contrast. Buttons and keyboard focus must remain identifiable independently of photo brightness.

### 16.6 Source-confirmed CSS work and component boundaries

- `components/home/HomepageHero.astro`: current image filter is `brightness(0.68) contrast(1.08) saturate(0.72)`, followed by radial and two linear gradient layers. Remove that blanket filter and broad vignette for the retained fleet photo; rebuild the minimum text/header legibility treatment. Preserve hero structure, H1/actions, header integration, and existing motion/reduced-motion contract.
- `components/services/shared/ServiceHero.astro`: full-bleed media currently receives `brightness(0.7) contrast(1.06) saturate(0.76)` and three scrim layers. Corporate, Special Occasions, and VIP use this variant. Introduce an explicit, documented treatment/focal-point input if needed; do not weaken every unrelated service hero through an unscoped selector. Keep the old default for untouched consumers unless they have been individually reviewed and included in scope.
- `components/shared/ServiceCard.astro`: the current bottom scrim reaches 70% colour contribution at 45% from the bottom and hover/focus applies `brightness(0.9) contrast(1.06)`. For the selected chauffeur card, localize the gradient as above and remove exposure changes on interaction. Extend the typed presentation API if needed, documenting the default and checking all consumers; do not create a one-off duplicate card or bypass layout-only class passthrough with visual overrides.
- `components/services/vip-transportation/VipDiscretion.astro`: current supporting photo has `brightness(0.72) contrast(1.06) saturate(0.68)`. Remove the filter for the new grille image. There is no overlaid text to justify darkening it. Resolve the actual current filename if renamed in a newer checkout.
- `components/home/HomePage.astro` owns the homepage feature image binding. Do not modify the global `OpenSplitSection` treatment merely to change this image. Review its actual integrated variant so unrelated split sections are preserved.

Put image choice and image-specific focal metadata in the site's approved media/presentation data boundary. Components own rendering/treatment; localized content owns copy. Do not use arbitrary global CSS, filename-substring selectors, hardcoded locale paths, or duplicate per-page components. Update the matching image-role/page/component contracts before implementation so old requirements cannot restore heavy filters later.

### 16.7 Responsive crop and resolution instructions

The crop is part of the assignment, not an incidental `object-fit: cover` default. Use the actual rendered media box and image aspect ratio; `object-position` cannot recover content already cropped from both sides. Do not distort the photograph, mirror lettering, invent pixels, or upscale a small source to manufacture detail.

| Asset / placement | Features to protect | Starting focal guidance; verify in browser |
| --- | --- | --- |
| Own chauffeur / homepage service card | Both hands and their contact with the wheel, Mercedes wheel centre, suit cuff; face is not essential | Start around `40% 42%`; keep the wheel in the upper/middle clear zone. Source is landscape 3:2. Inspect the tall desktop mosaic cell separately from mobile's natural 3:2 card. A tight crop must still read as a chauffeur, not a detached badge or watch. |
| George Sultan / corporate hero | Recognisable vehicle, roofline, front/rear body and wheels where the frame allows; never leave only dark foliage | Start around `58% 60%`; compose copy away from the car. At narrow widths deliberately position the vehicle in a clear media area; do not assume desktop centre crop survives. If the approved hero geometry cannot accommodate a recognisable car and all localized copy, record and resolve the crop/layout issue before marking this placement complete. |
| Triemli / VIP supporting section | Hood ornament, grille, headlight, useful body reflections | Start around `52% 52%`. Preserve its portrait character on desktop; on mobile review the section's image height so the ornament and grille do not become disconnected fragments. |
| Vishal / Special Occasions hero | Upright emblem and its hood reflection, some recognisable bonnet context | Start around `50% 52%`. Place text beside the emblem on wide screens; keep a clear emblem region above or beside the actual copy on narrow screens. Avoid placing H1 through the emblem. |
| Existing homepage fleet hero | Recognisable S-Class profile and visible body detail | Re-evaluate current 28%/38%/centred focal presets after removing filters. Preserve the car, not empty tree/sky space, at each reference width. |
| Homepage passenger feature | Passenger, hands and laptop together | Start around `48% 50%`; keep the 4:3 feature image role. No copy overlay or dramatic vignette. |
| Existing VIP hero | Driver/cabin silhouette and visible exterior context | Remove redundant darkening first. Do not claim additional source detail has been recovered by setting image opacity to 1. If it remains indistinct, leave replacement selection explicitly pending. |

Verify 320, 768, 1024, 1440, and 1920 CSS px, and both sides of any changed breakpoints. Record final per-image focal positions and gradient profiles at mobile, tablet portrait, tablet landscape, desktop, and wide desktop. The starting focal percentages above are unverified seeds, not locked final crop coordinates. Preserve meaningful DOM order, all existing actions, and zero horizontal overflow.

The chauffeur image is only 1200px wide; retain its service-card assignment, not a new full-width desktop hero. Full 2× sharpness is not guaranteed in a tall desktop crop; DR-11 section 17.4 defines this source limitation. Portrait 1152–1366px sources are suitable for contained supporting regions. Keep responsive output widths at or below source dimensions; larger displays may receive the source's maximum available resolution. Use Astro's existing optimized pipeline, real `sizes`/`srcset`, explicit geometry, and modern formats as supported. Prioritize the actual LCP hero only; below-fold service/supporting imagery is lazy-loaded. Do not ship all uploaded originals on every route or preload reserved assets.

### 16.8 Implementation sequence and acceptance

1. Verify current checkout and owner-supplied files at the exact shared paths. Record missing selected assets; do not silently substitute or rename. A committed filename alone is not proof its pixels match the reviewed image.
2. Read AGENTS/DESIGN, imagery-art-direction and responsive-images-performance skills, plus affected page/component contracts. Run the required exact-target design preflight when production work is authorized.
3. Update the image-role and treatment contracts for selected placements; retain DR-06's stronger no-overlay fleet rule. Include the deliberate homepage driver/passenger division.
4. Change only mapped imports/bindings, retire active references to the replaced photos in those slots, and implement scoped image treatment/focal metadata. Preserve reserve assets as unused source material.
5. Review desktop/mobile crops early, then all required viewports/locales. Measure text contrast after compositing and inspect hover/focus/reduced-motion. Verify shared component consumers, loading priorities, optimized dimensions, and layout stability.
6. Run the current repository's applicable scoped verification and site checks/build. Record exact implementation files/commit and before/after evidence. Do not mark visual verification complete where source detail, contrast, or cropping remains unresolved.

Acceptance checklist:

- [ ] Four selected uploads resolve from exact `src/assets/shared/` filenames and appear in their assigned slots.
- [ ] Own chauffeur replaces the dark homepage card image; wheel/hands/suit remain recognizable in every required state.
- [ ] Homepage large feature uses the distinct passenger photo; chauffeur composition is not repeated twice on that page.
- [ ] Corporate hero no longer shows the fare display/payment QR scene; VIP supporting section no longer shows the snowy hotel scene.
- [ ] Special Occasions hero uses the hood-emblem image; Wedding/Prom heroes and verified service facts remain intact.
- [ ] Mirror and unfamiliar interior uploads have no new active placement; the duplicate delegation interior does not replace the higher-resolution original.
- [ ] Fleet cards remain fully opaque with zero overlays; supporting images have no unnecessary filters or scrims.
- [ ] Selected heroes/cards use only localized legibility scrims; no cumulative global darkening or exposure changes on hover/focus.
- [ ] Localized text, buttons, header, and focus indicators satisfy contrast requirements against actual rendered imagery.
- [ ] Responsive crops preserve each placement's focal subject; no clipping of essential content, distortion, or artificial enlargement of generated sources.
- [ ] Decorative images retain empty alt where context provides the meaning; informative images use accurate localized alt without invented model/customer/location claims. Accessible link names still identify the service.
- [ ] Applicable source/build/visual checks are recorded separately; unresolved VIP source visibility is documented rather than hidden by a completion claim.

Evidence at this document update: all supplied photos visually inspected; existing component imports and treatment CSS inspected; active source-image comparison completed, including duplicate chauffeur and delegation interior compositions. No production browser crop/contrast audit or implementation is claimed. **DR-10 is locked for implementation planning; production pending.**

## 17. DR-11 — Locked image delivery sizes, resolution, and compression

### 17.1 Decision and evidence boundary

Owner decision, 2026-09-24: define the image-delivery changes now without inspecting the actual production build; modestly reduce compression and lock responsive sizes/resolution policy. This extends DR-10, which controls image selection, crops, and visibility. It does not reopen page geometry, fleet aspect ratios, or image assignments.

Status: **locked implementation specification; production and build verification pending**. These settings are implementable from source and image metadata. They are not proof that a specific deployed image's blur has been diagnosed or eliminated. No generated output, production network request, byte-budget result, or browser `currentSrc` has been inspected for this decision.

Confirmed source settings at the reviewed checkout:

- `HomepageHero.astro` and `ServiceHero.astro`: AVIF quality 40, responsive candidates capped at 1920px.
- `ServiceCard.astro`: candidates 360/540/720px; generic desktop `sizes` of 24rem despite the homepage's unequal mosaic columns.
- `OpenSplitSection.astro`: candidates capped at 1000px; static size hints do not reflect every actual split variant.
- `FleetShowcase.astro`: AVIF quality 55, candidates capped at 800px. `FleetVehicleFeature.astro`: AVIF quality 55, candidates capped at 1024px.

References for implementation semantics: Astro image assets API, https://docs.astro.build/en/reference/modules/astro-assets/ . Check the installed Astro version before selecting APIs. Keep the existing approved `astro:assets` pipeline and repository image rules; this change needs no external image library or runtime resize service.

### 17.2 Format and quality values — locked

Higher encoder quality means less compression. Numeric quality is encoder/format-specific, not a percentage of retained visual detail. Preserve existing output formats; do not turn this into a site-wide AVIF/WebP migration or add duplicate downloads.

| Delivery role | Locked encoding setting | Change intent |
| --- | --- | --- |
| Homepage and shared service hero photos currently encoded as AVIF | `format="avif"`, `quality={55}` | Modest increase from 40, with fewer losses in reflections, foliage and vehicle detail |
| Universal FleetCard and existing large FleetVehicleFeature AVIF photos | `format="avif"`, `quality={60}` | Increase from the existing explicit 55; use this for the new shared fleet card under DR-06 |
| Service cards, open-split/supporting photos, and photographic CTA media currently using WebP/default WebP | Explicit `format="webp"`, `quality={85}` | Predictable, moderately compressed output; no reliance on an implicit quality default |
| Other photographic media already encoded as AVIF within these affected roles | `quality={60}` | Use the non-hero photographic setting without changing format |

Do not lower an existing explicitly higher quality setting silently. Record that consumer and retain its higher setting pending a deliberate comparison. Do not change logos, SVGs, icons, transparent branding, screenshots, animation, or non-photographic assets under this policy. No quality 100/lossless export for all photos, global sharpening, artificial grain, or AI enlargement is selected.

Encode each output directly from the highest-quality approved original held in source assets. Do not pre-compress uploaded originals and then repeatedly re-encode those intermediate exports. Preserve exact incoming filenames and source bytes. The new parameters belong in one typed site-level image-delivery policy or existing equivalent, consumed by affected components; they are media settings, not theme palette tokens.

### 17.3 Responsive resolution ladders — locked

Numbers below are **encoded raster widths in pixels**, not CSS card widths or required download sizes. Each page uses a responsive candidate set, from which the browser selects one appropriate file. Do not preload the entire ladder.

| Role | Width candidate ladder | Role ceiling |
| --- | --- | --- |
| Full-width homepage/service hero | 640, 960, 1280, 1600, 1920, 2560, 3200 | 3200px |
| Service cards, including the tall homepage mosaic; universal fleet cards | 400, 640, 800, 960, 1200, 1600 | 1600px |
| Open-split/supporting imagery, large fleet feature images, contained photographic CTA media | 480, 768, 1024, 1280, 1600, 1920 | 1920px |

Candidate construction is deterministic:

1. Read the source's actual oriented dimensions from image metadata.
2. Compute `cap = min(sourceWidth, roleCeiling)` for an uncropped, proportionally resized derivative.
3. Keep ladder entries at or below `cap`, add `cap` if absent, then sort and deduplicate. If the source is smaller than the first ladder entry, generate only the available cap; flag inadequate source resolution where relevant.
4. Preserve aspect ratio and forbid upscaling in either dimension. For an explicitly pre-cropped derivative, calculate the usable source crop first; cap against that crop's dimensions rather than the original full-width number.
5. Keep the fallback image URL within the same approved output policy; do not accidentally serve a huge original outside the responsive pipeline.

Concrete handoff consequences:

| Selected source | Maximum uncropped derivative in its assigned role |
| --- | --- |
| Homepage existing 7907px-wide hero original | 3200px, not the full 7907px original |
| George Sultan 2048px-wide corporate hero | 2048px; add that native cap after 1920, omit 2560/3200 |
| Vishal 2047px-wide Special Occasions hero | 2047px; add the native cap, omit 2560/3200 |
| Existing 1672px-wide VIP hero | 1672px; source-limited, no fabricated higher-resolution variant |
| Owner chauffeur 1200px-wide service card | 1200px; omit 1600 |
| Triemli 1366px-wide supporting image | 1366px; add that cap, omit larger candidates |

These are current source limits, not requests to rename or rescale originals. If the owner later supplies a genuinely higher-resolution original under the same approved filename, metadata may unlock larger candidates within the role ceiling. A resized copy of the same small file does not qualify as a better source.

### 17.4 Density and crop-aware pixel requirements

Target approximately **2× rendered image resolution** where source dimensions and the role ceiling permit it. Keep smaller candidates for 1×/mobile delivery. Do not force 3× exports or bypass source/role caps to match every device pixel ratio. At 1920 CSS px, a 3200px hero ceiling is an intentional limit below full 2×; record that trade-off rather than claiming universal retina perfection.

For an uncropped source scaled proportionally with `object-fit: cover`, use the following planning calculation:

```text
W, H = rendered media box dimensions in CSS pixels
Sw, Sh = oriented source dimensions in pixels
D = target density, up to 2

projectedRasterWidth = max(W, H × Sw / Sh)
requestedEncodedWidth = ceil(projectedRasterWidth × D)
availableEncodedWidth = min(requestedEncodedWidth, sourceWidth, roleCeiling)
```

This explains why card width alone is insufficient. A 3:2 photo filling a 400 × 500 CSS px card needs approximately 750 × 500 image pixels at 1×, and 1500 × 1000 at 2×, before cropping the sides. The 1200 × 800 chauffeur source cannot meet full 2× for that example. Deliver its best available approved derivative; do not claim a quality increase restores missing pixels. A larger original or a later approved shallower crop is the real solution if the result remains inadequate.

For predictable aspect ratios, prefer focal-point-aware build-time crops through the approved Astro pipeline, then size the resulting derivatives against their visible box. Never stretch an image to a new aspect ratio. For fluid-height heroes or mosaic boxes that vary by breakpoint, either use appropriate art-directed sources or make the density selection account for the projected raster width above. Do not simply add candidates while retaining an undersized selection hint. No image-selection JavaScript is required.

### 17.5 `sizes` must describe the actual layout — locked calculation contract

Keep full-width, aspect-matched hero sources at `sizes="100vw"`. For other roles, remove generic fixed-width hints that disagree with the layout. The caller supplies sizing information for its actual composition; a shared card cannot assume that every caller uses the homepage mosaic.

At the reviewed theme, define these mathematical quantities for source-level calculation:

- `V`: viewport width in CSS pixels.
- `G`: page gutter, `clamp(16px, 3vw, 32px)` at the reviewed theme.
- `C`: inner main-container width, `min(V, 1280px) - 2G`; the current maximum width includes its inline padding.
- `g`: the actual local grid/track gap, not a universal gap. The homepage service mosaic uses 16px; the standard 12-column OpenSplitSection uses 32px.

These values document the inspected theme; implementation must derive/serialize them from the current canonical layout contract rather than create a second theme. Do not pass CSS custom-property references directly into HTML `sizes` and assume they resolve. Use valid native media conditions and CSS length expressions supported by the project's browser targets. The equations here are mathematical specifications, not literal HTML strings.

| Placement | Rendered media width to express in the responsive selection |
| --- | --- |
| Homepage service mosaic, below 768px | `C` |
| Homepage service mosaic, 768–1023px | `(C - 16px) / 2` |
| Homepage service mosaic, 1024px and above | Private Chauffeur: `0.35 × (C - 32px)`; Airport: `0.30 × (C - 32px)`; each stacked Business/Special Occasions card: `0.35 × (C - 32px)` |
| Ordinary OpenSplitSection, below 1024px | Actual single-column container content width; main-container consumers use `C`, not the old 38rem hint |
| Ordinary OpenSplitSection, 1024px and above | For image span `n` in the existing 12-column grid: `n × (C - 11g) / 12 + (n - 1)g`; select n=5/6/7 from the component's actual split/direction mapping |
| DR-06 universal fleet track | Below 768px: `0.88 × trackWidth`; 768–1023px: `(trackWidth - gap) / 1.8`; from 1024px: `(trackWidth - 3 × gap) / 3.2`, as specified in section 12.11 |
| Responsive-split service hero, large fleet feature, VIP supporting section, CTA media | Use their actual component variant/container, column proportions and gaps. The OpenSplitSection equation is not valid for every 5/7 composition: direct `5fr 7fr` has one gap, while a 12-column span has eleven. |

For uncropped `object-fit: cover` sources, account for any extra raster width needed to cover the image height (17.4). If selection hints deliberately represent that projected raster width, document it as crop compensation; otherwise use aspect-matched derivatives so layout-width hints remain accurate. Do not multiply `sizes` by device pixel ratio as well: the browser already considers density when selecting width-descriptor candidates.

For capped content, the hints must stop growing once the container reaches its maximum; avoid unbounded `55vw`/`58vw` on very wide screens. For panel-bleed variants, include the actual extra media extent rather than copying ordinary split hints. Preserve the same slot calculation across locales, while allowing translated content to affect height and therefore cover cropping.

### 17.6 Scope, implementation, and later verification

Apply these policies to the image-bearing components already identified: `HomepageHero`, `ServiceHero`, `ServiceCard`, `OpenSplitSection`, the new universal `FleetCard` under DR-06, existing `FleetVehicleFeature`, and selected VIP supporting/CTA image consumers. Legacy `FleetShowcase` and `VehicleRecommendations` image delivery is replaced by the universal card where DR-06 migrates them; do not maintain competing policies in obsolete renderers. Changes to shared delivery settings require the usual cross-consumer checks, but do not authorize changing unrelated imagery or page structure.

Keep LCP hero eager/high-priority and secondary photos lazy-loaded. Preserve intrinsic geometry and layout stability. Generating more candidates does not mean downloading them all; nevertheless larger selected files will increase bytes, and no unchanged-payload guarantee is made. Existing performance budgets remain in force. If a budget fails later, first inspect sizing accuracy, needless requests, and crop efficiency; do not silently revert to quality 40, raise budgets, or label lower-resolution output equivalent.

Future acceptance checks, required at implementation rather than claimed now:

- [ ] Explicit encoding settings match 17.2; no blanket quality 100 or unnecessary format migration.
- [ ] Width ladders are filtered by actual source/crop dimensions, include the usable cap, and generate no upscaled outputs.
- [ ] Native size hints match each caller's geometry and account for cover scaling; `sizes` and width-descriptor `srcset` agree.
- [ ] At the repository's required widths and at 1×/2× density, inspect actual `currentSrc`, decoded output dimensions, rendered box, crop and source limit. Do not use density-corrected `naturalWidth` alone as proof of encoded pixel dimensions.
- [ ] Compare wheel spokes, grille, chrome edges and paint reflections against the source at comparable scale; retain DR-10's exposure rules.
- [ ] No original/source modification, duplicate full-size download, unnecessary preload, layout shift, or silently changed theme/layout.
- [ ] Record resulting file sizes and applicable performance/production checks. Any source-limited image is explicitly identified.

This section supplies concrete implementation defaults without a build scan. Exact browser candidate selection, final sharpness, byte costs and performance compliance remain unverified until implementation. DR-10's earlier general resolution guidance is refined by these ladders and limits; all approved image assignments and no-upscaling rules remain in force.

## 18. DR-12 — Full-width interior Final CTA and WebP asset handoff

### 18.1 Locked decision and supersession

Owner decision, 2026-09-24: adopt the first interior photograph from the three reviewed references, use it for the full-width Final CTA, and supply its production asset as **`site/luksuzni-prevoz/src/assets/shared/final-cta-interior-v2.webp`**. The owner also changes all previously supplied incoming photographic assets to the **`.webp` extension**. This supersedes earlier instructions to retain incoming `.jpg` extensions. Basenames remain unchanged except for the explicitly renamed CTA image.

The new CTA replaces the current contained, rounded, approximately 62/38 copy/image panel. One continuous photographic section spans the viewport, while its copy uses the normal main content container. Preserve a compact closing-conversion role, existing action hierarchy, and page-specific business meaning. This is not a second hero, a new booking form, or a global increase in container width.

This direction applies to the existing shared FinalCTA consumers, including homepage, Fleet, Pricing, and the ten existing service/hub page assemblies. Use the selected interior as their common closing image. Keep page-specific headings, descriptions and correctly resolved actions, except for the approved shorter Serbian example below. Do not add new closing CTAs to pages that do not currently have one. Check current source consumers before implementation; the reviewed baseline has 13 production component assemblies and additional development demonstrations.

This explicitly supersedes the legacy CTA contract's contained width, rounded outer panel, side-only image, integrated image mask/platinum veil, and separate lower mobile media panel. It also supersedes DR-10's instruction to retain the old delegation final-CTA image in that slot: DR-10 was written before the universal interior-CTA decision. Keep the old high-resolution interior asset only for other valid consumers or historical source retention, not as this CTA's image. All other DR-10 placements and DR-06 fleet decisions remain intact.

### 18.2 Canonical incoming filenames

The active asset inventory and replacement map in section 16 now use these production names. Every entry is relative to `site/luksuzni-prevoz/src/assets/shared/`:

| Filename | Assignment |
| --- | --- |
| `final-cta-interior-v2.webp` | All existing shared photographic Final CTA placements |
| `b58da850-396c-46da-a528-4143ea28d859.webp` | Homepage Private Chauffeur service card |
| `pexels-georgesultan-11877375.webp` | Corporate Transport hero |
| `pexels-triemli-32897253.webp` | VIP discretion supporting photo |
| `pexels-vishal-makwana-984383-31040135.webp` | Special Occasions hub hero |
| `pexels-oneilgonzales-11373655.webp` | Reserved; no active placement |
| `vadym-kudriavtsev-4uCykQ0fNhY-unsplash.webp` | Reserved; no active placement |
| `s-class-interior-1(1).webp` | Duplicate incoming interior; no new placement |
| `front-facing.webp`, `left-facing.webp` | Earlier supplied E-Class views, subject to DR-06's model-specific mapping |

The three 870 × 580 PNG interior references and page screenshots are review material, not additional site assets. The newly attached full photograph has upload name `ad0d5732-4046-4d05-a077-0cf0c7709cd6.jpg`; it maps specifically to `final-cta-interior-v2.webp`. Do not import that upload UUID or the thumbnail filenames in production.

The WebP handoff rule applies to incoming photographs. It does not rename all existing repository JPEGs, PNGs, logos, or screenshots. In particular, keep valid existing imports such as `assets/hero-example-2.jpg` unless another selected task changes them. WebP source files may still produce AVIF derivatives where DR-11 specifies AVIF; source extension and delivery format are separate choices.

The user will supply genuinely encoded WebP files, not JPEG bytes renamed with a WebP suffix. Verify decoded dimensions/format on receipt. Maintain the original pixel dimensions where possible and avoid additional destructive recompression before Astro generates its derivatives. Section 16's dimensions describe inspected uploads; recheck the actual converted files. No bulk conversion or production asset upload has been performed in this task.

### 18.3 Source image and quality contract

The attached full image was inspected and measures **2048 × 1365px**. It is materially larger than the 870px reference, but it is not a 3200px source. It is an approved contextual luxury-interior image; do not label its exact vehicle model or imply a guaranteed cabin configuration without separate verification.

For this full-width CTA, use **WebP quality 85** and the DR-11 **full-width resolution ladder**, not the contained-CTA 1920px ceiling. The role ceiling is 3200px, but this source currently limits the candidate set to **640, 960, 1280, 1600, 1920, 2048px**. Do not generate 2560/3200px by upscaling. If the converted source changes dimensions, apply the same metadata cap algorithm. A future larger original may unlock the larger candidates.

Use responsive optimized Astro image markup positioned as the section's visual background, with empty alt/decorative semantics. A full-background appearance does not require an unoptimized CSS background URL. Keep native geometry, correct image sizing and crop-aware selection under DR-11; lazy-load because this is a closing section, not the LCP hero. Do not preload the CTA image or force all generated variants to download.

The 2× target remains bounded by source resolution. At wide desktop widths, this source cannot guarantee full retina detail. Neither the preview nor the specification claims otherwise. No AI enlargement, pixel invention, global blur, desaturation or sharpening is selected.

### 18.4 Desktop composition and spacing

- At 1024px and wider, render a viewport-wide photographic section with no outer card radius or bordered frame. It belongs outside a width-capped page wrapper; keep an inner main container for text. Avoid `100vw` breakout hacks that introduce scrollbar overflow.
- Preserve the active main-container/gutter contract. Do not create a second larger content container just for the CTA. Text aligns with the site's other sections and footer.
- Use a normal-content minimum height of **26.25rem / 420px** at the reference root font size. This is a structural reference, not a fixed maximum. Height increases for longer copy or enlarged text. Do not introduce viewport-height hero sizing or crop text to hold 420px.
- Vertically centre the content with approximately 4rem block padding in the preview; map to current semantic spacing roles during implementation. Copy has a maximum measure of approximately 32rem; the description is approximately 29rem.
- Keep the existing H2 role, Inter Tight headings and Manrope body/UI. No H1, eyebrow, testimonial, badge, trust strip or new sales claim is added.
- Maintain primary and secondary actions together, followed by one compact phone/email row using verified contact data. Do not add booking fields to the CTA.
- Remove the old panel's external feature padding from this new wrapper so the photograph forms the section itself. Let the preceding section's existing rhythm provide the transition. The compact footer follows normally; do not stack another empty feature-sized spacer between CTA and footer. Do not modify unrelated Section defaults.

The preview uses the photo at `object-position: 50% 14%` on desktop. This crop protects the steering wheel and silver dashboard controls while removing much of the lower seat area. The entire image remains at full opacity with no brightness/contrast filter. Do not mirror the interior or add another narrow right-hand image inside the background.

### 18.5 Scrim, readability and mobile art direction

Use a single independent dark scrim layer between media and content. Delete the old integrated `mask-image`/`-webkit-mask-image`, neutral accent veil, side-image region, and decorative panel gradient for the new variant. Avoid overlapping old and new treatments.

Desktop preview scrim: a left-to-right gradient using the semantic background colour, with alpha 0.96 at the inline start, 0.85 at 25%, 0.65 at 42%, 0.12 at 66%, and 0.03 at the opposite edge. These are demonstrated starting stops for this photograph; preserve the effect and tune only as required for localized copy and verified contrast. Darkening belongs behind the copy; the dashboard region remains substantially visible.

| Width | Composition and crop |
| --- | --- |
| Below 480px | One continuous background; reserve approximately 14rem above the content for visible interior detail. Text then actions then contacts. Buttons stack full-width, contacts stack. Photo focal position begins at `70% 0%`. Content-driven height; no fixed maximum. |
| 480–1023px | Same continuous background/top-image and lower-copy arrangement, approximately 16rem top clearance. Copy stays left aligned in the main container. Buttons and contacts wrap into rows when their content fits. |
| 1024px and wider | 420px minimum-height wide composition with copy on the left and exposed dashboard on the right; `50% 14%` starting crop. |

On narrow layouts, use a top-to-bottom scrim rather than the desktop horizontal gradient. Preview stops: alpha 0.04 at 0%, 0.06 at 23%, 0.80 at 42%, 0.96 at 60%, and 0.99 at 100%. This retains recognisable dashboard detail above the content and makes the lower copy/action area reliably dark. The image remains a continuous section background; it is not a separate rounded photo stacked below the buttons.

Top clearance is intentional room for the subject, not an empty spacer. Recheck the focal point and actual line positions when localizing or enlarging text. The content must not obscure all useful interior detail. Keep the background source and visual reading order consistent; the decorative image introduces no keyboard stops.

Body and contact text must meet at least 4.5:1 contrast, and qualifying large headings at least 3:1, against the actual composite. Inspect the lightest pixels behind the lines at all required widths and locales; a gradient percentage alone is not contrast proof. Retain 44 × 44px minimum interactive targets, clearly visible focus rings, wrapping emails, and no horizontal overflow. No animation/parallax is required; any retained shared motion must respect reduced motion.

### 18.6 Copy, actions and localization

Approved Serbian example used in the preview:

- Heading: **Gde i kada putujete?**
- Description: **Unesite detalje putovanja i proverite cenu. Za složenije zahteve pripremićemo ponudu.**
- Primary action: **Započnite rezervaciju** → canonical `booking` route.
- Secondary action: **Kontakt** → canonical `contact` route for this example.
- Contacts: canonical phone and email, currently `+381 60 111 9999` and `office@luksuzniprevoz.rs` in the reviewed data.

Store accepted copy in the proper localized content model, not inside the shared component. English and Russian need semantically equivalent approved content and responsive checks. Do not copy the generic price-check wording onto quote-only pages where it changes service meaning; preserve their accurate page-specific closing copy. Preserve existing valid action roles/destinations in each caller: the example's Contact button does not replace a quote action globally, and a missing optional action is omitted rather than invented. No claim of automatic availability, instant confirmation, or guaranteed price is introduced.

The preview contains actual link destinations derived from the reviewed Serbian route slugs and contact values. Clicking booking/contact opens the real site's corresponding URL; phone/email use their native schemes. No booking request is submitted by the preview. Production must continue using the site's route helpers and canonical contact data rather than hardcoded preview URLs.

### 18.7 Component migration and contract updates

Affected shared source: `site/luksuzni-prevoz/src/components/shared/FinalCTA.astro` and `FinalCTA.types.ts`. Authoritative contract to update before production implementation: `src/docs/home/home-components/11-final-cta.md`, plus affected page blueprint/wireframe/checklist references. Amend the generic DESIGN image-role language where it mandates a separate allocated side-media region; retain the compact-conversion identity rule. Reconcile DR-11 so this full-width CTA takes the full-width ladder with WebP 85.

Use one shared implementation for the new design. Centralize the approved CTA image reference in the site's media data layer or existing equivalent and supply it consistently to callers. Keep presentation and localized content ownership separate. Do not duplicate the image import/selection policy across 13 page-specific CTA components. If old props must remain temporarily for compatibility, explicitly map/deprecate them; they must not leave some public pages on the old split design. No-image fallback remains a usable dark conversion section with the same actions and readable content, not a broken-image box.

Reviewed production consumers are HomePage, FleetPage, PricingPage, PrivateChauffeurPage, AirportTransportationPage, BusinessTransportationPage, CorporateTransportationPage, DelegationTransportationPage, ConferenceCongressTransportationPage, SpecialEventsPage, WeddingTransportationPage, PromTransportationPage and VipTransportationPage. Recheck the current import/use graph. Update development examples and meaningful tests along with the shared contract. Keep related source photos available where they still serve other sections.

This design replaces the final-CTA image binding only. It does not replace the homepage hero, service heroes, fleet images, or DR-10's other supporting photographs. It does not deploy anything or authorize changes to the sibling Belgrade Transfers repository.

### 18.8 Preview artifact and evidence

Standalone file: **`luksuzniprevoz-final-cta-preview.html`**. It contains only the final CTA on the site canvas, uses embedded Inter Tight/Manrope font subsets and the full supplied photograph, and works without external image/font requests. Surrounding page centring/padding is preview-only and must not be copied as additional production section spacing.

The attached JPEG is embedded unaltered as a data URL for portability. This is not a production asset import and does not waive the selected `.webp` source filename or DR-11 delivery policy. No production WebP conversion or optimized output comparison is claimed by this HTML preview. The explanatory implementation notes are HTML comments, not customer-facing placeholders.

Preview checks completed: loaded at 320, 390, 768, 1023, 1024, 1440 and 1920px; image and embedded fonts loaded; no horizontal page/text overflow; all four links met the 44px target-height floor; visible keyboard focus confirmed; 320px with 200% root text size had no horizontal/text overflow after wrapping correction; no page JavaScript errors. Desktop, mobile and tablet screenshots were visually inspected. The preview has no animation or client-side JavaScript.

Not claimed: production build validation, production optimized-image sharpness, formal pixel-by-pixel text contrast certification, testing of all localized content, or verification of live destination pages. Preserve those as production acceptance requirements.

### 18.9 Acceptance checklist

- [ ] Exact `src/assets/shared/final-cta-interior-v2.webp` resolves and matches the approved full interior photograph; all incoming image references use the updated WebP names.
- [ ] One full-width shared photographic CTA replaces old split panels across existing public consumers; inner copy stays aligned to the existing main container.
- [ ] Old outer radius, narrow media column, image mask, accent veil and redundant outer feature spacing are removed from this design.
- [ ] Dashboard remains recognisable at desktop and mobile crops; natural source exposure is preserved outside the copy scrim.
- [ ] Desktop remains a compact 420px minimum-height closer, with content-driven expansion rather than clipping; mobile follows the specified continuous-image composition.
- [ ] Page-specific CTA meaning, verified contacts, route helpers, optional actions and quote-only rules remain correct in all locales.
- [ ] WebP 85/full-width ladder uses metadata caps; the current source tops out at 2048px, with no upscaling or LCP preload.
- [ ] Text contrast, 44px targets, focus, enlarged text, reduced motion and zero overflow are verified in production at required viewports/locales.
- [ ] Shared component and page contracts/tests reflect the new direction; applicable repository gates and production evidence are recorded.

Status: **direction locked and standalone preview delivered; production implementation pending**.
