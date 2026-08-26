# DESIGN.md

> **Role:** Mandatory visual/design authority for Luxury Transportation.
>
> This file defines visual intent, authority, design behavior, component identity, and review expectations.
> It does **not** duplicate raw token values. Raw values live in the active Theme V2 JSON.
>
> Technical/foundation authority lives in root `AGENTS.md`.

---

# 1. Design intent

Luxury Transportation should feel:

- premium without cliché;
- professional;
- sharp;
- calm;
- contemporary;
- discreet;
- operationally confident;
- visually restrained;
- image-led where imagery has a real role;
- information-rich without becoming dense.

The site should not look like:

- a generic limousine template;
- a black/gold luxury cliché;
- a newspaper/editorial fashion site;
- a SaaS dashboard;
- a startup landing page;
- a card-grid component showcase;
- a silver/blue corporate template;
- an AI-generated collection of fashionable effects.

The desired character comes from:

```text
strong hierarchy
+
modern typography
+
near-black graphite surfaces
+
restrained platinum contrast
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

# 2. Design sources of truth

## Human-readable authority

```text
DESIGN.md
locked page blueprint
approved shared component contracts
```

## Machine-readable token authority

The current site selects its active theme in:

```text
site/luksuzni-prevoz/foundation.config.ts
```

The active design-token source is:

```text
site/luksuzni-prevoz/src/theme/versions/version-2/
  manifest.json
  palette.json
  typography.json
  spacing.json
  radii.json
  motion.json
  layout.json
```

Generated output:

```text
site/luksuzni-prevoz/src/theme/generated/theme.css
```

is machine-owned and must not be manually edited.

Do not create parallel palette, typography, spacing, radius, or layout definitions in components, skills, page docs, or CSS patches.

---

# 3. Design precedence

For visible page work:

```text
LOCKED PAGE BLUEPRINT
        ↓
DESIGN.md
        ↓
ACTIVE THEME V2 JSON
        ↓
APPROVED SHARED COMPONENT CONTRACTS
        ↓
WIREFRAME STRUCTURAL INTENT
        ↓
MATCHING .skills PROCEDURE
        ↓
VERIFIED PRODUCTION PATTERNS
        ↓
