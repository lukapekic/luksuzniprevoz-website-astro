---
name: high-value-visual-execution
description: >
  Encodes the Luxury Transportation visual taste and production-design judgment.
  Use for visual implementation, visual refinement, screenshot-driven iteration,
  or whenever a page risks becoming generic, card-heavy, SaaS-like, overly empty,
  or visually repetitive.
---

# Luxury Transportation — High-Value Visual Execution

## 0. Mission

A correct page can still look cheap.

This skill governs the difference between:

```text
technically compliant
```

and:

```text
high-value, intentional, premium production design
```

The visual goal is restraint, hierarchy, calm confidence, and editorial clarity.

## 1. Hierarchy before decoration

Solve hierarchy using:

1. scale;
2. typography;
3. spacing;
4. image composition;
5. surface contrast;
6. alignment;
7. density.

Decoration comes last.

Do not solve weak hierarchy with:
- decorative metallic accent;
- shadow;
- glow;
- border;
- gradient;
- animation.

## 2. Not everything should be equally important

Every section must have:

- primary element;
- supporting elements;
- tertiary details.

If every card/button/heading has equal visual weight, redesign within blueprint constraints.

## 3. Premium ≠ huge

Do not assume:
- larger H1 = more premium;
- more whitespace = more premium;
- larger image = more premium;
- larger radius = more premium.

Proportion must support the blueprint role.

## 4. Content-density proportionality

Section height should correspond to:

- content amount;
- conversion importance;
- image role;
- blueprint spacing tier.

Examples:

### Footer
Compact ending, not giant empty zone.

### Trust
Compact checkpoint.

### Final CTA
Medium-height closer, not full second hero.

### Hero
Dominant opening moment.

## 5. Component identity preservation

Maintain different visual roles.

Do not make:

```text
Hero
Private Aviation
Final CTA
```

all look like:

```text
full background image + oversized decorative heading + metallic-accent button
```

The site needs visual rhythm through different composition identities.

## 6. Photography controls the page

Use image scale intentionally.

A cinematic image can carry visual weight so UI chrome does not need to.

Avoid compensating for weak imagery with:
- cards;
- gradients;
- decorative shapes.

## 7. Controlled whitespace

Whitespace should create:

- grouping;
- rhythm;
- hierarchy;
- breathing room.

Avoid unexplained voids.

If a section feels empty, determine whether:
- content is missing;
- type is too small;
- max-width too narrow;
- section padding wrong;
- role incorrectly sized.

Do not simply add filler.

## 8. Avoid cardification

Before adding a card ask:

> Is containment semantically useful?

If not, use:
- open layout;
- divider;
- grid;
- image;
- spacing.

Common anti-pattern:

```text
heading
↓
4 floating cards
↓
heading
↓
3 floating cards
↓
heading
↓
3 floating cards
```

Avoid.

## 9. Avoid mechanical zig-zag

Open SplitSection can be:

```text
Content | Image
Image | Content
```

Do not alternate automatically for decoration.

Direction must come from blueprint/content logic.

## 10. Asymmetry

Asymmetry is allowed only where blueprint-approved.

Use it as a signature composition, not page-wide randomness.

Homepage ServiceShowcase is an explicit asymmetry exception.

Do not invent overlapping asymmetry elsewhere to make the page "designer."

## 11. Light-surface restraint

Light panels should feel integrated with the dark system.

Use:
- light-neutral semantic surface;
- dark text;
- restrained platinum detail;
- same typography;
- same radius language.

Do not turn light sections into generic SaaS white dashboards.

## 12. Platinum restraint

If platinum/metallic accent appears in:

- every icon;
- every line;
- every heading;
- every border;
- every button;

the page has failed.

Platinum should feel intentional because it is restrained.

## 13. Hero quality

Hero must establish:
- brand;
- service;
- visual tone;
- conversion.

