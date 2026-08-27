---
name: functional-ui
description: Use for forms, booking, pricing, calculators, validation, progressive disclosure, estimates, quote states, confirmation, and other interactive operational UI.
source-of-truth: AGENTS.md
---

# Functional UI

## Authority

Verified operational data and content own facts, availability, pricing, labels, and confirmation language. The blueprint owns required steps and CTA roles. Shared form/control contracts own behavior and appearance.

## State contract

Before implementation enumerate initial, focused, filled, invalid, submitting, success, failure, disabled, unavailable, estimate, quote-required, and pending-confirmation states that apply. Define keyboard behavior, focus movement, status announcement, data preservation, recovery, and no-JS behavior.

## Rules

- Use native controls and semantics first.
- Every control has a persistent programmatic label and localized help/error text.
- Associate errors with fields; provide a useful error summary for multi-field failures.
- Do not use placeholder text as the only label or instruction.
- Do not imply a booking, fare, vehicle, or availability is confirmed unless authoritative data says so.
- Carry values between steps through approved typed flows; do not hide facts in presentation components.
- Keep primary/secondary actions unambiguous and prevent accidental duplicate submission.
- Preserve 44×44 targets, visible focus, reduced motion, and logical keyboard order.
- Avoid client hydration when native form/navigation behavior meets the contract.

## Verification

Test every applicable state, keyboard-only flow, long localization, invalid input, back/refresh behavior, unavailable data, and handoff destination. Run the applicable `verify:ui` profile plus accessibility browser tests.
