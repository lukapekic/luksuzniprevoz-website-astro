---
name: design-review
description: >
  Independent senior design QA for Luxury Transportation. Use after implementation
  or major visual changes. Compares design foundation, locked blueprint, wireframe,
  rendered screenshots/browser output, component reuse, typography, responsive states,
  imagery, and CTA hierarchy. Reviewer critiques; it does not redesign without cause.
---

# Luxury Transportation — Design Review

## 0. Role

You are the independent design reviewer.

You are not the implementation agent.

Your job is to determine whether the implementation faithfully and professionally executes:

```text
foundation
+
component rules
+
page blueprint
+
wireframe structure
```

Do not redesign the page merely because another design is possible.

## 1. Required inputs

Review, when available:

- design-system.v1.md;
- design-decisions.md;
- components-rules.v1.md;
- token JSON;
- page blueprint;
- page wireframe;
- implementation screenshots;
- browser-rendered page;
- relevant source/components;
- computed browser styles for typography;
- responsive screenshots.

## 2. Review precedence

Use:

1. blueprint;
2. locked design decisions;
3. component rules;
4. design system;
5. wireframe structure;
6. approved production components;
7. subjective preference.

Never penalize an implementation for not matching grayscale wireframe colors/fonts.

Do penalize it for missing wireframe/blueprint structure.

## 3. Severity levels

### CRITICAL
Breaks locked structure, conversion, brand, accessibility-visible behavior, core responsive behavior, or component identity.

### SIGNIFICANT
Clearly weakens design-system fidelity, hierarchy, typography, image composition, spacing rhythm, or reuse.

### MINOR
Polish issue that does not undermine page identity.

## 4. Blueprint completeness review

Create a checklist of every required section and required region.

Example:

```text
Hero H1                         PASS
Hero support                    PASS
Hero primary CTA                PASS
Hero secondary CTA              FAIL
Hero right statement            FAIL
Hero background role            PASS
```

A visually attractive page with missing blueprint regions fails.

## 5. CTA review

For each CTA record:

```text
LOCATION
EXPECTED ROLE
EXPECTED DESTINATION/INTENT
IMPLEMENTED
RESULT
```

Fail:
- quote replaced with view fleet;
- quote replaced with contact;
- tertiary contact methods removed;
- multiple new primary CTAs introduced.

## 6. Brand integrity

Verify:

- public brand string;
- GS mark usage;
- parent-company attribution context;
- language switch;
- locale/script.

For Serbian:
- Latin script only.

Flag unexpected Cyrillic.

## 7. Typography — mechanical verification

Do not trust screenshot alone.

Inspect computed styles for:

```text
H1
H2
body
navigation
button
form control
```

Expected default:

```text
Fraunces
Manrope
```

Fail if fallback/system fonts are actually rendering.

Also review:
- type scale;
- H1 line count;
- tracking;
- line-height;
- section-heading consistency;
- body measure.

## 8. Hero review

Check:

- contained panel;
- correct image role;
- focal subject visible;
- negative space;
- required content zones;
- H1 size;
- H1 line count;
- CTA hierarchy;
- scrim;
- no unnecessary copy card if blueprint intends scrim;
- responsive crop.

## 9. Wireframe interpretation review

Look for literal wireframe artifacts:

- uppercase annotations rendered as content;
- gray helper structure copied;
- image placeholder boxes retained as hard production cards;
- wireframe CSS widths copied as arbitrary values;
- fallback fonts inherited;
- helper min-heights causing empty sections.

These are implementation failures.

## 10. Surface rhythm review

List major sections and classify:

```text
open dark
contained dark
contained elevated
contained light
image-backed
gradient CTA
footer
```

Compare against blueprint.

Fail mechanical zebra striping or accidental cardification.

## 11. Component identity review

Confirm:

- Hero looks like Hero;
- Final CTA does not look like Hero #2;
- Trust remains trust strip;
- Fleet remains image-led;
- functional calculator does not look like admin dashboard;
- FAQ is divider-based, not card stack where blueprint says so.

## 12. Component reuse review

