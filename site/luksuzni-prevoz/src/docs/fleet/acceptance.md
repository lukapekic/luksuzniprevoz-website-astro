# Fleet Page — Acceptance

**Status:** LOCKED BINARY ACCEPTANCE  
**Target:** `fleet`

Every applicable item MUST pass.

## A. Structure

- [ ] Header → Full-bleed Hero → Navigator → Introduction → Sedans (S klasa, E klasa, Superb) → SUV (Kodiaq) → Group Transport (V klasa, Sprinter) → Fit Guide → FAQ → Final CTA → Footer.
- [ ] Fleet renders through dedicated `FleetPage.astro`.
- [ ] No required region is silently merged, removed, or reordered.
- [ ] Homepage Fleet carousel is not used as the Fleet page.
- [ ] Vehicle chapters do not alternate image/text sides.
- [ ] Vehicle chapters have no bottom separator border between cars.
- [ ] Final CTA remains subordinate to Hero.

## B. Route and publication

- [ ] `fleet` remains kind `page`.
- [ ] Route availability is changed from `scaffold` to `published`.
- [ ] SR slug remains `vozila`.
- [ ] EN slug remains `fleet`.
- [ ] RU slug remains `avtopark`.
- [ ] Internal links use route helpers.
- [ ] No locale path is manually concatenated.
- [ ] Final content is indexable and no scaffold `noindex: true` remains.

## C. Content parity

- [ ] SR/EN/RU use the exact same Fleet content structure.
- [ ] Serbian is the editorial source.
- [ ] EN/RU source digests are generated after final source install.
- [ ] All locales validate.
- [ ] Every visible production string comes from content, UI dictionary, or canonical data.
- [ ] Components contain no production marketing-copy literals.
- [ ] Canonical model display names are not translated in content.

## D. Hero

- [ ] Hero is full bleed.
- [ ] Hero uses `src/assets/pages/fleet/hero.webp`.
- [ ] `BaseLayout overHero={true}` is active.
- [ ] Header visually integrates with Hero at page top.
- [ ] Hero has exactly one H1.
- [ ] Primary CTA resolves to booking flow.
- [ ] Secondary CTA resolves to quote flow.
- [ ] Hero contains no fake fleet metrics.
- [ ] Hero contains no blanket 2022+ production claim.
- [ ] Scrim preserves readable contrast at every review width.
- [ ] Reduced motion disables Hero entrance motion.

## E. Navigator

- [ ] Navigator is a semantic `<nav>`.
- [ ] Exactly three categories render: Sedans, SUV, Group Transport.
- [ ] V-Class and Sprinter both render under Group Transport.
- [ ] The navigator surface is capped by the approved main container with no extra inner panel gutter.
- [ ] Navigator uses one semantic card-radius shell; individual anchors are not pills.
- [ ] Category anchors target real page ids.
- [ ] No client JavaScript is required.
- [ ] Targets meet 44×44 project minimum.
- [ ] Focus is clearly visible.
- [ ] Navigator is not styled as an excessive pill cloud.
- [ ] No accidental horizontal overflow exists at 320.

## F. Canonical fleet roster

- [ ] `VehicleClass` contains `suv`.
- [ ] `VehicleId` contains `skoda-kodiaq`.
- [ ] Kodiaq canonical display name is `Škoda Kodiaq`.
- [ ] Kodiaq vehicle class is `suv`.
- [ ] Kodiaq service capacity is not fabricated.
- [ ] Kodiaq `passengers` remains null until owner-confirmed.
- [ ] Existing seven priced vehicle configurations remain intact.
- [ ] V-Class retains both 6-passenger and 7-passenger canonical records.
- [ ] Vito remains in canonical Fleet data and retains its published pricing row.
- [ ] Vito has `showOnFleetPage: false` and `image: null` in Fleet-page presentation data.
- [ ] Fleet ID uniqueness guard passes.

## G. Kodiaq pricing safety

- [ ] No Kodiaq numeric price is invented.
- [ ] Existing prices are not copied to Kodiaq.
- [ ] Canonical data can represent `quote-only` pricing status.
- [ ] Existing priced vehicles remain `published`.
- [ ] Kodiaq is `quote-only`.
- [ ] Unknown vehicle IDs still fail loudly.
- [ ] Pricing callers cannot perform arithmetic on missing Kodiaq price data.
- [ ] Pricing page/calculator behavior remains correct for existing priced vehicles.
- [ ] Kodiaq renders no numeric price until canonical pricing exists.

## H. Media