EXTERNAL REFERENCES
```

A page blueprint may authorize a local structural exception.

A wireframe never overrides production tokens, typography, accessibility, routing, or component contracts.

If implementation and blueprint disagree, do not assume implementation is correct because it exists.

---

# 4. Current locked visual direction — Black & Platinum

Theme V2 is the current production direction.

Core character:

```text
near-black / graphite canvas
+
subtle dark surface hierarchy
+
platinum / silver accent
+
soft off-white primary text
+
restrained light-neutral functional surfaces
+
minimal borders
+
controlled cinematic photography
```

Avoid reintroducing:

- gold as the default luxury accent;
- warm-brown theme drift;
- cream/gold page identity;
- blue/silver corporate styling;
- decorative metallic gradients;
- chrome/gloss effects.

Platinum is a restrained accent and contrast tool, not a decorative fill used everywhere.

---

# 5. Typography

Current roles are locked:

```text
Headings     → Inter Tight
Body / UI    → Manrope
BrandLockup  → Cormorant Garamond Italic
```

## Heading character

Inter Tight should feel:

- serious;
- modern;
- controlled;
- professional;
- compact enough for strong hierarchy;
- not newspaper/editorial-serif.

Do not substitute Fraunces, Instrument Serif, or a generic serif for page headings.

## Body/UI

Manrope owns:

- body copy;
- navigation;
- buttons;
- form controls;
- labels;
- operational facts;
- metadata.

## BrandLockup

Cormorant Garamond Italic is a brand-specific exception.

It should not leak into general headings or body UI.

## Acceptance

A visual implementation is not approved until browser-computed fonts are verified for at least:

```text
H1
H2
body paragraph
navigation
button
form control where relevant
brand lockup where visible
```

Do not tune layout around a fallback font. Fix loading first.

---

# 6. Dark-first, not dark-only

The site is predominantly dark, but light surfaces are semantic tools.

Use light surfaces for:

- forms;
- calculators;
- pricing/function-heavy blocks;
- FAQ/reading-heavy content where approved;
- blueprint-approved contrast moments such as Homepage How It Works.

Do not alternate dark/light sections mechanically.

Surface choice follows purpose and page rhythm.

---

# 7. Hierarchy before decoration

Solve hierarchy in this order:

1. typography;
2. scale;
3. spacing;
4. composition;
5. imagery;
6. surface contrast;
7. subtle detail.

Decoration comes last.

Do not use:

- glow;
- metallic gradients;
- strong shadows;
- ornamental lines;
- excessive borders;
- oversized radius;
- animation;

to compensate for weak structure.

---

# 8. Spacing and density

Premium does not mean empty.

A section's visual height must match:

- purpose;
- content density;
- conversion importance;
- image role;
- blueprint spacing tier.

Use the active Theme V2 spacing tokens.

Avoid:

- giant empty sections;
- overly tall footers;
- second-Hero Final CTAs;
- compact content floating inside oversized containers.

---

# 9. Radius

Use Theme V2 semantic radius tokens.

Role hierarchy:

```text
section / major contained feature
card / media
control
```

Do not invent one-off radius values because a screenshot "looks softer."

Avoid oversized SaaS rounding.

---

# 10. Surfaces, borders, and shadows

Prefer:

```text
surface contrast
+
spacing
+
composition
```

over:

```text
border
+
shadow
```

Cards should not resemble dashboard cards.

Borders are quiet separators, not decorative outlines.

Shadows should be rare and restrained.

---

# 11. Platinum usage

Platinum is a functional accent.

Suitable uses include:

- primary/important action treatment where the component contract calls for it;
- focus treatment;
- subtle selected state;
- restrained rules/dividers/details;
- small high-value emphasis.

Do not use platinum for:

- every icon;
- every heading;
- body text;
- every border;
- large decorative fills;
- metallic gradient effects.

The design should still feel premium when most of the page is graphite + off-white without accent decoration.

---

# 12. Component identity

Different shared/page components must remain visually distinguishable by role.

## Header

Compact navigation infrastructure.

On blueprints that place Header over Hero, it integrates visually with the Hero at page top and transitions to the approved sticky surface behavior.

## Hero

Dominant cinematic entrance with a clear H1 and primary conversion actions.

A Hero may be full-bleed or contained only when the page blueprint explicitly says so.

## Service showcase

Image-led route/service discovery.

## Open split

Explanatory/editorial composition without enclosing everything in a card.

## Trust

Compact confidence checkpoint.

## Fleet

Vehicle-led product showcase.

## Functional UI

Clear operational interaction without dashboard aesthetics.

## FAQ

Reading-focused information, normally divider-led.

## Final CTA

Medium-height conversion closer.

**Final CTA must not become Hero #2.**

## Footer

Compact site ending, not a giant sitemap.

---

# 13. CTA hierarchy

CTA roles are structural:

```text
Primary      → booking / main conversion
Secondary    → Request a Quote
Section      → View Full Fleet / Explore Service
Contextual   → related service
Tertiary     → phone / email / WhatsApp
Quiet        → low-emphasis contextual link
```

Do not change CTA destination/role to make a composition easier.

Do not render every action with equal emphasis.

---

# 14. Imagery roles

Image treatment depends on role.

## Hero

Contextual cinematic image with intentional focal point and negative space for content.

## Service showcase

Contextual photography filling the card/region when blueprint requires.

## Split section

Contextual photo that materially supports the content.

## Fleet

Standardized vehicle presentation; transparent vehicle cutouts use containment rather than crop.

## Final CTA

Vehicle/image integrated into its allocated media region; no hard edge if the approved component calls for blending.

Missing assets do not authorize redesign.

Use a neutral placeholder until the correct asset exists.

---

# 15. Hero layering contract

Image-backed Heroes must have an explicit layer model.

Conceptually:

```text
media layer
scrim / overlay layer
content layer
header layer when blueprint integrates Header over Hero
```

The content layer must remain above image/scrim at every breakpoint.

When content exists in source but is visually missing, diagnose:

- stacking context;
- `position`;
- `z-index`;
- transforms;
- filters;
- isolation;
- parent overflow;
- scoped-style ownership;
- child-component class forwarding;

before rewriting content or redesigning the Hero.

Do not rely on a parent Astro scoped selector to style DOM rendered inside a child component unless scope propagation is explicitly supported by that component contract.

---

# 16. Controlled asymmetry

Asymmetry is blueprint-approved, not random.

Do not invent overlaps, offset cards, or alternating image/text patterns merely to make the page feel "designed."

No automatic zig-zag:

```text
text | image
image | text
text | image
```

Direction follows page/content logic.

---

# 17. No cardification

Do not turn every information group into a rounded card.

Prefer:

- open sections;
- typography;
- dividers;
- layout;
- imagery;
- intentional surface changes;

when those communicate hierarchy better.

---

# 18. Motion

Use Theme V2 motion tokens.

Motion should be:

- subtle;
- purposeful;
- low-amplitude;
- non-blocking.

Suitable patterns may include:

- restrained one-time content entrance;
- subtle image motion where blueprint allows;
- carousel transition;
- small button/image state changes.

Avoid:

- decorative loops;
- floating UI;
- dramatic parallax;
- glow pulses;
- routine card lift/zoom.

`prefers-reduced-motion` support is required.

---

# 19. Responsive acceptance

Every major page must be reviewed at:

```text
mobile
tablet portrait
tablet landscape
desktop
wide desktop sanity check
```

Mobile-first does not mean "desktop collapsed."

Each state must preserve:

- hierarchy;
- content order;
- readable measure;
- image focal point;
- accessible CTA targets;
- intentional carousel continuation;
- no accidental horizontal overflow.

Tablet is a real design state.

Use container queries when component behavior depends on available parent width rather than viewport width.

---

# 20. Tailwind v4 implementation relationship

Production styling uses Tailwind CSS v4 and project CSS-first conventions.

Visual decisions come from this file + Theme V2; Tailwind is the implementation mechanism.

Do not:

- create a v3 Tailwind config to express design decisions;
- copy raw Theme V2 values into arbitrary classes repeatedly;
- construct dynamic class fragments that Tailwind cannot detect;
- assume `:root` CSS variables automatically generate Tailwind utilities;
- solve scoped Astro styling problems with increasingly specific global selectors.

Read `.skills/tailwind-v4.md` for implementation details.

---

# 21. Global component stability

Once approved, shared infrastructure should be reused:

```text
Header
Footer
Button
Link
BrandLockup
LanguageSwitcher
Breadcrumbs
FAQ
FinalCTA
layout primitives
carousel mechanics
form controls
```

A page-specific task does not grant permission to redesign them.

When a shared component looks wrong on a page, investigate integration/data/stacking/container ownership first.

---

# 22. Known rejected-design lessons

The previous failed Homepage implementation is not an approved design reference.

Failure patterns to prevent include:

- wrong/fallback typography;
- serif newspaper-like heading drift;
- missing required Hero supporting region;
- wrong secondary CTA;
- translated/altered public brand lockup;
- locale script inconsistencies;
- Final CTA becoming a second Hero;
- tertiary contact methods disappearing without checking canonical contact gating;
- Hero imagery reused indiscriminately;
- footer becoming disproportionately tall;
- contained Homepage Hero when the current locked Homepage blueprint requires full bleed;
- Header appearing as a separate opaque strip above an integrated Hero.

These are implementation/compliance failures, not alternative styles.

---

# 23. Wireframe interpretation

Wireframes define:

- section order;
- hierarchy;
- grouping;
- relative prominence;
- approximate composition;
- grid topology;
- content/image relationships;
- responsive stacking intent;
- control/action presence.

Wireframes do not define final:

- fonts;
- palette;
- exact tokens;
- visible helper labels;
- grayscale placeholders;
- dashed image boxes;
- production border/shadow;
- exact spacing values;
- implementation/component ownership.

Workflow:

```text
WIREFRAME
   ↓
