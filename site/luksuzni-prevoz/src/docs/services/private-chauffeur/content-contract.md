# Private Chauffeur v3 — Content Integration Contract

Status: **LOCKED CONTENT CONTRACT**

## 1. Production targets

Replace the existing scaffold files with:

```text
src/content/pages/private-chauffeur/private-chauffeur.sr.md
src/content/pages/private-chauffeur/private-chauffeur.en.md
src/content/pages/private-chauffeur/private-chauffeur.ru.md
```

The files in `content/` are complete v3 editorial entries.

Initial lifecycle is deliberately:

```text
status: in-review
translationState: reviewed
noindex: true
```

This makes the real page available for development/review without publishing it in production.

The final implementation task changes lifecycle to `published` only after the page passes the v3 acceptance contract.

## 2. Translation source

Serbian is canonical source content.

The current source digest is generator-owned. Obtain it with
`pnpm content:sync-digests site/luksuzni-prevoz`; do not preserve a packet
literal when recursive canonicalization or source content changes.

EN and RU already carry this digest.

If Serbian editorial copy changes, run:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

Then re-review EN/RU before restoring `translationState: reviewed`.

## 3. UI dictionaries

Files under:

```text
ui-additions/
  sr.json
  en.json
  ru.json
```

are **merge fragments**, not replacement dictionaries.

Merge every key/value into:

```text
src/content/ui/sr.json
src/content/ui/en.json
src/content/ui/ru.json
```

Do not delete or replace existing UI constants.

All three addition files contain the exact same key set.

## 4. Existing UI constants that MUST be reused

Do not duplicate these existing keys:

```text
booking.mode.hourly
booking.mode.halfDay
booking.mode.fullDay
booking.minimum
booking.included
booking.upTo
booking.unit.hours
booking.unit.km

service.privateChauffeur.chauffeurAvailable
service.privateChauffeur.multiDayQuote
service.privateChauffeur.internationalQuote
service.privateChauffeur.complexQuote

serviceStandards.group.chauffeur
serviceStandards.group.vehicle
serviceStandards.group.care
serviceStandards.group.comfort

operations.chauffeur.*
operations.vehicle.*
operations.service.*

fleet.class.sedan
fleet.passengers
fleet.carousel.*
```

## 5. Canonical numeric interpolation

Numeric operational facts do NOT live in the Markdown files.

The FAQ uses only the following placeholders:

```text
{minimumHours}
{halfDayHours}
{halfDayKm}
{fullDayHours}
{fullDayKm}
```

Resolve them from:

```text
services.privateChauffeur.bookingOptions
```

before rendering the visible FAQ.

The exact same interpolated FAQ array MUST be passed to:

```text
FAQ
buildFaqPage()
```

No second FAQ mapping with duplicated values.

## 6. UI template interpolation

The following UI templates also receive canonical values:

```text
privateChauffeur.hero.supportTemplate
privateChauffeur.overview.minimumHire.title
privateChauffeur.options.hourlyFact
privateChauffeur.options.halfDayFact
privateChauffeur.options.fullDayFact
```

Supported UI tokens:

```text
{minimumHours}
{halfDayHours}
{halfDayKm}
{fullDayHours}
{fullDayKm}
{hours}
{km}
```

Use one deterministic interpolation helper inside the Private Chauffeur page adapter or an existing repository helper.

Do not create several independent `.replace()` chains across sections.

The helper MUST fail in development/build when a required token remains unresolved.

## 7. FAQ limit

The repository `faqSchema` allows a maximum of **10 items**.

V3 contains exactly 10.

The previous 11-topic planning version is superseded.

The "schedule changes" objection is handled inside FAQ item 6:

```text
multiple stops + schedule changes
```

Do not expand the FAQ beyond 10 without an explicit schema/product revision.

## 8. Content/presentation boundary

Markdown owns:

```text
SEO copy
Hero editorial copy
section headings
section intros/bodies
hire-suitability copy
benefit statements
editorial statement copy
passenger-experience copy
vehicle-section framing
FAQ wording
Final CTA wording
```

UI JSON owns:

```text
section labels
data-derived fact labels
data-derived fact templates
illustrative itinerary labels
standards heading/intro
custom-engagement fact labels
quiet contextual CTA labels
```

Typed data owns:

```text
durations
kilometres
availability modes
multi-day handling
international handling
fleet facts
operational standards
routes
contacts
pricing
```

No layer becomes an alternate source of truth.
