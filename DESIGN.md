# DESIGN.md

> **Role:** Mandatory design entrypoint for humans and agents.
>
> This file does **not** duplicate the design-token source of truth. It defines the
> project's visual contract, design-source hierarchy, implementation workflow, and
> review expectations. Raw token values and detailed component rules remain in their
> dedicated versioned foundation files.

---

# 1. Design intent

Luxury Transportation should feel:

- premium without cliché;
- professional;
- sharp;
- calm;
- contemporary;
- editorial;
- discreet;
- operationally confident.

The site should not look like:

- a generic limousine template;
- black/gold "luxury" cliché;
- a SaaS dashboard;
- a startup landing page;
- a card-grid component showcase;
- a silver/blue corporate site;
- an AI-generated collection of fashionable effects.

The desired character comes from:

```text
strong hierarchy
+
editorial typography
+
warm dark surfaces
+
restrained cream/gold contrast
+
high-quality contextual imagery
+
controlled whitespace
+
clear operational information
+
minimal visual noise
```

---

# 2. Actual design sources of truth

Do not copy values out of this file into components.

Use the project foundation sources.

## Human-readable

```text
design-system.v1.md
design-decisions.md
components-rules.v1.md
product-foundation.md
```

Use the repository's actual paths if these are stored under `docs/` or another foundation directory.

## Machine-readable design sources

```text
design-system.v1.json
palette.v1.json
typography.v1.json
spacing.v1.json
radii.v1.json
motion.v1.json
layout.v1.json
```

Design tokens are versioned and mapped into Tailwind semantic tokens.

Components consume semantic tokens.

---

# 3. Design precedence

For a page:

```text
LOCKED PAGE BLUEPRINT
        ↓
LOCKED DESIGN DECISIONS
        ↓
APPROVED COMPONENT RULES
        ↓
DESIGN SYSTEM / TOKENS
        ↓
WIREFRAME STRUCTURAL INTENT
        ↓
APPROVED PRODUCTION PATTERNS
        ↓
EXTERNAL REFERENCES
```

A page blueprint may explicitly authorize a local exception.

Do not generalize blueprint exceptions to other pages.

---

# 4. What the wireframe means

Wireframes define:

- section order;
- hierarchy;
- grouping;
- relative prominence;
- approximate composition;
- grid topology;
- content/image relationships;
- responsive stacking intent;
- presence of controls/actions.

Wireframes do **not** define:

- production font;
- production palette;
- uppercase helper labels;
- grayscale surfaces;
- skeleton blocks;
- dashed image boxes;
- placeholder borders;
- exact placeholder text widths;
- final shadow;
- final card boundary;
- final image boundary.

Always perform:

```text
WIREFRAME
   ↓
STRUCTURAL EXTRACTION
   ↓
VISUAL DECONTAMINATION
   ↓
DESIGN-SYSTEM MAPPING
   ↓
PRODUCTION UI
```

Never ship a polished wireframe.

---

# 5. Locked visual direction

## Dark-first, not dark-only

Default visual balance is approximately:

```text
70–80% dark
20–30% light
```

This is a direction, not a mechanical quota.

Light surfaces are semantic tools for:

- forms;
- pricing;
- calculator;
- FAQ;
- reading-heavy content;
- blueprint-approved feature moments.

Do not alternate light/dark mechanically.

## Palette

Use semantic tokens from the active design system.

General character:

```text
warm charcoal
warm cream
muted gold
```

Avoid silver/blue direction.

Gold is scarce.

## Typography

Preferred production pair:

```text
Fraunces
Manrope
```

The alternate type preset is for explicit comparison/review, not casual substitution.

Correct font loading must be verified in the browser.

"Serif-looking" is not enough.

## Radius

General hierarchy:

```text
section / feature  → 16px
card / media       → 12px
control            → 8px
```

Avoid oversized SaaS rounding.

## Surfaces

Prefer:

```text
surface contrast
+
spacing
```

over:

```text
border
+
shadow
```

Cards should not look like application dashboard cards.

---

# 6. High-value design principles

## Hierarchy before decoration

Use:

1. typography;
2. scale;
3. spacing;
4. composition;
5. imagery;
6. surface contrast.

Use decoration only after hierarchy works.

## Content-density proportionality

Premium does not mean empty.

A section's visual height must match:

- its purpose;
- content;
- image role;
- blueprint spacing tier.

The footer should remain compact.

The Final CTA should not become Hero #2.

## Controlled asymmetry

Asymmetry is blueprint-approved, not random.

Do not invent overlapping compositions to make a page feel "designed."

## No automatic zig-zag

Do not alternate:

```text
text | image
image | text
text | image
```

for decoration.

Direction follows blueprint/content logic.

## No cardification

Do not turn every group of information into a rounded card.

Use:

- open sections;
- dividers;
- typography;
- layout;
- imagery;
- surface changes;

where they communicate structure better.

---

# 7. Component identity

Different components must remain visually distinguishable by role.

## Hero

Dominant cinematic entrance.

## Open Split

Editorial/explanatory content.

## Trust

Compact confidence checkpoint.

## Fleet

Image-led product/vehicle showcase.

