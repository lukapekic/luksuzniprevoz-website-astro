# Corporate Transportation v1 — Acceptance Contract

Status: **HARD PASS / FAIL**

Every applicable blocking item must pass before publication.

---

# A. Authority

- [ ] root `AGENTS.md` read
- [ ] `DESIGN.md` read
- [ ] locked blueprint read
- [ ] implementation contract read
- [ ] wireframe read
- [ ] content contract read
- [ ] asset contract read
- [ ] required skills loaded
- [ ] design context ran before UI work
- [ ] compliance matrix exists

# B. Route / lifecycle

- [ ] routeKey is `corporateTransportation`
- [ ] route kind is service
- [ ] parent is `businessTransportation`
- [ ] SR v1 replaces scaffold
- [ ] EN v1 replaces scaffold
- [ ] RU v1 replaces scaffold
- [ ] Serbian is source locale
- [ ] EN sourceDigest matches the repository-generated Serbian source digest
- [ ] RU sourceDigest matches the repository-generated Serbian source digest
- [ ] all three remain `in-review` during implementation
- [ ] all three remain `noindex:true` during implementation
- [ ] route remains scaffold until release

# C. Exact visible order

- [ ] Full-bleed Hero
- [ ] Service Overview
- [ ] Audience Rail
- [ ] One-Off vs Recurring
- [ ] Working Day
- [ ] Coordination Panel
- [ ] Vehicle Recommendations
- [ ] Standards
- [ ] FAQ
- [ ] FinalCTA
- [ ] no extra section
- [ ] no Business Hub logos
- [ ] no reviews
- [ ] no pricing
- [ ] no process section
- [ ] no related-service grid

# D. Hero

- [ ] shared `ServiceHero`
- [ ] `variant="full-bleed"`
- [ ] over-Hero layout enabled
- [ ] localized eyebrow
- [ ] exactly one H1
- [ ] booking CTA visible
- [ ] quote CTA visible
- [ ] support line is capability-driven
- [ ] one-off fact shown
- [ ] recurring fact shown
- [ ] invoicing fact shown
- [ ] dedicated-chauffeur fact shown
- [ ] manual-confirmation fact shown
- [ ] no price/rating/trust-chip wall
- [ ] locked shared Hero WebP resolves through `ServiceHero`

# E. Overview

- [ ] shared `ServiceOverview`
- [ ] numbered-divider-facts
- [ ] open-dark
- [ ] exactly four facts
- [ ] 01 one-off
- [ ] 02 recurring
- [ ] 03 invoicing
- [ ] 04 same chauffeur across connected stops
- [ ] canonical assertions gate all facts
- [ ] no icons
- [ ] no cards

# F. Audience Rail

- [ ] section key `audience`
- [ ] exactly five items
- [ ] divider-led editorial composition
- [ ] decorative 01–05
- [ ] no raised cards
- [ ] no icons
- [ ] readable at tablet widths
- [ ] mobile is one vertical sequence

# G. Engagement Panel

- [ ] `CorporateEngagementPanel`
- [ ] one light parent surface
- [ ] desktop 5 / 7
- [ ] one-off path exists
- [ ] recurring path exists
- [ ] one-off CTA → booking
- [ ] recurring CTA → quote
- [ ] recurring side has exactly 3 capability facts
- [ ] recurring contracts fact
- [ ] invoicing fact
- [ ] negotiated terms fact
- [ ] no price
- [ ] no pricing-card appearance
- [ ] no unsupported contract promise

# H. Working Day

- [ ] section key `workingDay`
- [ ] locked shared Working Day WebP resolves through `OpenSplitSection`
- [ ] desktop image 7 / content 5
- [ ] exactly three authored benefits
- [ ] itinerary rendered
- [ ] order = Hotel → Office → Meeting → Lunch → Client → Dinner
- [ ] itinerary labels come from UI
- [ ] no hardcoded times
- [ ] no map
- [ ] no JS
- [ ] no dashboard styling
- [ ] mobile itinerary has no horizontal overflow