Check:
- H1 not overpowering image;
- focal car recognizable;
- negative space intentional;
- right-side/supporting region present if required;
- CTAs match blueprint;
- no clutter.

## 14. Final CTA quality

Final CTA must not repeat hero.

Check:
- medium height;
- content remains dominant;
- vehicle occupies intended right-side footprint;
- image blended, not carded;
- booking + quote hierarchy;
- tertiary contact methods preserved;
- no hero-scale headline.

## 15. Service cards

Homepage full-image service mosaic:
- image is primary;
- title/CTA compact;
- no badge;
- no hover lift;
- no excessive scrim.

Generic ServiceCard:
- follow its own approved structure.

Do not conflate them.

## 16. Trust

Trust should feel calm and credible.

Avoid:
- giant statistics;
- counters;
- separate floating cards;
- glowing icons;
- fake badges.

One contained strip with internal structure is preferred when blueprint says so.

## 17. Fleet

Vehicle image should dominate.

Avoid:
- overloading spec badges;
- pricing duplication;
- tiny vehicle image inside a large metadata card.

Use factual restraint.

## 18. Operational sections

Airport/service information should not look like feature-card marketing.

Prefer:
- clean divided rows;
- 5/7 explanatory composition;
- concise factual hierarchy.

## 19. Visual repetition audit

After implementing page, list each major section's composition:

```text
Hero          blueprint-defined full-bleed/contained cinematic entrance
Services      open mosaic
Split         open 5/7
Trust         contained strip
Fleet         open horizontal
How It Works  contained light
Reviews       open cards
Final CTA     contained blended vehicle
```

If too many adjacent sections share the same pattern, investigate whether implementation collapsed distinctions.

Do not change locked blueprint merely for variety; fix accidental similarity.

## 20. Anti-pattern list

Reject default use of:

- glassmorphism;
- purple/blue gradients;
- decorative gradient blobs;
- gradient text;
- giant pill UI;
- huge soft radii;
- glowing metallic edges;
- constant card shadows;
- card lift;
- image zoom;
- fake metrics;
- unnecessary icon rows;
- oversized eyebrow labels;
- centered-everything;
- dashboard form treatment;
- huge empty footer;
- hero treatment repeated for Final CTA.

## 21. Screenshot-driven refinement

Use:

```text
render
→ screenshot
→ compare
→ identify one concrete discrepancy
→ patch
→ screenshot again
```

Do not make random batches of visual tweaks.

## 22. Failed-design lessons

Known failure patterns to explicitly guard against:

- correct Black & Platinum palette but wrong overall structure;
- wrong/fallback heading font instead of verified Inter Tight;
- H1 too large and wrapping into 3+ dominant lines;
- required hero supporting region omitted;
- secondary CTA replaced with unrelated action;
- Final CTA converted into second image-background hero;
- Final CTA contact methods omitted;
- public brand name translated;
- Serbian Cyrillic accidentally mixed into Latin locale;
- footer expanded into large empty zone;
- repeated hero imagery reused later.

These are review blockers, not minor polish issues.

## 23. Final quality questions

Ask:

1. Does this look like this project's system, not generic AI luxury?
2. Is the strongest thing on screen the correct thing?
3. Is the page calm or merely empty?
4. Are there too many boxes?
5. Are section identities distinct?
6. Is imagery carrying enough visual weight?
7. Is typography actually the brand typography?
8. Is platinum restrained?
9. Does Final CTA feel different from Hero?
10. Does whitespace correspond to content?
11. Did implementation preserve the blueprint rather than simplify it?

If several answers are weak, page is not ready.

## 24. Completion report

```text
PRIMARY HIERARCHY:
SECTION RHYTHM:
CARDIFICATION RISK:
PLATINUM USE:
IMAGE ROLE:
HERO VS FINAL CTA:
WHITESPACE:
GENERIC-AI PATTERNS FOUND:
VISUAL CHANGES MADE:
```