## Functional UI

Clear operational interaction without dashboard aesthetics.

## FAQ

Reading-focused information, usually divider-based.

## Final CTA

Medium-height conversion closer.

**Final CTA must not become a second Hero.**

---

# 8. CTA hierarchy

CTA roles are structural.

Typical hierarchy:

```text
Primary      → booking / main conversion
Secondary    → Request a Quote
Section      → View Full Fleet / Explore Service
Contextual   → related service
Tertiary     → phone / email / WhatsApp
Quiet        → low-emphasis contextual link
```

Do not change CTA role/destination to make a layout easier.

Do not turn every action into a gold button.

---

# 9. Imagery roles

Do not treat all vehicle imagery the same.

## Hero

Contextual cinematic image with negative space.

## Service showcase

Full-card contextual photography where blueprint requires.

## Split section

Contextual photo that materially supports the content.

## Fleet

Transparent vehicle cutout / standardized vehicle presentation.

## Final CTA

Vehicle blended into the panel, not necessarily a separate image card.

Missing asset does not authorize redesign.

Use a neutral placeholder until the correct asset exists.

---

# 10. Typography acceptance

A design implementation is not approved until the actual fonts are verified.

At minimum inspect browser-computed styles for:

```text
H1
H2
body
navigation
button
form control where relevant
```

Expected default families:

```text
Fraunces
Manrope
```

Do not tune layout around a fallback font.

Fix loading first.

---

# 11. Responsive acceptance

Every major page must be reviewed at:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop sanity check
```

Tablet is a real review state.

Do not assume:

```text
lg breakpoint
=
desktop layout approved
```

Use container queries when component behavior depends on available parent width.

---

# 12. Global component stability

Once approved, these should behave as shared infrastructure:

```text
Header
Footer
Button
Breadcrumbs
FAQ
FinalCTA
layout primitives
carousel mechanics
form controls
```

Page agents reuse them.

A page-specific task does not grant permission to redesign global components.

---

# 13. Known rejected-design lessons

The previous failed homepage implementation is **not** an approved design reference.

Known failure patterns to prevent:

- wrong/fallback typography;
- H1 too large and structurally unbalanced;
- required Hero right-side supporting region omitted;
- secondary Quote CTA replaced with unrelated action;
- public brand name translated instead of preserved;
- Serbian Cyrillic mixed into Latin-only locale;
- Final CTA converted into a second image-background Hero;
- Final CTA tertiary contact methods omitted;
- hero imagery reused for Final CTA;
- footer made disproportionately tall/empty.

These are not stylistic preferences.

They are evidence of missing blueprint/design-system compliance.

---

# 14. Design implementation workflow

For a new page:

```text
1. Read AGENTS.md
2. Read this file
3. Read page blueprint
4. Read page wireframe
5. Read relevant design skills
6. Inspect approved primitives/components
7. Build blueprint compliance matrix
8. Implement one section/component at a time
9. Render
10. Screenshot
11. Compare
12. Fix
13. Lock approved component
14. Assemble page
15. Review page-level rhythm
16. Independent design review
17. Technical page review
```

Do not ask one agent to invent and implement the entire page in one unverified pass.

---

# 15. Rebuild vs refactor rejected UI

When an existing component is fundamentally inconsistent with the blueprint:

Prefer:

```text
fresh visual implementation
```

while preserving proven:

- data integration;
- routing;
- props worth retaining;
- technical behavior.

Do not incrementally polish a rejected structural interpretation until it becomes harder to understand.

---

# 16. Change-management rules

## If a palette/token changes

Update the versioned design token source.

Do not patch individual components.

## If a global design decision changes

Update:

```text
design-decisions.md
```

and affected source documents.

## If a reusable component rule changes

Update:

```text
components-rules.v1.md
```

or its next version.

## If page structure changes

Update:

```text
page blueprint
↓
wireframe
↓
implementation
```

in that order.

## If this high-level design philosophy changes

Update this `DESIGN.md`.

Do not use `DESIGN.md` as a dumping ground for raw token values.

---

# 17. Design anti-patterns

Do not default to:

- glassmorphism;
- glowing CTAs;
- purple/blue gradients;
- decorative gradient blobs;
- gradient text;
- excessive pills;
- giant rounded rectangles;
- strong box shadows;
- routine card lift;
- routine image zoom;
- fake metrics;
- repeated icon-feature cards;
- uppercase eyebrow labels everywhere;
- centered-everything;
- giant whitespace with little content;
- identical Hero-like treatment for multiple sections;
- functional UI that resembles an admin dashboard.

---

# 18. Design quality question

Before approval ask:

> Does this page look like the intentional Luxury Transportation system described by
> the blueprint and foundation, or does it merely look like a generally attractive
> AI-generated luxury website?

If the answer is the latter, it is not finished.

---

# 19. Mandatory design skills

The detailed procedures live in:

```text
.skills/design-foundation-governance.md
.skills/blueprint-to-ui.md
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/typography-system.md
.skills/imagery-art-direction.md
.skills/functional-ui.md
.skills/responsive-layout.md
.skills/design-review.md
```

Use `AGENTS.md` to determine which skills apply to a given task.
