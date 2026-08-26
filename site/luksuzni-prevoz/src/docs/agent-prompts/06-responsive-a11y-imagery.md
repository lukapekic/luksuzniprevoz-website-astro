# Luxury Transportation — Responsive, Accessibility & Imagery Pass

Status: **Shared execution prompt**

Use this prompt after a service section/page is structurally implemented. This is a bounded correctness/refinement pass—not a redesign pass.

Mandatory base files:

```text
00-service-agent-foundation.md
component-reuse-registry.md
```

Required specialist skills should follow `AGENTS.md`, especially the current repository files for:

```text
responsive-layout
responsive-ui
accessibility-wcag
imagery-art-direction
responsive-images-performance
typography-system
design-foundation-governance
```

---

## Invocation inputs

```text
TARGET_PAGE_OR_COMPONENT:
TARGET_BLUEPRINT:
TARGET_WIREFRAME:
ALLOWED_FILES_OR_DIRECTORY:
AVAILABLE_BROWSER_REVIEW: yes | no
AVAILABLE_REAL_IMAGES: <list or none>
OPTIONAL_KNOWN_ISSUES:
```

---

## 1. Mission

Verify and correct the implemented page/component across responsive states, accessibility requirements, typography behavior, and image art direction while preserving the approved blueprint and component identities.

Doctrine:

```text
Refinement preserves. Redesign replaces.
```

This prompt authorizes refinement/correction only.

---

## 2. Required responsive states

Review distinctly:

```text
mobile
  include narrow/mobile sanity around the repository's tested small width

tablet portrait

tablet landscape

desktop

wide desktop sanity
```

Do not treat tablet as “desktop but smaller.”

Do not validate only exact breakpoint edges.

Check content-driven intermediate widths where wrapping/overflow risk exists.

---

## 3. Structural responsive checks

Verify:

- no accidental horizontal page overflow;
- no clipped text or controls;
- no fixed heights that fail with longer localized content;
- no equal-height forcing that harms mobile reading;
- container ownership remains correct;
- Section vertical rhythm remains token-driven;
- columns stack in blueprint-approved reading order;
- touch targets remain usable when stacked;
- no sticky/absolute layer collision with header/hero;
- no image causes CLS/layout collapse;
- no mobile composition becomes a dense dashboard/card wall.

For `OpenSplitSection`, use its existing layout/ratio/mobile-order API rather than introducing bespoke breakpoints.

---

## 4. Page-specific responsive requirements

### Private Chauffeur

Verify:

- `ServiceHero responsive-split` is truly split only at the approved desktop state;
- tablet/mobile transform to the documented contained image-backed Hero;
- Hourly/Half Day/Full Day remain understandable without floating card behavior;
- Availability/Flexibility copy/media order is intentional and accessible;
- recommendation/standards sections remain readable without forced equal-height cards.

### Airport

Verify:

- contained Hero remains coherent across all states;
- AirportBookingBlock controls remain usable and do not become dashboard-dense;
- Arrival Handling copy/media order stays intentional;
- Private Aviation/FBO remains subordinate to the primary airport-service hierarchy;
- no unsupported price UI appears due to responsive fallback.

### Business

Verify:

- service selector remains image-led and usable on mobile/tablet;
- One-off vs Recurring remains clearly distinguishable when stacked;
- Coordination split order remains intentional;
- Trusted Clients gracefully handles variable approved count;
- logo/media sizing does not imply fake equal inventory.

---

## 5. Accessibility checks

Minimum target: WCAG 2.2 AA and repository-specific rules.

Verify:

```text
semantic landmarks/section labelling
one H1 per page
correct H2/H3 hierarchy
44×44 CSS px minimum interactive targets
visible focus-visible states
keyboard operability
native semantics before ARIA
meaningful control labels
no inaccessible whole-card click overlays
aria relationships for carousel controls where used
FAQ details/summary behavior preserved
reduced motion honored
color contrast on dark/light/image surfaces
```

