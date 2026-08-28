# Business Transportation Hub — Implementation V2

**Status:** READY FOR IMPLEMENTATION  
**Target:** `businessTransportation`

## 1. Preflight

Read `/AGENTS.md`, `/DESIGN.md`, this directory's locked blueprint/acceptance/wireframe, configured active theme JSON, matching design/component/a11y/Tailwind skills, governance viewports, current Business content, and canonical `services.ts`, `operations.ts`, `clients.ts`, `client-media.ts`, `fleet.ts`, and `contact.ts`.

Run `git status` before edits and preserve unrelated work.

## 2. Install content first

Replace all three files under:

`src/content/pages/business-transportation/`

with the packaged SR/EN/RU files.

Merge each packaged `ui-additions.*.json` into the matching existing `src/content/ui/*.json`. Existing keys stay intact.

Apply `redesign-content-pack/schema-changes.md`.

Run:

```bash
pnpm content:sync-digests
pnpm content:validate
```

Content validation MUST pass before page assembly.

## 3. Dedicated renderer

Create:

`src/components/services/business-transportation/BusinessTransportationPage.astro`

Update `src/components/site/ContentPageRenderer.astro`:

```text
scaffold → ScaffoldPage
airportTransportation → AirportTransportationPage
businessTransportation → BusinessTransportationPage
other supported content → existing renderer
```

Do not modify route generation or duplicate SEO/hreflang logic.

## 4. Component ownership

Use page-local components only for real semantic regions:

```text
BusinessTransportationPage.astro
├─ BusinessProposition.astro
├─ BusinessServiceGrid.astro
│  └─ BusinessServiceCard.astro
├─ BusinessEngagementModel.astro
├─ BusinessCoordinationStory.astro
│  └─ BusinessScheduleTimeline.astro
├─ BusinessClientProof.astro
├─ BusinessStandards.astro
└─ BusinessProcessSteps.astro
```

Reuse `BaseLayout`, `Section`, `PageContainer`, shared Link/CTA infrastructure, Service Hero contract, fleet infrastructure, FAQ, and FinalCTA.

Do not create a generic `HubPage.astro`.

## 5. Hero

Start from verified Service Hero infrastructure.

Add only the bounded API required for:

- localized eyebrow;
- three passive trust markers.

Trust copy comes from `content/ui`.

Primary CTA resolves the anchor target. Secondary CTA resolves quote flow.

No client JavaScript is required for anchor navigation.

Use `ServiceHero variant="full-bleed"` and `BaseLayout overHero={true}`. The
Business-specific image is `assets/services/business-transport-card.webp`.

## 6. Proposition

Render `overview.heading`, `overview.body`, and exactly three `overview.items`.

Use open grid/divider composition.

## 7. Business Service capability adapters

Render `childServices.items` in authored order.

Card index comes from array order.

### Corporate

Read `getService("corporateTransportation")`.

```text
supportsOneOff → business.commercial.oneOff
supportsRecurringContracts → business.commercial.recurring
supportsInvoicing → business.capability.invoicing
supportsNegotiatedPricing → business.capability.negotiatedPricing
```

### Delegation

Read `getService("delegationTransportation")`.

```text
multipleVehicles → business.coordination.multipleVehicles
mixedVehicleClasses → business.coordination.mixedVehicleClasses
dedicatedCoordinator → business.coordination.dedicatedCoordinator
```

Never render security wording for `securityService: false`.

### Conference

Read `getService("conferenceCongressTransportation")`.

```text
airportArrivals → business.coordination.airportArrivals
hotelTransfers → business.coordination.hotelTransfers
venueShuttles → business.coordination.venueShuttles
multiVehicleSchedules → business.coordination.multiVehicleSchedules
```

All capability labels are data-driven.

## 8. Engagement

Lookup `sections[key=engagementModel]`.

Render two items and the section CTA. CTA routes to `corporateTransportation`.

## 9. Coordination

Lookup `sections[key=coordination]`.

Render five items as a semantic schedule. Use a page-local timeline component for chronology only.

Mobile DOM order:

```text
heading → copy → timeline → media
```

## 10. Client Proof

Read canonical client placement, logo asset state, and public-display permission state.

Render the four records whose stable logo identifiers map through
`client-media.ts` and whose status is `approved-for-public-display`: President
Palace, Hyatt Regency, Qatar Airways, and Square Nine. The Chinese Embassy
record remains absent. Do not render placeholders.

## 11. Fleet roles

Reuse canonical fleet cards/data and request exactly:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

Map role labels:

```text
mercedes-s-class → business.vehicleRole.mercedesSClass
mercedes-e-class → business.vehicleRole.mercedesEClass
mercedes-v-class-7-plus-1-extra-long → business.vehicleRole.mercedesVClassExtraLong
mercedes-sprinter → business.vehicleRole.mercedesSprinter
```

## 12. Standards adapter

Heading/intro comes from `sections[key=standards]`.

Render data-gated rows using:

- `business.standard.professionalChauffeur.*`
- `business.standard.discretion.*`
- `business.standard.multiVehicle.*`
- `business.standard.mixedVehicleClasses.*`
- `business.standard.scheduleContinuity.*`
- `business.standard.manualConfirmation.*`

Professional chauffeur and discretion gate against `operations.ts`.

Multi-vehicle row gates against active Business child-service capability data.

Mixed classes gates against Delegation `mixedVehicleClasses`.

Schedule continuity gates against Corporate `dedicatedChauffeurAcrossStops`.

Do not add flight tracking.

## 13. Process

Lookup `sections[key=process]`. Render exactly three steps with compact divider-led treatment.

## 14. FAQ

Reuse existing FAQ and structured-data path. Render the packaged six questions.

## 15. Final CTA

Reuse shared FinalCTA.

Map localized heading/text and primary/secondary CTAs from page content.

Pass verified `contact.phone` and `contact.email` separately through FinalCTA contacts.

Do not author contact details inside page content.

## 16. Responsive

Use governed states:

- 320×568
- 768×1024
- 1024×768
- 1440×900
- 1920×1080

Mobile: one-column service cards; two-column client-logo proof; coordination
copy/timeline before media; standards one column; process stacked.

Tablet portrait at 768 px: first service card full width with the remaining two
side by side; standards and client proof two columns; engagement two columns;
process stacked.

At 1024 px and above: three service columns; split coordination; standards
3×2; client proof four columns; process one row.

Wide desktop: active container and reading measures cap expansion.

## 17. Styling and interaction

Use configured active semantic theme tokens only.

`Section` owns vertical rhythm. `PageContainer` owns horizontal containment. Use logical CSS properties.

Service-card rest state contains all content. Hover/focus uses restrained tokenized image/arrow/divider response. No lift, glow, dramatic zoom, or loop.

Reduced motion removes non-essential motion.

## 18. Test additions

Add coverage for:

- dedicated renderer selection;
- exact service order;
- anchor CTA resolution;
- capability-chip gating;
- no Delegation security wording;
- exactly four approved client logos and no Chinese Embassy logo;
- exact fleet IDs;
- six FAQs;
- no page-level overflow at governed viewports.

## 19. Verification

Run:

```bash
pnpm content:sync-digests
pnpm content:validate
pnpm routes:validate
pnpm theme:sync:check
pnpm theme:validate
pnpm lint
pnpm check
pnpm quality:fast
pnpm build
pnpm verify:ui
pnpm test:a11y
pnpm test:e2e
pnpm format:check
```

A failed gate blocks completion.