STRUCTURAL EXTRACTION
   ↓
VISUAL DECONTAMINATION
   ↓
THEME V2 MAPPING
   ↓
PRODUCTION UI
```

Never ship a polished wireframe as production code.

---

# 24. Implementation workflow

For a page:

```text
1. Read AGENTS.md.
2. Read DESIGN.md.
3. Read the locked page blueprint.
4. Read the wireframe for structure.
5. Read matching skills.
6. Inspect active Theme V2 tokens.
7. Inspect approved primitives/components/data.
8. Build a blueprint compliance matrix.
9. Diagnose current implementation.
10. Implement one bounded area at a time.
11. Render and manually review all responsive states.
12. Run independent design review.
13. Fix design blockers.
14. Run technical page review.
15. Run project check/build and relevant validators.
```

Do not give an implementation agent one large "fix everything" task when individual root causes can be established first.

---

# 25. Change management

## Raw token change

Update the active Theme V2 JSON.

Regenerate theme CSS through the repository generator.

Do not patch individual components.

## Global visual-direction change

Update `DESIGN.md` and, if needed, Theme V2 source JSON.

## Shared component contract change

Update the relevant component documentation/API and any affected page blueprint.

## Page structure change

Update:

```text
page blueprint
→ wireframe
→ implementation
```

## Procedural change

Update the matching `.skills/*.md`.

Skills should describe process and guardrails, not duplicate the current raw theme.

---

# 26. Design anti-patterns

Do not default to:

- glassmorphism;
- glowing CTAs;
- purple/blue gradients;
- metallic gradients;
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
- functional UI that resembles an admin dashboard;
- black/gold limousine-template styling.

---

# 27. Design quality question

Before approval ask:

> Does this page look like the intentional Black & Platinum Luxury Transportation system defined by the current blueprint and Theme V2, or does it merely look like a generally attractive AI-generated luxury website?

If the answer is the latter, it is not finished.
