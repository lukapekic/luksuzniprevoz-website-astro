# Special Events Hub — V2 Redesign Package

**Route key:** `specialEvents`  
**Status:** READY FOR IMPLEMENTATION  
**Primary locale:** `sr`  
**Theme:** configured active Black & Platinum system

This directory is the implementation package for the Special Events hub redesign.

It supersedes the planning-level document:

`src/docs/services/hub-specs/special-events-hub.md`

for all page-specific structure, content, imagery, responsive, and implementation decisions.

Root `AGENTS.md` remains the technical authority. `DESIGN.md` and the configured active Theme V2 token source remain the visual-system authority.

## Files

```text
special-events/
├── README.md
├── blueprint.md
├── wireframe.md
├── implementation.md
├── acceptance.md
└── redesign-content-pack/
    ├── special-events.sr.md
    ├── special-events.en.md
    ├── special-events.ru.md
    ├── ui-additions.sr.json
    ├── ui-additions.en.json
    └── ui-additions.ru.json
```

## Content installation contract

The three packaged `special-events.*.md` files replace the matching production entries under:

`src/content/pages/special-events/`

The three `ui-additions.*.json` files are merge-only additions for the matching files under:

`src/content/ui/`

Existing UI keys MUST remain intact. Duplicate keys MUST NOT be created.

After content installation run:

```bash
pnpm content:sync-digests
pnpm content:validate
```

The packaged EN/RU `sourceDigest` values are intentionally treated as pre-install values. `content:sync-digests` owns the final digest after the Serbian source is installed.

## Schema status

No content-schema change is required.

The current hub schema already supports:

- hero CTAs with anchor targets;
- overview with 1–4 titled items;
- three child route cards;
- keyed editorial sections with body/items/CTA;
- four vehicle recommendations;
- six FAQ items;
- final CTA.

Do not broaden the schema for this page.

## Locked asset contract

The supplied photography is stored under:

`src/assets/shared/other/`

Use these normalized production names:

```text
s-class-driving-forest.webp
  source upload: s-class-driving-forest-intheback.webp
  role: Special Events full-bleed Hero

e-class-outside-wedding-day.webp
  source upload: e-class-outside-weeding-day.webp
  role: Wedding service destination card

v-class-interior.webp
  source upload: v-class-interior.webp
  role: temporary Prom service destination card

s-class-interior-driver-side.webp
  source upload: s-class-interior-driver-side.webp
  role: VIP service destination card

v-class-outside-wedding-day.webp
  source upload: v-class-outisde-weeding-day.webp
  role: event coordination / guest-transport editorial media

s-class-wedding-flower-detail.webp
  source upload: s-class-with-flowers-special-occasion.webp
  role: reserved for Wedding child page; do not use on this hub

wedding-couple-vehicle.webp
  source upload: weeding-day-kissing.webp
  role: reserved for Wedding child page; do not use on this hub
```

The Prom use of `v-class-interior.webp` is the only approved temporary image substitution. When a dedicated Prom/event-arrival asset is supplied, replace that one asset mapping only. Do not change page topology, copy, or service-card behavior.

## Locked page order

```text
Header
Hero
Proposition
Event Services
Other Occasions
Service Scope
Event Coordination Story
Fleet by Event Role
Event Standards
How Booking Works
FAQ
Final CTA
Footer
```

Read `blueprint.md`, `wireframe.md`, `implementation.md`, and `acceptance.md` before editing production code.
