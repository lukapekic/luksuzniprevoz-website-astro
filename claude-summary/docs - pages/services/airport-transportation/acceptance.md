# Airport Transportation — Acceptance Contract v3

Status: **Required completion gate — v3.1 repo-aligned surfaces**
Route key: `airportTransportation`
Page type: `service`

Do not approve Airport v3 until every applicable item below passes.

## 1. Authority / sync

- [ ] `AGENTS.md` read.
- [ ] `DESIGN.md` read.
- [ ] Airport v3 `blueprint.md` read.
- [ ] Airport v3 `wireframe.html` read.
- [ ] Airport v3 `implementation.md` read.
- [ ] Shared ServiceHero v2 read.
- [ ] Shared ServiceOverview v2 read.
- [ ] Shared VehicleRecommendations v2 read.
- [ ] Shared ServiceStandards v2 read.
- [ ] Required skills loaded.
- [ ] `pnpm design:context site/luksuzni-prevoz` ran successfully.
- [ ] No old contained-Hero / details-list contract remains in the implemented page.

## 2. Page order

Exact visible order:

- [ ] full-bleed ServiceHero
- [ ] grouped-icon ServiceOverview
- [ ] AirportBookingBlock mini form
- [ ] Arrival Handling timeline
- [ ] Private Aviation / FBO
- [ ] VehicleRecommendations carousel
- [ ] four-group ServiceStandards
- [ ] FAQ
- [ ] FinalCTA

No unrelated sections were inserted.


## 2A. Repo surface / density gate

- [ ] Hero is the only full-bleed content region.
- [ ] Main contained regions respect the 80rem production cap.
- [ ] Major contained sections use the semantic 16px section radius.
- [ ] Media/cards use the 12px card radius where applicable.
- [ ] Controls use the control radius, not section/card radius.
- [ ] Overview is a compact contained-dark panel.
- [ ] Booking is a compact contained light panel, not a full-width light band.
- [ ] Booking controls are not nested inside an unnecessary second white card.
- [ ] Arrival is a compact contained-dark panel.
- [ ] FBO is one contained elevated panel with flush right-side media.
- [ ] FBO image has no independent padding/radius.
- [ ] Vehicles are contained within the page's compact panel rhythm.
- [ ] Standards are contained and show four strong groups only.
- [ ] FAQ is a contained light reading panel.
- [ ] FinalCTA remains the existing medium-height contained closer.
- [ ] No giant empty sections.
- [ ] No oversized SaaS rounding.
- [ ] Section index labels do not become uppercase eyebrows everywhere.


## 3. Hero

- [ ] `ServiceHero` reused.
- [ ] `variant="full-bleed"`.
- [ ] full viewport width.
- [ ] no outer card radius.
- [ ] media not constrained by PageContainer.
- [ ] content aligned to semantic inner container.
- [ ] SiteHeader overlays using approved header behavior.
- [ ] navigation/language menu remains readable and above Hero layers.
- [ ] exactly one H1.
- [ ] H1/CTA contrast passes WCAG AA.
- [ ] no form, price, ratings, fleet specs, trust chips or logos inside Hero.
- [ ] focal point reviewed at all target widths.

## 4. Section eyebrow system

- [ ] 01 Overview.
- [ ] 02 Booking.
- [ ] 03 Arrival.
- [ ] 04 Private Aviation.
- [ ] 05 Vehicles.
- [ ] 06 Standards.
- [ ] 07 FAQ.
- [ ] labels localized.
- [ ] numbers stay visually subordinate.
- [ ] consistent platinum/accent treatment.
- [ ] no decorative eyebrow cards.

## 5. Service Overview

- [ ] uses `ServiceOverview` grouped-icons variant.
- [ ] exactly four semantic groups unless canonical data makes one unavailable.
- [ ] Transfer combines point-to-point + one-way + return.
- [ ] Arrival combines tracking + meet/greet + waiting.
- [ ] Assistance combines luggage + name sign.
- [ ] Aviation combines commercial/private/FBO.
- [ ] waiting minutes come from canonical data.
- [ ] no duplicate one-boolean-per-row notebook list.
- [ ] icons are restrained and decorative/aria-hidden.
- [ ] no feature cards/badge wall.
- [ ] no internal enum values shown raw.

## 6. Booking mini form

- [ ] old "Details we need" list removed.
- [ ] old quote/result panel removed.
- [ ] fields are Flight number, Date, Time.
- [ ] every field has a visible label.
- [ ] no placeholder-only labels.
- [ ] primary Continue action has clear contrast on light surface.
- [ ] no white-on-white primary action.
- [ ] 44×44 targets.
- [ ] visible focus.
- [ ] validation/errors are accessible.
- [ ] no price is displayed.
- [ ] form creates a typed/validated Airport booking intent.
- [ ] submitted values are preserved.
- [ ] detailed booking form receives and prefills the values.
- [ ] no manual localized URL concatenation.
- [ ] no Airport-local storage convention invented.
- [ ] no dead/non-submitting form ships.
- [ ] secondary quote action remains subordinate.

## 7. Pricing hard gate

- [ ] no fixed Airport fare.
- [ ] no estimated Airport fare.
- [ ] no `from` Airport fare.
- [ ] no hourly/per-km derivation.
- [ ] no inferred currency.
- [ ] no fake zero/placeholder amount.
- [ ] no Airport price in JSON-LD.

## 8. Arrival timeline

