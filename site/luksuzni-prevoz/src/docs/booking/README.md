# Luxury Transportation — Booking Page Variant A

Status: **LOCKED IMPLEMENTATION PACKAGE — PUBLIC VALIDATION-ONLY V1**  
Direction: **Variant A — Service-First Concierge / Platinum Concierge Split**  
Target repository: `lukapekic/luksuzniprevoz-website-astro`  
Target site: `site/luksuzni-prevoz/`  
Target route key: `booking`  
Theme: **existing configured active Theme V2 — Black & Platinum**

This package defines a first-class multi-step booking/request page for Luxury Transportation.

It is designed from the current repository contracts:

- root `AGENTS.md`;
- root `DESIGN.md`;
- `site/luksuzni-prevoz/foundation.config.ts`;
- active Theme V2 token sources;
- `.design/system.json`;
- `.skills/functional-ui.md`;
- `.skills/design-foundation-governance.md`;
- `.skills/responsive-layout.md`;
- `.skills/accessibility-wcag.md`;
- `src/data/services.ts`;
- `src/data/pricing.ts`;
- `src/data/fleet.ts`;
- `src/data/contact.ts`;
- `src/data/operations.ts`;
- `src/data/flows.ts`;
- `src/data/routes.ts`;
- `src/docs/pricing.csv`;
- current service blueprints and the existing Airport booking-start form.

## Locked product decision

Variant A is the production direction.

The page uses one shared four-step wizard shell:

```text
01 Service
02 Journey
03 Vehicle
04 Review & contact
```

The shell branches by canonical service capability and pricing mode. It does not force every service through one pricing formula.

## Commercial result states

The UI has exactly five typed commercial states:

```text
fixed
calculated
estimate
quote-required
unavailable
```

`pending-confirmation` is a future submission lifecycle state, not a price state.

No component decides prices from prose, route names, or presentation logic.

## Package contents

```text
README.md
MANIFEST.md
blueprint.md
implementation.md
acceptance.md
data-contract.md
theme-contract.md
wireframe.html

proposed-code/
  booking.ts
  booking-pricing.ts
  booking-validation.ts
  routing-flow-changes.md
  content-schema-change.md
```

## Required implementation order

```text
1. Data/pricing contract
2. Route + flow contract
3. Content schema + localized entries
4. Booking controller/state machine
5. Pricing resolver
6. Page components
7. Validation-only final state + direct-contact recovery
8. Atomic booking/quote CTA migration
9. Accessibility/responsive hardening
10. Public noindex release verification
```

Secure same-origin Cloudflare submission, Turnstile, server validation, and
request-delivery states are explicitly deferred to a separate follow-up phase.
The current page is published for testing with no network submission.

Localized page content now lives in `src/content/pages/booking/`; Booking UI
strings are merged into the canonical `src/content/ui/` dictionaries. This
package is not a runtime content source.

Files under `proposed-code/` are historical drafting aids only. The updated
`implementation.md`, current repository contracts, and production source win;
do not copy proposed code without reconciling it to the locked plan.

Do not start by copying `wireframe.html` into production.

The wireframe defines the approved visual/topological direction only. Production must use repository primitives and active semantic tokens.
