---
name: design-harden
description: Production hardening for multilingual text, missing/conditional data, image failures, interaction states, keyboard behavior, and edge cases.
---

# Design Harden

Test the real production conditions the happy-path design can hide.

## Required cases

- Serbian, English, and Russian copy;
- long headings/buttons/navigation labels;
- text zoom / enlarged browser font;
- missing optional imagery;
- missing/withheld client logos;
- price unavailable / estimate / quote-required states;
- pending-confirmation booking semantics;
- empty/partial review or fleet data where allowed;
- keyboard-only navigation;
- focus states;
- reduced motion;
- network/client-island failure where applicable;
- narrow mobile and tablet portrait overflow.

## Rules

- Never solve overflow by shrinking text below the design system.
- Never fabricate fallback facts.
- Conditional UI should disappear or switch state cleanly when authoritative data is unavailable.
- Error and empty states use the same semantic token/component system.
- Preserve CTA priority in every state.
