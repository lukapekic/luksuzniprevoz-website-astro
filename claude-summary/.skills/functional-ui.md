---
name: functional-ui
description: >
  Governs functional UI for Luxury Transportation: pricing calculators, booking fields,
  form controls, progressive disclosure, fixed/estimated/quote states, status notes,
  validation, confirmation, and interaction design. Use whenever UI is more than
  static marketing content.
---

# Luxury Transportation — Functional UI

## 0. Mission

Functional UI must remain:

- premium;
- calm;
- clear;
- compact;
- operational;
- accessible.

It must not become:

- SaaS dashboard;
- dense admin form;
- card-grid configurator;
- over-designed widget collection.

## 1. Data before styling

Functional UI state is architecture.

Before styling a calculator/form, define:

- inputs;
- required inputs;
- optional inputs;
- state transitions;
- result states;
- validation states;
- submission state;
- manual-confirmation behavior.

Do not style a generic "result box" before state model exists.

## 2. Pricing result states

The project distinguishes:

```text
Fixed price
Estimated price
Request a Quote
```

These must not blur together.

Only expose Estimated if business pricing rules explicitly support it.

Recommended state model:

```text
idle
resolving/calculating if applicable
fixed
estimated
quote-required
invalid
unavailable/error
```

Exact implementation may differ.

## 3. Fixed price

Must communicate:

- status is Fixed;
- price value;
- what selection it applies to;
- next action;
- manual confirmation still required.

Do not imply booking is confirmed merely because price is fixed.

## 4. Estimated price

Must clearly say it is estimated.

Do not style Estimated so similarly to Fixed that users miss the distinction.

## 5. Quote-required

Must clearly switch user intent to:

```text
Request a Quote
```

Do not show misleading zero/blank price.

Explain briefly why the request requires review when useful.

## 6. Manual confirmation

Every request remains pending team confirmation.

This operational fact must have a clear but quiet presentation.

Use a reusable pattern such as:

```text
ContextNotice
StatusNote
```

Do not bury it in tiny fine print.

Do not present it as an alarming warning.

## 7. Calculator scope

Airport calculator initial interaction asks only what is needed for commercial result, such as:

- pickup;
- drop-off;
- one-way / return;
- date/time where relevant;
- vehicle.

Do not embed the entire customer booking form into the calculator.

## 8. Progressive disclosure

Show fields only when relevant.

Examples:
- return-specific fields only when return selected;
- multi-vehicle fields only for appropriate service;
- custom note required only for quote/custom flow.

Avoid overwhelming users with all possible fields.

## 9. Control family

Use shared controls.

Potential primitives:

```text
FormField
TextField
SelectField
DateTimeField
SegmentedControl
Checkbox
FieldHint
FieldError
ContextNotice
PriceResult
```

Do not invent a new control style per page.

## 10. Visual field system

Functional light-surface UI uses:

```text
surfaceLight
inputSurface
textOnLight
inputBorder
focusLight
```

or mapped semantic tokens.

Do not hardcode grays.

Controls use the active Theme V2 semantic control radius.

Do not duplicate its raw value in this skill or in page components.

## 11. Labels

Every control requires a real label.

Placeholder is not a label.

Use concise operational wording.

## 12. Equal wireframe boxes are not equal priority

Wireframe may show five equal rectangles to communicate fields.

Production may allocate more width to:

- pickup;
- drop-off;

than to:

- trip type;
- date;
- vehicle;

when usability benefits.

Preserve required controls, not placeholder equality.

## 13. Avoid dashboard appearance

Do not:

- put every field in a big card;
- add unnecessary icons to every label;
- use analytics-style segmented tabs;
- add large status badges everywhere;
- add unnecessary borders/shadows.

Prefer a coherent light functional panel with clear fields and restrained grouping.

## 14. Segmented controls

Use only for small mutually exclusive sets such as:

```text
One-way / Return
```

where they improve speed.

Do not use segmented controls for long option lists.

## 15. Vehicle selection

Use structured data.

Do not hardcode:
- fleet;
- capacity;
- pricing;
- recommendation.

Vehicle selector must accommodate provisional/updated fleet data.

## 16. Capacity warnings

If selected vehicle appears unsuitable:

- warn clearly;
- do not block submission automatically unless business rules require;
- allow team review.

Do not manufacture capacity facts not in verified data.

## 17. Validation

States:

```text
default
hover
focus-visible
error
disabled
selected
```

Error must include:

- visual indicator;
- text explanation.

Color alone is insufficient.

## 18. Focus

Functional UI must have stronger focus-visible treatment than hover.

Do not remove focus outline without replacement.

## 19. Result placement

On mobile, result should immediately follow required inputs.

Do not force user to scroll through unrelated content before seeing outcome.

## 20. Booking handoff

Valid calculator selection can carry:

- service;
- route;
- vehicle;
- trip type;
- date/time where appropriate;
- displayed price state/value;

into booking flow.

Do not ask users to re-enter information unnecessarily.

## 21. Shared data model

Calculator, Pricing page, and Booking flow use the same validated service/pricing source.

No page-level hardcoded prices.

## 22. Submission

After submit:

```text
Pending confirmation
```

Automatic acknowledgement must explain request was received.

Do not display "Confirmed" unless backend/team actually confirms.

## 23. Responsive layout

Desktop:
- compact structured layout;
- not necessarily equal-width controls.

Tablet:
- 1–2 columns based on available control width.

Mobile:
- single column;
- large touch targets;
- result directly after required inputs;
- no horizontal overflow.

## 24. Motion

Functional feedback should be immediate and restrained.

No spring/bounce state changes.

Reduced motion respected.

## 25. Rejection conditions

Reject:

- duplicated pricing source;
- hardcoded price in Astro component;
- Fixed/Estimated/Quote visually ambiguous;
- booking implied confirmed;
- all booking fields embedded into hero/calculator;
- placeholder used as label;
- dashboard card-grid styling;
- equal-width fields copied blindly from wireframe;
- inaccessible error/focus states;
- mobile horizontal scrolling;
- custom state not represented in architecture.

## 26. Completion report

```text
INPUT MODEL:
RESULT STATES:
CONFIRMATION MESSAGE:
VALIDATION:
DATA SOURCE:
BOOKING HANDOFF:
MOBILE:
ACCESSIBILITY:
```
