# Scale Envelope (FND-SCALE-02)

This document records the operating scale for which the current Luxury Transportation architecture is intentionally optimized.

The goal is not to prevent future growth. It identifies the point at which the architecture should be reconsidered deliberately instead of being stretched invisibly.

## Current envelope

The foundation/configuration contract is designed for:

- **≤ 30 routes per locale** (validated by `routes:validate`, FND-SCALE-01).
- **2–6 locales** (foundation config schema).
- **roughly tens of editorial pages per locale**, stored in repository Markdown.
- **static Astro output** built as a complete site.
- **one production Luxury Transportation site**, with shared foundation packages as infrastructure rather than separate deployable sites.
- typed in-repo operational data rather than a live CMS/database.

The current production configuration uses **3 locales** (`sr`, `en`, `ru`) and is well inside the route ceiling.

## Why whole-build validation remains appropriate

Routing, hreflang/parity, content lifecycle, and typed cross-references depend on seeing the complete route/content set.

Within the current envelope:

- in-memory route maps are simple and deterministic;
- locale parity/hreflang checks can compare the whole set cheaply;
- source-digest translation checks can run over all localized content;
- generated type/theme outputs can be drift-checked reproducibly;
- static output keeps runtime complexity and attack surface low.

This favors correctness and reviewability over introducing a database/index before the content volume requires one.

## Architectural assumptions

### Static-first

The public site is a static marketing/service site. Server state is not part of page rendering.

Forms may submit to a deliberately chosen serverless/external endpoint, but that does not convert the entire site into an SSR application.

### Repository-owned content

Editorial content and typed operational data are version-controlled. A CMS is not currently part of the authority chain.

### Bounded localization

The design assumes a small set of fully supported locales with explicit route slugs and validation. Adding dozens of locales changes editorial, build, and QA economics and should be treated as an architecture decision.

### No user account state

Authentication, dashboards, user-specific content, and persistent application state are outside the current public-site architecture.

## Features that require deliberate review

| Change | Why it changes the envelope |
|---|---|
| >30 routes per locale | Validator/config limit and larger whole-build cross-locale set. |
| >6 locales | Exceeds configured locale schema and multiplies editorial/QA workload. |
| CMS/live database | Introduces external content truth, cache/index lifecycle, and runtime failure modes. |
| SSR/server rendering | Changes deployment/runtime/security/performance assumptions. |
| User accounts/auth | Introduces private state, security boundaries, and application workflows. |
| Large route-level pagination/catalog | Adds a second scale axis to route/parity/SEO handling. |
| Site-wide search | May justify a generated or external index once content volume makes navigation insufficient. |
| Multiple deployable brands/sites | Requires an explicit multi-site product/configuration model rather than hidden shared defaults. |

## Visual QA at this scale

Exhaustive snapshot/VRT enumeration is not a default requirement for the current site.

The active workflow favors:

1. locked blueprints/component contracts;
2. deterministic design detectors and theme/token governance;
3. representative mobile/tablet/desktop inspection;
4. accessibility/E2E checks;
5. bounded visual review: one batched inspection, one correction batch, at most one confirmation pass.

A future VRT system can be introduced when the number of independently evolving surfaces makes its maintenance cost worthwhile. It should be a current engineering decision, not restored from the retired template-era VRT document.

## When to step outside the envelope

Revisit the architecture when several of the following become true:

- route count approaches/exceeds the configured ceiling;
- editorial build/validation time becomes materially expensive;
- content must update independently of code deploys;
- runtime personalization/authentication becomes required;
- the business needs many deployable sites or tenants;
- a search/index becomes necessary for normal navigation;
- the static deployment model no longer supports required functionality.

At that point, document the new architecture and update validators/configuration intentionally. Do not silently disable limits or introduce hidden fallbacks simply to keep old assumptions passing.