# I. Coordination Panel

- [ ] `CorporateCoordinationPanel`
- [ ] elevated graphite surface
- [ ] desktop 5 / 7
- [ ] exactly three nodes
- [ ] chauffeur node
- [ ] company-contact node
- [ ] confirmed-itinerary node
- [ ] one confirmed transport plan destination
- [ ] static CSS connectors only
- [ ] quiet booking CTA visible
- [ ] no JS diagram
- [ ] no glow/glass/raw colors

# J. Vehicles

- [ ] shared `VehicleRecommendations`
- [ ] exactly three vehicles
- [ ] S-Class first
- [ ] E-Class second
- [ ] V-Class 7+1 Extra Long third
- [ ] no Sprinter
- [ ] no Superb
- [ ] no fourth vehicle
- [ ] canonical fleet facts/media
- [ ] no fare

# K. Standards

- [ ] shared `ServiceStandards`
- [ ] `numbered-matrix`
- [ ] `contained-dark`
- [ ] desktop 4 / 8
- [ ] exactly 4 groups
- [ ] exactly 3 facts per group
- [ ] markers 01–04
- [ ] canonical operations builder used
- [ ] Corporate heading/intro from UI
- [ ] no Corporate standards clone
- [ ] no background-check copy
- [ ] no massage-seat copy

# L. FAQ

- [ ] exactly nine questions
- [ ] shared `FAQ`
- [ ] ReadingContainer used
- [ ] light surface
- [ ] all seven approved tokens resolve
- [ ] unknown token causes error
- [ ] unresolved token causes error
- [ ] one-off answer canonical-gated
- [ ] recurring answer canonical-gated
- [ ] commercial answer canonical-gated
- [ ] dedicated answer canonical-gated
- [ ] outside-area answer Business-hub gated
- [ ] vehicle answer operations-gated
- [ ] confirmation answer manual-confirmation gated
- [ ] exact visible resolved array feeds FAQ schema

# M. Final CTA

- [ ] shared `FinalCTA`
- [ ] localized heading/text
- [ ] booking button visible
- [ ] quote button visible
- [ ] both use `resolveCtaHref`
- [ ] booking resolves with canonical `intent=booking`
- [ ] quote resolves with canonical `intent=quote`
- [ ] no fake booking route
- [ ] no manual localized URL
- [ ] no page-local clone

# N. Pricing safety

All absent:

- [ ] no hourly fare
- [ ] no per-km fare
- [ ] no from-price
- [ ] no currency
- [ ] no pricing matrix
- [ ] no automatic estimate
- [ ] no unsupported discount
- [ ] no guaranteed negotiated rate

# O. Data ownership

- [ ] Corporate capabilities from `services.ts`
- [ ] outside-area handling from Business Hub service data
- [ ] fleet from `fleet.ts`
- [ ] standards from `operations.ts`
- [ ] confirmation mode from contact data
- [ ] routes/flows from routing helpers
- [ ] no operational fact stored in page component
- [ ] no localized path stored in content
- [ ] no hardcoded visible strings in Astro

# P. UI dictionaries

- [ ] additions merged into SR
- [ ] additions merged into EN
- [ ] additions merged into RU
- [ ] dictionaries were not replaced
- [ ] no unrelated key deleted
- [ ] Corporate key sets identical across locales
- [ ] existing `business.*` reused
- [ ] existing `operations.*` reused

# Q. Components

Expected page-local:

- [ ] CorporateTransportationPage
- [ ] CorporateEngagementPanel
- [ ] CorporateCoordinationPanel

Shared:

- [ ] BaseLayout
- [ ] ServiceHero
- [ ] ServiceOverview
- [ ] OpenSplitSection
- [ ] VehicleRecommendations
- [ ] ServiceStandards
- [ ] FAQ
- [ ] FinalCTA
- [ ] Section
- [ ] PageContainer
- [ ] ReadingContainer
- [ ] SectionHeading
- [ ] Link