- [ ] Hero asset exists before implementation completes.
- [ ] S-Class uses `original/s-class/left-facing.webp`.
- [ ] E-Class uses `original/e-class/left-facing.webp`.
- [ ] Superb uses `original/superb/left-facing.webp`.
- [ ] Kodiaq uses `original/kodiaq/left-facing.webp`.
- [ ] V-Class uses `original/v-class/left-facing.webp`.
- [ ] Sprinter uses `original/sprinter/left-facing.webp`.
- [ ] No side-facing image substitutes for a locked chapter.
- [ ] Vehicle media fills the complete stable 3:2 stage with centered `object-cover`.
- [ ] Every vehicle image has a very light semantic black scrim.
- [ ] Original multi-megabyte source files are transformed by Astro.
- [ ] Only Hero is eager/high priority.
- [ ] Vehicle images are lazy loaded with intrinsic geometry.
- [ ] Decorative vehicle images use empty alt where adjacent model heading supplies identity.

## I. Vehicle chapters

- [ ] Exactly six visual chapters render.
- [ ] Chapter order is locked.
- [ ] S/E/Superb/Kodiaq/Sprinter each resolve one canonical vehicle record.
- [ ] V-Class resolves exactly two canonical vehicle records.
- [ ] Vito does not render in the Fleet showcase or Fleet-page HTML.
- [ ] Canonical display name comes from fleet data/model-family vocabulary.
- [ ] Vehicle class comes from canonical fleet data and localized UI label.
- [ ] Passenger capacity comes only from canonical fleet data.
- [ ] Null passenger capacity is omitted cleanly.
- [ ] Kodiaq renders no empty/unknown capacity row.
- [ ] V-Class shows two service configurations without duplicating the vehicle image.
- [ ] Editorial summary/best-for/highlights come from localized content.
- [ ] No horsepower, engine, acceleration, trim, or fuel-economy content renders.
- [ ] No unverified Wi-Fi, massage, screen, audio, charging, or privacy-glass claim renders.

## J. Responsive vehicle composition

- [ ] 320: single-column identity → image → facts → copy.
- [ ] 768: single-column composition remains intentional, not desktop squeezed.
- [ ] 1024: vehicle chapter uses approved 6/6 split.
- [ ] 1440: vehicle chapter uses approved 7/5 split.
- [ ] Desktop vehicle splits use the canonical 12-column grid and approved column-gap token.
- [ ] 1920: main content remains capped by approved container.
- [ ] DOM order stays logical.
- [ ] No CSS visual reordering breaks reading/focus order.
- [ ] Vehicle image fills the stage and its centred subject remains clear at every review width.
- [ ] No chapter causes page overflow.

## K. Fit Guide

- [ ] Fit Guide uses `sections[key=chooseRightVehicle]`.
- [ ] Exactly four criteria render.
- [ ] Criteria are Passengers, Luggage, Journey type, One vehicle or several.
- [ ] One shared light panel contains all four criteria.
- [ ] Four detached light cards do not render.
- [ ] <64rem uses stacked rows and internal dividers.
- [ ] ≥64rem uses four columns and internal dividers.
- [ ] Copy explains that passenger count and luggage are assessed together.
- [ ] Copy does not guarantee nominal maximum capacity with unlimited luggage.

## L. FAQ

- [ ] Exactly eight localized FAQ items render.
- [ ] Shared FAQ component is reused.
- [ ] FAQ is keyboard accessible.
- [ ] Visible FAQ and FAQPage schema use the same array.
- [ ] FAQ covers exact model, capacity, V-Class configs, luggage, Kodiaq, multiple vehicles, child seats, manual confirmation.
- [ ] No unverified vehicle spec appears in FAQ.
- [ ] FAQ uses the contained light Section pattern, not a full-width light band.

## M. Final CTA

- [ ] Existing `FinalCTA` is reused.
- [ ] Primary action uses booking flow.
- [ ] Secondary action uses quote flow.
- [ ] Final CTA does not duplicate Hero scale/height.
- [ ] Tertiary contact behavior remains the shared component's approved contract.

## N. Design compliance

- [ ] Inter Tight is computed for H1/H2/H3.
- [ ] Manrope is computed for body/UI/actions.
- [ ] Semantic tokens from the theme selected by `foundation.config.ts` are used.
- [ ] No raw active-theme values are copied into page CSS.
- [ ] No gold-first styling.
- [ ] No metallic gradients.
- [ ] No glow.
- [ ] No glassmorphism.
- [ ] No dashboard-style card grid.
- [ ] No oversized SaaS rounding.
- [ ] Platinum remains restrained.
- [ ] Vehicle media, typography, and whitespace establish hierarchy before decoration.
- [ ] Introduction copy aligns to a bounded reading span of the canonical main grid.

## O. Technical quality

- [ ] `content:sync-digests` completed after source content finalized.
- [ ] `routes:validate` passes.
- [ ] `content:validate` passes.
- [ ] `seo:validate` passes.
- [ ] theme validation passes.
- [ ] Type generation/check passes.
- [ ] lint passes.
- [ ] unit tests pass.
- [ ] build passes.
- [ ] required responsive UI verification passes.
- [ ] accessibility review passes WCAG 2.2 AA.
- [ ] no required command is claimed as passed without execution.
- [ ] `design:context` resolves the `fleet` surface for the exact FleetPage target.
- [ ] `verify:ui --change page` passes for the FleetPage target and `fleet` surface.
