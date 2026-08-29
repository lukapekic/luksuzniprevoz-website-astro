# Private Chauffeur v3 — Acceptance Contract

Status: **HARD PASS/FAIL RELEASE GATE**
Route key: `privateChauffeur`

Every applicable item MUST pass.

Unchecked blocking item = page not complete.

---

# A. Authority

- [ ] Root `AGENTS.md` read.
- [ ] Root `DESIGN.md` read.
- [ ] Locked v3 `blueprint.md` read.
- [ ] v3 `wireframe.html` read.
- [ ] v3 `implementation.md` read.
- [ ] shared service contracts read.
- [ ] required `.skills` bundle loaded.
- [ ] design context command ran before UI editing.
- [ ] compliance matrix exists.

---

# B. Product Definition

- [ ] Hero clearly states this is Private Chauffeur.
- [ ] Hero clearly communicates fleet vehicle + professional chauffeur.
- [ ] Page does not imply chauffeur-only service in customer-owned vehicle.
- [ ] Page distinguishes Private Chauffeur from point-to-point transfer.
- [ ] Page communicates reserved-period behavior.
- [ ] Manual confirmation is preserved.
- [ ] No instant/on-demand promise exists.
- [ ] No 24/7 booking promise exists.

---

# C. Exact Page Order

Visible order is exactly:

- [ ] ServiceHero
- [ ] ServiceOverview
- [ ] PrivateChauffeurOptions
- [ ] Your Time Remains Yours
- [ ] One Chauffeur. One Schedule.
- [ ] Travel Without Losing the Day
- [ ] What Comes With Every Hire
- [ ] Passenger Experience
- [ ] Sedan Recommendations
- [ ] Custom Engagement Panel
- [ ] FAQ
- [ ] FinalCTA

- [ ] Header comes from approved global chrome.
- [ ] Footer comes from approved global chrome.
- [ ] No extra visible section was inserted.
- [ ] No required section was merged or removed.

---

# D. Forbidden Sections / Drift

- [ ] no reviews carousel
- [ ] no Homepage TrustStrip
- [ ] no process/how-it-works section
- [ ] no pricing table
- [ ] no Hero booking form
- [ ] no related-services card grid
- [ ] no gallery
- [ ] no duplicate CTA band
- [ ] no fake metrics
- [ ] no icon feature wall
- [ ] no decorative cardification

---

# E. Hero

- [ ] uses shared `ServiceHero`
- [ ] uses shared `full-bleed` variant
- [ ] remains a full-width near-viewport media canvas at every state
- [ ] uses the approved over-Hero SiteHeader behavior
- [ ] exactly one H1
- [ ] primary CTA intent = booking flow
- [ ] secondary CTA intent = quote flow
- [ ] booking and quote actions remain visible through canonical flow fallback
- [ ] quiet support line exists
- [ ] support facts come from canonical service data
- [ ] no price appears
- [ ] no rating appears
- [ ] no trust chips appear
- [ ] no fleet specs appear
- [ ] no third CTA appears
- [ ] Hero image is the locked owner-supplied chauffeur-wheel asset

---

# F. Service Definition

- [ ] uses shared `ServiceOverview`
- [ ] open-dark presentation
- [ ] desktop 5 / 7 relationship
- [ ] exactly four factual rows
- [ ] rows use numbers, not icons
- [ ] row 01 communicates vehicle + chauffeur
- [ ] row 02 communicates minimum hire
- [ ] row 03 communicates multiple planned stops
- [ ] row 04 communicates chauffeur availability
- [ ] facts are data-driven/localized
- [ ] no TrustStrip
- [ ] no card grid

---

# G. Hire Options

- [ ] uses `PrivateChauffeurOptions`
- [ ] exactly Hourly / Half Day / Full Day
- [ ] one light functional parent
- [ ] internal dividers
- [ ] no three floating cards
- [ ] hourly minimum comes from `services.ts`
- [ ] hourly km allowance is not invented
- [ ] half-day hours come from `services.ts`
- [ ] half-day km come from `services.ts`
- [ ] full-day hours come from `services.ts`
- [ ] full-day km come from `services.ts`
- [ ] primary booking and quiet custom-quote intents remain authored
- [ ] actions resolve through the canonical flow fallback without manual URLs
- [ ] mobile stacks naturally
- [ ] no horizontal scroll

