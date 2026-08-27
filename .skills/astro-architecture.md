---
name: astro-architecture
description: Use for Astro architecture, component/data boundaries, dependencies, TypeScript configuration, generated artifacts, islands, or cross-package refactors in this static-first pnpm workspace.
source-of-truth: AGENTS.md
---

# Astro Architecture

## Authority

`AGENTS.md` owns architecture, package-manager, generated-file, data, routing, security, and scale rules. Inspect actual package exports and site-local component contracts before using an API; skills do not certify that a symbol exists.

## Architecture contract

- Use `pnpm` only.
- Preserve static Astro output unless an explicit architecture decision authorizes runtime rendering.
- Keep product configuration in the target site's `foundation.config.ts`; shared foundation packages own reusable mechanisms, not product choices.
- Keep page routes thin, components presentational/compositional, data modules factual, content localized, and theme values versioned.
- Reuse verified routing, SEO, schema, content, image, validation, and theme helpers.
- Treat generated theme CSS and generated types as machine-owned; use check-only commands during verification.
- Use client islands only for genuine browser behavior and include the required justification.
- Add dependencies only when the platform or existing foundation cannot meet the need cleanly.
- Do not move business facts, copy, localized URLs, or token values into presentation components.
- Do not suppress TypeScript, lint, or validation failures.

## Shared and public APIs

Before changing a shared component, package export, or public type, enumerate consumers and decide compatibility. Use `pnpm components:check` for approved UI components. A breaking change requires a migration note and verification of every affected package/page.

## Generated artifacts

Change authoritative inputs, run the relevant generator, and commit its deterministic output. Verify with `pnpm theme:sync:check` and `pnpm types:generate:check`; never patch generated output manually.

## Exit

Use the `foundation` verification profile for cross-package/foundation changes and the relevant scoped profile for site UI. Stop if the request exceeds the scale envelope or requires weakening a non-waivable rule.
