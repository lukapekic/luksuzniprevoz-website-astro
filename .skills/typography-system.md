---
name: typography-system
description: >
  Mandatory typography implementation and QA for Luxury Transportation. Use whenever
  implementing or reviewing headings, body text, navigation, buttons, forms, labels,
  tables, pricing, editorial statements, localization, or font loading.
---

# Luxury Transportation — Typography System

## 0. Mission

Typography is a primary part of the brand.

Using "a serif" is not enough.

The implementation must preserve:

- correct font families;
- correct loaded font files;
- semantic type hierarchy;
- controlled scale;
- editorial heading character;
- readable body measure;
- consistent weights;
- line-height;
- tracking;
- localization robustness.

## 1. Locked families

Default production direction:

```text
Headings / selected large statements:
Fraunces

Body / navigation / controls / forms / tables / pricing:
Manrope
```

Comparison preset for final review only:

```text
DM Serif Display
Source Sans 3
```

Do not silently switch to the comparison preset.

Do not use:

```text
Georgia
Times
Arial
Helvetica
system-ui
```

as final computed production fonts except as fallback after the intended family.

## 2. Font loading is part of implementation

Do not assume a CSS declaration means the font loaded.

Verify:

- font files/remote loading strategy;
- required weights;
- variable-font setup where used;
- CSS family names;
- Tailwind semantic font tokens;
- browser network/load success.

## 3. Runtime computed-font verification

For design review, inspect browser-computed styles.

At minimum:

```text
H1 → Fraunces
H2 → Fraunces
body paragraph → Manrope
navigation → Manrope
button → Manrope
form label/control → Manrope
```

If computed style falls back to:

```text
Georgia
serif
Arial
Helvetica
system-ui
```

before the intended family, fail design review.

A screenshot cannot prove font correctness.

## 4. Semantic type scale required

The project should expose or define a stable semantic scale, conceptually:

```text
display
h1
h2
h3
body-lg
body
body-sm
ui
caption
```

Exact token values belong in the design system.

Do not let each component invent:

```text
text-[51px]
text-[43px]
text-[37px]
```

independently.

If the scale is not yet encoded in tokens, flag this before widespread implementation.

## 5. Heading family use

Serif is primarily for:

```text
H1
H2
H3
selected large brand statements
```

Do not use serif for:

- nav;
- form labels;
- buttons;
- pricing;
- data;
- operational UI;
- table values.

## 6. Heading tracking

Target intent:

```text
H1/H2 ~ -0.02em
H3    ~ -0.01em
```

Use semantic tokens if available.

Do not invent tracking per section.

## 7. Line-height

Heading intent:

```text
~1.05–1.15
```

Body:

```text
~1.55–1.65
```

Do not use excessively tight multi-line headings that collide.

Do not use loose editorial headings that lose impact.

## 8. H1 line-count intent

Blueprint may constrain visual line count.

Example homepage target:

```text
ideally ~2 visual lines on desktop
```

If final localized copy produces 3–4 dominant lines:

- inspect H1 max width;
- inspect semantic type scale;
- inspect copy fit;
- inspect breakpoint.

Do not automatically shrink font to tiny size.

Do not ignore blueprint line-count intent.

## 9. Body measure

Target:

```text
60–72 characters per line
```

Reading container approximately:

```text
42–46rem / ~920px max
```

Text inside split sections may be narrower.

Avoid overly wide body copy.

## 10. Alignment

Left is default.

Do not center paragraphs/section headings by default.

Centered text requires intentional blueprint/design-system approval.

## 11. Uppercase labels

Avoid uppercase eyebrow-label patterns.

Wireframe annotations are not production typography.

Do not render:

```text
MAIN SERVICES
WHY CHOOSE US
AIRPORT HERO
```

unless actual content design explicitly calls for it.

## 12. Section heading consistency

Use shared `SectionHeading` or equivalent primitive.

Repeated H2 sections should not drift in:

- size;
- weight;
- tracking;
- description gap;
- accent-rule spacing.

## 13. UI text

UI typography must remain operational and precise.

Use Manrope for:

- navigation;
- CTA;
- language switch;
- forms;
- status;
- pricing;
- carousel controls;
- small labels.

Do not apply editorial serif to operational controls.

## 14. Weight discipline

Only load/use weights the design system needs.

Avoid random:

```text
300
500
600
700
800
```

mixes across similar UI.

Define roles.

For example:
- body regular;
- UI medium;
- button medium/semibold;
- headings appropriate variable/weight.

Exact values should be project-tokenized.

## 15. Fluid typography

Fluid typography is allowed and preferred where useful.

Use controlled semantic `clamp()` tokens.

Do not create a unique clamp expression for every heading.

## 16. Localization stress

Test typography with:

```text
Serbian Latin
English
Russian
```

Check:
- H1 wrapping;
- CTA width;
- nav;
- form labels;
- service names;
- footer;
- card headings.

Do not mix scripts accidentally.

For Serbian project locale:

```text
Latin script only
```

unless explicitly changed.

## 17. Immutable brand strings

Public brand:

```text
Luxury Transportation
```

is a locked identifier.

Do not visually/localize it into a translated brand name unless project rules explicitly change.

## 18. Font fallback visual failure

If the intended font is unavailable during development:

- do not approve final design using fallback appearance;
- do not tune spacing/type around fallback metrics;
- fix loading first.

Otherwise layout corrections become invalid when the correct font loads.

## 19. Screenshot QA

Review:

- H1 size relative to hero;
- number of visual lines;
- line-height;
- serif character;
- body density;
- nav size;
- CTA hierarchy;
- section heading consistency;
- footer density.

But screenshot review must be combined with computed-font verification.

## 20. Rejection conditions

Reject:

- wrong computed font;
- generic serif fallback;
- system sans fallback;
- no semantic scale;
- arbitrary type sizes proliferating;
- H1 violating locked hierarchy/line count without review;
- serif used in operational UI;
- uppercase wireframe annotations promoted to content;
- mixed Serbian Cyrillic on Latin-only page;
- body lines excessively wide;
- all text centered without blueprint basis.

## 21. Completion report

```text
FONTS LOADED:
COMPUTED H1 FONT:
COMPUTED BODY FONT:
TYPE TOKENS USED:
H1 LINE COUNT:
BODY MEASURE:
LOCALIZATION TESTED:
TYPOGRAPHY ISSUES:
```