---

# H. Pricing Hard Gate

All absent:

- [ ] no hourly fare
- [ ] no half-day fare
- [ ] no full-day fare
- [ ] no per-km fare
- [ ] no from-price
- [ ] no EUR
- [ ] no RSD
- [ ] no currency symbol
- [ ] no calculated estimate
- [ ] no duplicated pricing matrix

Any visible monetary fare = immediate failure.

---

# I. Your Time Remains Yours

- [ ] uses locked productivity image
- [ ] desktop image 7 / content 5
- [ ] heading matches locked intent
- [ ] body sells usable passenger time
- [ ] exactly three benefit statements
- [ ] productivity benefit present
- [ ] logistics benefit present
- [ ] arrival-readiness benefit present
- [ ] no CTA
- [ ] no icons
- [ ] no cards

---

# J. One Chauffeur. One Schedule.

- [ ] uses locked backseat-view image
- [ ] desktop content 5 / image 7
- [ ] continuity message is explicit
- [ ] itinerary is visible
- [ ] itinerary is static semantic HTML/CSS
- [ ] itinerary contains six locked stops
- [ ] exactly three factual statements
- [ ] multiple-stops fact present
- [ ] chauffeur-availability fact present
- [ ] multi-day/international quote fact present
- [ ] quiet quote intent remains visible through canonical flow fallback
- [ ] no map
- [ ] no JS timeline
- [ ] no cards

---

# K. Editorial Statement

- [ ] uses `PrivateChauffeurEditorialStatement`
- [ ] desktop 8 / 4
- [ ] locked vertical image used
- [ ] heading = Travel without losing the day intent
- [ ] exactly four statements
- [ ] one contained graphite fact panel
- [ ] panel is 2×2 from `lg` and one column below `lg`
- [ ] number markers are decorative
- [ ] no-next-car statement present
- [ ] no-parking-decisions statement present
- [ ] no-itinerary-repetition statement present
- [ ] continue-when-ready statement present
- [ ] no CTA
- [ ] no icons
- [ ] no extra paragraph stack

---

# L. Service Standards

- [ ] uses shared `ServiceStandards`
- [ ] contained graphite / dark surface
- [ ] desktop 4 / 8
- [ ] right side is a contiguous 2×2 matrix from `lg`
- [ ] mobile and tablet portrait use one vertical sequence
- [ ] exactly four groups
- [ ] exactly three visible facts per group
- [ ] group 01 Professional chauffeur
- [ ] group 02 Prepared vehicle
- [ ] group 03 Passenger care
- [ ] group 04 Cabin comfort
- [ ] operations facts come from `operations.ts`
- [ ] background-check wording is not public
- [ ] massage-seat wording is not present
- [ ] no badges
- [ ] no icons
- [ ] no cards

---

# M. Passenger Experience

- [ ] uses locked passenger-reading image
- [ ] desktop image 7 / content 5
- [ ] short body only
- [ ] exactly two quiet facts
- [ ] discretion fact present
- [ ] private rear-cabin fact present
- [ ] no CTA
- [ ] no repeated amenity list

---

# N. Sedan Recommendations

- [ ] uses shared `VehicleRecommendations`
- [ ] exactly three vehicles
- [ ] order is S-Class
- [ ] then E-Class
- [ ] then Škoda Superb
- [ ] no V-Class
- [ ] no Sprinter
- [ ] no fourth vehicle
- [ ] vehicle IDs come from validated content/canonical assertion
- [ ] vehicle facts come from fleet data
- [ ] no invented features
- [ ] no fare

---

# O. Custom Engagement Panel