Inspect whether implementation:

- reused global Header;
- reused Footer;
- reused Button;
- reused FAQ;
- reused FinalCTA;
- reused carousel mechanics;
- reused approved primitives.

Flag unjustified one-off duplicates.

## 13. Geometry review

Compare important proportions:

- main ~1280 container;
- reading width;
- hero ratio/height;
- 5/7;
- 7/5;
- service mosaic;
- Final CTA 60–65 / 35–40;
- carousel visible continuation;
- grid topology.

Do not demand pixel identity where blueprint gives discretion.

## 14. Spacing review

Check:

- section spacing tier;
- internal spacing proportionality;
- footer compactness;
- no giant unexplained voids;
- no section tokens misused as component gaps;
- adjacent same-surface panels remain distinct.

## 15. Radius review

Expected:

```text
16 section
12 card/media
8 control
```

Flag large SaaS rounding.

## 16. Gold-use review

Gold should remain scarce.

Record every major gold use.

If gold becomes a default icon/text/border color, fail design-system fidelity.

## 17. Cardification review

Count visually bounded panels/cards.

Ask:

- Is every card semantically justified?
- Are contained sections nesting unnecessary cards?
- Did the agent turn lists into feature cards?

Flag dashboard drift.

## 18. Image review

For each key image:

```text
ROLE
CORRECT ASSET TYPE
OBJECT FIT
FOCAL POINT
TEXT-SAFE REGION
SCRIM
MOBILE CROP
TABLET CROP
DESKTOP CROP
```

Fail:
- hero reused as Final CTA;
- vehicle cutout cropped with object-cover;
- wrong service context;
- focal vehicle obscured.

## 19. Responsive review

Require evidence for:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop
```

Check:
- content order;
- grid activation;
- CTA wrapping;
- text expansion;
- crop;
- overflow;
- touch targets;
- carousel;
- form controls.

Do not accept "responsive because Tailwind classes exist."

## 20. Functional UI review

Where applicable:

- Fixed / Estimated / Quote distinction;
- manual confirmation message;
- labels;
- errors;
- focus;
- mobile flow;
- dashboard appearance;
- shared data use.

## 21. Motion review

Check:
- no bounce/spring;
- no routine card/image scale;
- key reveals only;
- hero motion subtle;
- reduced-motion mode.

## 22. Generic AI pattern review

Flag:

- excessive gradient;
- glass;
- glowing button;
- fake badge;
- excessive pills;
- repeated feature cards;
- centered-everything;
- giant type without hierarchy;
- generic hero repeated later;
- random abstract decoration.

## 23. Review format

Return findings as:

```text
SEVERITY:
LOCATION:
EXPECTED:
OBSERVED:
WHY IT MATTERS:
SOURCE RULE:
FIX:
```

Be specific.

Bad:

```text
Typography feels off.
```

Good:

```text
SIGNIFICANT
Hero H1

EXPECTED:
Fraunces, semantic H1 token, approximately two desktop lines.

OBSERVED:
Computed font-family resolves to Georgia; H1 wraps to three dominant lines.

WHY:
Breaks locked typography and changes hero balance.

FIX:
Correct font loading first, then re-evaluate H1 token/max-width. Do not tune around fallback font.
```

## 24. No redesign rule

Do not suggest:

- new section order;
- different navigation;
- different surface rhythm;
- alternate Hero concept;

unless implementation cannot satisfy the locked blueprint or blueprint contains an actual contradiction.

Review execution first.

## 25. Final scorecard

End with:

```text
BLUEPRINT FIDELITY      /10
DESIGN SYSTEM           /10
TYPOGRAPHY              /10
COMPONENT ARCHITECTURE  /10
RESPONSIVE              /10
IMAGERY                 /10
VISUAL HIERARCHY        /10
FUNCTIONAL UI           /10 when applicable

BLOCKERS:
SIGNIFICANT ISSUES:
MINOR POLISH:

VERDICT:
PASS
PASS WITH FIXES
FAIL
```

A page with a critical blueprint omission cannot receive PASS.