- [ ] semantic ordered list.
- [ ] vertical connecting line.
- [ ] clear node/icon for each step.
- [ ] flight tracking step depends on canonical capability.
- [ ] meet-and-greet step depends on canonical capability.
- [ ] luggage step depends on canonical capability.
- [ ] onward/direct journey reflects canonical service behavior.
- [ ] waiting value, when visible, comes from data.
- [ ] no unsupported step invented.
- [ ] timeline meaning works without motion.
- [ ] reduced motion honored.
- [ ] mobile order is timeline/copy before media.

## 9. Private Aviation / FBO

- [ ] section renders only when canonical capability permits.
- [ ] content 5 / media 7 desktop relationship.
- [ ] media fills its entire column.
- [ ] no image padding.
- [ ] no independent image card/radius.
- [ ] image crop/focal point reviewed.
- [ ] content communicates discreet pre-arrival coordination.
- [ ] content communicates itinerary/team coordination.
- [ ] content communicates FBO/handler-aware pickup.
- [ ] content communicates premium onward continuity.
- [ ] no security/bodyguard claim.
- [ ] no apron-access guarantee.
- [ ] no private-terminal guarantee.
- [ ] no aviation-operations claim.
- [ ] VIP route link uses route helpers if shown.

## 10. VehicleRecommendations

- [ ] shared component reused.
- [ ] editorial carousel treatment.
- [ ] active vehicle is visually dominant.
- [ ] next recommendation can peek where appropriate.
- [ ] previous/next controls exist and are accessible.
- [ ] position counter is present.
- [ ] no autoplay.
- [ ] keyboard navigation works.
- [ ] touch/scroll behavior works.
- [ ] no focus trap.
- [ ] no accidental page overflow.
- [ ] vehicle facts from `fleet.ts`.
- [ ] no fare.
- [ ] no invented luggage/equipment facts.
- [ ] not a copy of Homepage FleetShowcase.

## 11. ServiceStandards

- [ ] shared component reused.
- [ ] four visible grouped panels maximum.
- [ ] Professional chauffeur group.
- [ ] Prepared vehicle group.
- [ ] Passenger care group.
- [ ] Comfort & journey group.
- [ ] each group uses verified `operations.ts` facts.
- [ ] no exhaustive true-field dump.
- [ ] no badge wall.
- [ ] no security/bodyguard claim.
- [ ] no duplicated Arrival workflow.
- [ ] responsive layout becomes 2×2 / single column when needed.

## 12. FAQ

- [ ] shared FAQ reused.
- [ ] section eyebrow present.
- [ ] row targets comfortably tappable.
- [ ] plus/minus state perceivable.
- [ ] keyboard accessible.
- [ ] visible FAQ items and FAQ structured data use the same array.
- [ ] no duplicate accordion implementation.

## 13. Content / localization

SR, EN and RU entries:

- [ ] exist.
- [ ] validate as `pageType: service`.
- [ ] have valid lifecycle fields.
- [ ] have valid SEO.
- [ ] booking section no longer owns obsolete details-list items.
- [ ] Private Aviation content matches the premium coordination direction.
- [ ] no canonical numeric service fact duplicated into Markdown.
- [ ] translation source digests are current.

UI dictionaries:

- [ ] all v3 keys exist in SR.
- [ ] all v3 keys exist in EN.
- [ ] all v3 keys exist in RU.
- [ ] key parity exact.
- [ ] waiting minutes interpolate canonical value.
- [ ] operations numbers interpolate canonical values where used.

## 14. Responsive

Review:

```text
320
768
1024
1440
1920
```

- [ ] no horizontal overflow.
- [ ] full-bleed Hero at all widths.
- [ ] Hero content/focal subject do not collide.
- [ ] booking fields stack cleanly.
- [ ] timeline remains continuous/readable.
- [ ] FBO image remains flush rather than becoming a padded card.
- [ ] carousel does not leak outside page.
- [ ] standards panels remain readable.
- [ ] FAQ/CTA remain correctly proportioned.

## 15. Accessibility

- [ ] WCAG 2.2 AA.
- [ ] exactly one H1.
- [ ] logical heading hierarchy.
- [ ] 44×44 targets.
- [ ] visible focus.
- [ ] labelled form controls.
- [ ] accessible form errors.
- [ ] decorative icons hidden from AT.
- [ ] carousel controls named.
- [ ] timeline semantic.
- [ ] reduced motion.
- [ ] meaningful image alt.
- [ ] no color-only state.

## 16. SEO / structured data

- [ ] existing SEO builder reused.
- [ ] canonical intact.
- [ ] hreflang intact.
- [ ] lifecycle/noindex intact.
- [ ] FAQ schema matches visible FAQ.
- [ ] no raw localized URLs.
- [ ] no invented price/currency in schema.

## 17. Technical / visual quality gates

Run and pass:

```bash
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm routes:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
pnpm lint
```

Also complete the repository design review/detector workflow required by `AGENTS.md`.

## 18. Final rejection conditions

Reject immediately if any of these remain:

- contained Airport Hero;
- old details-list booking block;
- dead booking fields;
- white-on-white primary action;
- one-way/return/direct as three redundant fact rows;
- generic Arrival divider list instead of timeline;
- padded/radiused FBO image card;
- static cramped vehicle cards;
- long standards notebook list;
- invented Airport price/currency;
- missing SR/EN/RU UI parity.