- [ ] uses `PrivateChauffeurCustomPanel`
- [ ] elevated graphite semantic surface
- [ ] desktop 7 / 5
- [ ] heading matches locked intent
- [ ] exactly three facts
- [ ] multi-day fact present
- [ ] longer-distance/international fact present
- [ ] complex-itinerary fact present
- [ ] primary custom-quote and quiet schedule intents remain authored
- [ ] actions resolve through the canonical flow fallback without manual URLs
- [ ] no cards
- [ ] no pricing
- [ ] no response-time promise

---

# P. FAQ

- [ ] semantic major-section spacing clearly separates Custom Engagement and FAQ
- [ ] exactly 10 FAQ items
- [ ] FAQ respects repository schema maximum
- [ ] numeric placeholders are interpolated from `services.ts`
- [ ] no unresolved Private Chauffeur hire tokens reach rendered HTML
- [ ] visible FAQ and FAQ schema use the same interpolated array
- [ ] uses shared `FAQ`
- [ ] uses `ReadingContainer`
- [ ] light surface
- [ ] addresses transfer difference
- [ ] addresses minimum hire
- [ ] addresses chauffeur between stops
- [ ] addresses half-day
- [ ] addresses full-day
- [ ] addresses multiple stops
- [ ] addresses multi-day
- [ ] addresses outside Belgrade/international
- [ ] addresses vehicle selection
- [ ] addresses confirmation
- [ ] addresses schedule changes only with verified wording
- [ ] no unsupported overtime answer
- [ ] no unsupported parking answer
- [ ] no unsupported toll answer
- [ ] visible FAQ and structured FAQ use the same array

---

# Q. Final CTA

- [ ] uses existing shared `FinalCTA`
- [ ] heading matches "Tell us how your day is planned" intent
- [ ] body asks for date/time/locations/passengers/vehicle preference
- [ ] primary intent = booking
- [ ] secondary intent = quote
- [ ] both booking and quote buttons are visible
- [ ] both use the canonical current flow fallback
- [ ] verified contact gating used
- [ ] no PrivateChauffeur FinalCTA clone
- [ ] no Hero-like height
- [ ] no page-local FinalCTA styling

---

# R. Image Contract

- [ ] Hero uses chauffeur-wheel image
- [ ] productivity uses laptop/backseat image
- [ ] schedule uses backseat-view image
- [ ] editorial statement uses vertical image
- [ ] passenger experience uses reading-passenger image
- [ ] reserved alternate asset is not duplicated onto this page
- [ ] no contextual image is reused twice
- [ ] no remote stock image
- [ ] no unrelated Homepage/Airport image substitution
- [ ] below-fold contextual images lazy-load
- [ ] Astro image pipeline used
- [ ] stable dimensions/aspect prevent CLS
- [ ] all six source assets have one shared `assets/shared/chauffeur-service` owner

---

# S. Shared Component Discipline

Reused:

- [ ] BaseLayout
- [ ] ServiceHero
- [ ] ServiceOverview
- [ ] VehicleRecommendations
- [ ] ServiceStandards
- [ ] OpenSplitSection
- [ ] FAQ
- [ ] FinalCTA
- [ ] Section
- [ ] PageContainer
- [ ] ReadingContainer
- [ ] SectionHeading
- [ ] Link

Page-local expected:

- [ ] PrivateChauffeurPage
- [ ] PrivateChauffeurOptions
- [ ] PrivateChauffeurEditorialStatement
- [ ] PrivateChauffeurCustomPanel

- [ ] every additional component has explicit approved justification
- [ ] no shared component was changed silently
- [ ] any shared change used the approved additive change protocol and cross-page review

---

# T. Content Ownership

- [ ] no hardcoded user-visible English in Astro
- [ ] no agent-invented Serbian translation
- [ ] no agent-invented Russian translation
- [ ] no hire duration duplicated as content truth
- [ ] no km allowance duplicated as content truth
- [ ] no fleet fact duplicated
- [ ] no operation fact duplicated
- [ ] no contact fact duplicated
- [ ] no route URL duplicated
- [ ] UI labels exist in all configured locales

---

# U. V3 Content Package