- [ ] no speculative Business-family abstraction
- [ ] every shared edit used blocker protocol
- [ ] affected shared consumers reviewed

# R. Image contract

- [ ] Hero uses `src/assets/shared/other/chauffeur-inside-grayedout.webp`
- [ ] Working Day uses `src/assets/shared/other/s-class-driving-forest-intheback.webp`
- [ ] no remote stock hotlink
- [ ] no autonomous stock substitution
- [ ] Astro image pipeline
- [ ] Hero priority follows shared contract
- [ ] Working Day lazy-loads
- [ ] stable dimensions/aspect
- [ ] no placeholder or duplicate page-local copy remains at publication

# S. Responsive

Reviewed:

- [ ] mobile
- [ ] tablet portrait
- [ ] tablet landscape
- [ ] desktop
- [ ] wide desktop

Specific:

- [ ] 320 matches locked mobile topology
- [ ] 768 matches locked tablet-portrait topology
- [ ] 1024 matches locked tablet-landscape topology
- [ ] 1440 matches locked desktop topology
- [ ] 1920 matches locked wide-desktop topology
- [ ] `md`, `lg`, `xl`, and `2xl` transitions verified on both sides where used
- [ ] Working Day DOM remains copy then image
- [ ] Working Day visual 7/5 activates at `lg`
- [ ] itinerary is vertical below `lg` and one row from `lg`
- [ ] Audience is 1 / 2 / 2 / 3 / 5 columns across required states
- [ ] Hero support is stacked below `xl` and 7/5 from `xl`
- [ ] both FinalCTA actions remain visible
- [ ] SR/EN/RU long content wraps without clipping
- [ ] CTA destination intent is correct at every state
- [ ] keyboard/focus order follows DOM order
- [ ] all visible actions remain at least 44×44
- [ ] no horizontal overflow at any required state

# T. Accessibility

- [ ] WCAG 2.2 AA
- [ ] exactly one H1
- [ ] logical headings
- [ ] 44×44 targets
- [ ] visible focus
- [ ] keyboard operation
- [ ] semantic lists
- [ ] decorative numbering hidden from AT
- [ ] correct alt handling
- [ ] reduced motion
- [ ] logical DOM order
- [ ] light FAQ contrast passes

# U. Theme / design

- [ ] Theme V2 semantic tokens only
- [ ] no raw colors
- [ ] no parallel spacing/radius system
- [ ] no new breakpoints
- [ ] no black/gold cliché
- [ ] no glass/glow/metallic gradient
- [ ] no SaaS dashboard look
- [ ] typography follows DESIGN.md
- [ ] H1/H2/H3 hierarchy follows blueprint §18
- [ ] headings use `font-heading`; body/UI/actions use `font-body`
- [ ] `font-brand` appears only in BrandLockup
- [ ] page feels calm, VIP, operationally confident

# V. SEO

- [ ] `buildPageSeo()` reused
- [ ] no component `<head>`
- [ ] localized SEO title/description
- [ ] canonical correct
- [ ] hreflang correct
- [ ] FAQ schema from visible resolved array
- [ ] no price schema
- [ ] no fake review schema
- [ ] lifecycle/noindex correct

# W. Dispatcher / release

- [ ] existing dispatcher reused
- [ ] Corporate mapping added
- [ ] no catch-all duplication
- [ ] route remains scaffold during implementation
- [ ] SR/EN/RU all validate
- [ ] both locked shared images resolve
- [ ] acceptance fully passes
- [ ] only then route → published
- [ ] only then content → published/indexable
- [ ] all locales release together

# X. Verification

Actually ran successfully:

- [ ] design context
- [ ] components check
- [ ] foundation doctor
- [ ] types generation
- [ ] theme validation
- [ ] routes validation
- [ ] content validation
- [ ] SEO validation
- [ ] lint
- [ ] unit tests
- [ ] Astro check
- [ ] production build
- [ ] UI verification
- [ ] independent design review
- [ ] technical page review

No unchecked blocking item at publication.
