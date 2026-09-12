# Booking Page — Theme Contract

Status: **LOCKED**

## Decision

Do **not** create Theme V3.

The Booking page uses the site's configured active Theme V2 and consumes only semantic tokens produced by the repository theme system.

Current visual identity:

```text
Black & Platinum
dark-first page canvas
light functional form surface
Inter Tight headings
Manrope body/UI
Cormorant Garamond only for BrandLockup
```

## Surface map

```text
Global page canvas       -> background
Wizard header/progress   -> open dark canvas
Primary work surface     -> surfaceLight
Controls                 -> inputSurface
Desktop summary          -> open dark canvas / surface only where semantically needed
Selected/high-value      -> restrained accent
Errors                    -> semantic error token
Success                   -> semantic success token
Focus                     -> focusDark / focusLight according to surface
```

The light work surface is intentional. `DESIGN.md` explicitly authorizes light surfaces for forms, calculators, pricing and other function-heavy blocks.

## Typography

```text
H1 / H2 / step heading   -> font-heading
labels / inputs / UI     -> font-body
fare / summary values    -> font-body or font-heading by hierarchy, never brand font
brand                    -> existing BrandLockup only
```

## Geometry

Use semantic radius roles:

```text
major wizard surface     -> radius-section
vehicle/selectable rows  -> radius-card only where a real bounded item exists
controls                  -> radius-control
```

Do not turn individual field groups into cards.

## Desktop composition

At the active `lg` threshold:

```text
7 / 5
form work surface / request summary
```

This is an approved Theme V2 desktop composition.

Below `lg`, the page uses one-column source order:

```text
progress
step heading
work surface
request summary
navigation actions
```

On Steps 01–03, the persistent summary sits between work and navigation
actions. On Step 04, the complete review is inside the work surface and the
duplicate persistent summary is hidden.

During the validation-only public phase, the intended final action is disabled
and a direct-contact recovery action remains active. This state must read as a
temporary operational limitation, not as a disabled decorative CTA.

## Prohibited styling

```text
gold accent
glow
metallic gradients
blue corporate palette
glassmorphism
pill-heavy progress UI
dashboard cards
large floating shadows
oversized SaaS radius
decorative icon wall
motion required to understand state
```

## Motion

Only use active motion tokens for:

- restrained step-content transition;
- selected-row state change;
- validation/status appearance.

Reduced motion must collapse these transitions to immediate state changes.