- [ ] SR v3 content file replaces SR scaffold
- [ ] EN v3 content file replaces EN scaffold
- [ ] RU v3 content file replaces RU scaffold
- [ ] all three are `status: in-review` during implementation
- [ ] all three are `noindex: true` during implementation
- [ ] Serbian is source locale
- [ ] EN sourceDigest matches the recursively generated Serbian source digest
- [ ] RU sourceDigest matches the recursively generated Serbian source digest
- [ ] UI addition key sets are identical across SR/EN/RU
- [ ] UI fragments were merged, not used to replace existing dictionaries
- [ ] existing reusable UI keys were not duplicated
- [ ] content-contract.md rules are followed

---

# V. Route / Lifecycle

- [ ] existing dispatcher reused
- [ ] privateChauffeur mapped to dedicated renderer
- [ ] scaffold still renders ScaffoldPage before publication
- [ ] no catch-all route duplication
- [ ] SR content valid
- [ ] EN content reviewed
- [ ] RU content reviewed
- [ ] content parity passes
- [ ] route changed to published only after all release gates
- [ ] noindex lifecycle correct

---

# W. SEO / Structured Data

- [ ] `buildPageSeo()` reused
- [ ] page emits no `<head>`
- [ ] one H1
- [ ] localized SEO title
- [ ] localized SEO description
- [ ] canonical correct
- [ ] hreflang correct
- [ ] route lifecycle reflected
- [ ] FAQ schema uses visible FAQ array
- [ ] no price schema
- [ ] no fake review schema
- [ ] no ad-hoc JSON-LD duplication

---

# X. Typography / Theme

- [ ] H1 computed font = approved heading stack
- [ ] H2 computed font = approved heading stack
- [ ] body computed font = approved body stack
- [ ] nav/button typography remains approved
- [ ] brand font does not leak into headings/body
- [ ] no raw hex
- [ ] no raw rgb/hsl
- [ ] no page-local palette
- [ ] no page-local spacing scale
- [ ] no page-local radius scale
- [ ] no page-local breakpoint system
- [ ] no copied wireframe CSS
- [ ] no gold
- [ ] no glow
- [ ] no glass
- [ ] no metallic gradient
- [ ] no routine hover lift

---

# Y. Accessibility

- [ ] WCAG 2.2 AA
- [ ] exactly one H1
- [ ] logical heading hierarchy
- [ ] 44x44 minimum targets
- [ ] visible focus
- [ ] keyboard navigation
- [ ] no hover-only information
- [ ] FAQ keyboard operable
- [ ] decorative images use empty alt
- [ ] informative alt localized
- [ ] reduced motion respected
- [ ] DOM order matches reading/focus order
- [ ] light-surface contrast passes
- [ ] no horizontal overflow

---

# Z. Responsive

Reviewed independently:

- [ ] mobile
- [ ] tablet portrait
- [ ] tablet landscape
- [ ] desktop
- [ ] wide desktop

Desktop locked topologies:

- [ ] Hero full-bleed media canvas
- [ ] Overview 5 / 7
- [ ] Hire Options 3 internal columns
- [ ] Your Time 7 / 5
- [ ] One Schedule 5 / 7
- [ ] Editorial Statement 8 / 4
- [ ] Standards 4 / 8
- [ ] Passenger Experience 7 / 5
- [ ] Custom Panel 7 / 5

Mobile:

- [ ] Hero transformed correctly
- [ ] options vertical
- [ ] image/text order logical
- [ ] itinerary readable
- [ ] vertical editorial image does not dominate viewport
- [ ] standards readable
- [ ] sedan names fit
- [ ] custom panel vertical
- [ ] FAQ wraps
- [ ] FinalCTA remains compact

---

# AA. Verification

Actual commands completed successfully:

- [ ] design context
- [ ] components check
- [ ] foundation doctor
- [ ] types generation/validation
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

The completion report contains:

- [ ] exact files changed
- [ ] exact commands run
- [ ] actual results
- [ ] blockers
- [ ] content lifecycle state
- [ ] asset state

All applicable boxes must be checked before publication.