Do not add redundant ARIA to native semantic elements.

Do not solve target-size problems by visually distorting unrelated typography.

---

## 6. Dark/light surface checks

This is a dark-first site with semantic light functional surfaces—not separate theme modes.

Check all relevant contexts:

```text
open dark background
contained/elevated dark surfaces
light functional surfaces
image + scrim overlays
```

Verify `SectionHeading`, FAQ rows, links, controls, muted text, focus rings, and dividers use the correct surface-aware treatment.

Do not create page-local light-mode tokens.

---

## 7. Typography verification

Verify browser-computed/implemented roles for:

```text
H1
H2
H3 where used
body copy
UI metadata
navigation/action text
form controls where used
```

Do not tune spacing around fallback fonts.

Long Serbian/English/Russian content must wrap naturally without layout breakage.

Do not reduce font size below the design system merely to make one translation fit.

---

## 8. Image role and alt decisions

For every image classify its role:

```text
hero/cinematic
contextual split
service discovery/card
vehicle recommendation
client/logo
functional/decorative
```

Then verify:

- the image materially supports the section;
- crop/focal point is correct at each responsive state;
- object-fit matches the role;
- scrim is sufficient for overlay readability without flattening the image;
- alt is informative only when the image conveys information not already adjacent;
- decorative marketing imagery uses empty alt/presentation behavior according to component contract;
- headings are not automatically copied into alt;
- missing assets use approved neutral placeholders instead of redesigning the section.

Do not use generic office stock imagery for Business if the blueprint calls for executive transport context.

---

## 9. Image performance

Follow the repository image pipeline.

Verify as applicable:

- imported assets use approved Astro image handling;
- Hero/LCP image delivery is appropriate;
- intrinsic dimensions/aspect ratios prevent layout shift;
- responsive image sizes are not unnecessarily huge;
- below-the-fold media does not receive inappropriate eager/high-priority behavior;
- no raw image implementation bypasses repository rules without justification.

Do not add image-processing dependencies during this pass.

---

## 10. Motion

Use existing semantic durations/easing only.

Verify `prefers-reduced-motion` behavior.

Do not add animation to make the page feel more “premium.”

No routine hover lift, autoplay, parallax, glow, or cinematic motion unless an existing reviewed contract already owns it.

---

## 11. Fix scope

Allowed fixes:

```text
responsive composition corrections
spacing/composition corrections using existing tokens
surface-aware contrast/focus corrections
alt/accessibility semantics
image crop/object-fit/sizes behavior
localized wrapping/overflow corrections
small implementation bugs
```

Not authorized:

```text
new visual direction
page-order changes
new component family
shared-component redesign
copy rewriting
business fact changes
new theme tokens unless a genuine system-level deficiency is separately approved
```

If a shared component is the root cause, report cross-page impact before changing it.

---

## 12. Verification commands

Run at minimum:

```bash
pnpm design:detect site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

When browser/test capability is available, run the relevant existing responsive/a11y tests rather than installing new tooling:

```bash
pnpm test:e2e
pnpm test:a11y
```

Use only the tests applicable to the current environment/scope; report failures honestly.

Do not claim manual browser viewport checks if `AVAILABLE_BROWSER_REVIEW` is `no`.

---

## 13. Required completion report

```text
RESPONSIVE STATES REVIEWED
- mobile: PASS/ISSUES/NOT REVIEWED
- tablet portrait: ...
- tablet landscape: ...
- desktop: ...
- wide desktop: ...

A11Y FINDINGS/FIXES
- ...

IMAGERY FINDINGS/FIXES
- ...

TYPOGRAPHY/SURFACE FINDINGS
- ...

FILES CHANGED
- ...

SHARED COMPONENTS MODIFIED
- None expected
or
- <component + proven reason + affected pages>

AUTOMATED VALIDATION
- <command>: PASS/FAIL/NOT RUN

MANUAL VISUAL REVIEW
- performed | not available

REMAINING BLOCKERS
- None
or
- ...
```
