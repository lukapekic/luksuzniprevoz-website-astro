---
name: typography-system
description: >
  Mandatory typography implementation and QA for Luxury Transportation. Use whenever
  implementing or reviewing headings, body text, navigation, buttons, forms, labels,
  tables, pricing, editorial statements, localization, brand lockup, or font loading.
---

# Luxury Transportation — Typography System

## 0. Mission

Typography is a primary part of the brand.

The implementation must preserve:

- the correct loaded font families;
- semantic type hierarchy;
- controlled scale;
- serious/professional heading character;
- readable body measure;
- consistent weights;
- line-height and tracking;
- localization robustness;
- clear separation between page typography and brand-lockup typography.

This skill is procedural. Raw type values live in active Theme V2 JSON.

## 1. Locked families

Current production roles:

```text
Headings / selected large statements:
Inter Tight

Body / navigation / controls / forms / tables / pricing:
Manrope

BrandLockup wordmark only:
Cormorant Garamond Italic
```

Do not silently substitute:

```text
Fraunces
Instrument Serif
Georgia
Times
Arial
Helvetica
system-ui
```

as final production typography.

Fallbacks are acceptable only when the intended font genuinely cannot load; that condition is a defect to diagnose, not a visual alternative.

## 2. Active source

Inspect:

```text
site/luksuzni-prevoz/src/theme/versions/version-2/typography.json
site/luksuzni-prevoz/src/styles/fonts.css
site/luksuzni-prevoz/src/styles/global.css
site/luksuzni-prevoz/src/theme/generated/theme.css
```

Do not hand-edit generated theme CSS.

## 3. Font loading is part of implementation

Verify:

- self-hosted package/file exists;
- `@font-face` family name matches the token family;
- required script subset exists;
- required weights/axes exist;
- italic is loaded where the brand uses it;
- CSS utility maps to `font-family`, not another font property;
- CSP permits the font source;
- browser actually fetches the font.

A declaration alone does not prove a font loaded.

## 4. Current project loading contract

The current site self-hosts:

```text
Inter Tight Variable
Manrope Variable
Cormorant Garamond Variable italic
```

Inter Tight and Manrope must support Serbian Latin, English, and Russian/Cyrillic requirements used by the configured locales.

BrandLockup uses the loaded Cormorant italic face rather than synthetic italic.

Do not add remote Google Fonts loading unless the global CSP/design strategy is explicitly changed.

## 5. Runtime computed-font verification

At minimum inspect browser-computed styles for:

```text
H1                  → Inter Tight
H2                  → Inter Tight
body paragraph      → Manrope
navigation          → Manrope
button              → Manrope
form label/control  → Manrope
BrandLockup         → Cormorant Garamond + italic
```

If the intended family is not the first resolved production font, fail typography review.

A screenshot cannot prove font correctness.

## 6. Semantic type scale required

Use the active Theme V2 semantic scale.

Conceptual roles:

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

Do not let components invent unrelated one-off type sizes such as:

```text
text-[51px]
text-[43px]
text-[37px]
```

unless a page-specific locked decision explicitly requires an exception.

## 7. Heading use

Inter Tight is primarily for:

```text
H1
H2
H3
selected large statements
```

Do not use page-heading typography for:

- navigation;
- buttons;
- form labels;
- table values;
- operational metadata;
- dense functional UI.

Those remain Manrope.

## 8. Brand type isolation

Cormorant Garamond Italic is a coded brand identity treatment.

Use it for the BrandLockup/approved brand wordmark only.

Do not reuse it for:

- H1/H2;
- pull quotes;
- Final CTA;
- service-card titles;
- decorative accents.

This prevents the site from drifting back toward an editorial/newspaper aesthetic.

## 9. Weight discipline

Use semantic weights from Theme V2.

Inter Tight and Manrope are variable faces; request real supported weights.

Do not:

- synthesize bold/italic to imitate a missing face;
- use excessive weight jumps section-by-section;
- compensate for weak hierarchy by making every heading bold.

If `font-synthesis: none` is used defensively, verify the requested weight exists.

## 10. Heading tracking

Use the Theme V2 semantic letter-spacing tokens.

Do not invent tracking per section.

Inter Tight's compact character means overly tight tracking can become harsh, especially in Cyrillic.

Review localized headings visually.

## 11. Line-height

Use Theme V2 heading/body/UI line-height tokens.

Do not:

- collapse multi-line headings until glyphs visually collide;
- loosen headings into editorial display typography;
- compress UI text below comfortable readability.

## 12. H1 line-count intent

A page blueprint may constrain visual line count.

For the Homepage, the target remains a strong desktop H1 that generally resolves to about two visual lines where final localized copy permits.

When a localized H1 becomes too tall:

1. inspect content width;
2. inspect container/grid allocation;
3. inspect the semantic H1 token;
4. inspect copy fit;
5. inspect breakpoint.

Do not immediately shrink the H1 to an arbitrary small size.

## 13. Body measure

Use Theme V2 measure tokens and layout containers.

Long body text should not span the full 80rem page container.

Use the reading/narrow measures where appropriate.

## 14. Navigation and controls

Navigation/buttons/forms use Manrope.

Keep UI typography:

- compact;
- legible;
- consistent;
- free from heading-font decoration.

Do not use all-caps indiscriminately.

## 15. Localization robustness

Review typography in:

```text
Serbian Latin
English
Russian Cyrillic
```

Check:

- heading wrap;
- CTA width;
- nav width;
- punctuation;
- Cyrillic glyph coverage;
- uppercase behavior;
- line-height;
- truncation.

Do not approve the type system using English only.

## 16. Responsive typography

Use semantic responsive scale behavior.

Avoid arbitrary breakpoint ladders with many one-off sizes.

If a heading becomes awkward at tablet widths, first inspect:

- available container width;
- split activation;
- max-width;
- grid proportion;
- copy measure.

Typography should not compensate for a structurally wrong layout.

## 17. Tailwind v4 usage

Use project utilities:

```text
font-heading
font-body
font-brand
```

where appropriate.

Do not use ambiguous arbitrary font utilities such as:

```text
font-[var(--font-body)]
```

when Tailwind could interpret the value for another font property.

Do not assume CSS variables declared only in `:root` automatically create Tailwind font-family utilities; use the registered project utilities.

## 18. Astro scoped styles

Font-family ownership should normally live on the element/component that renders the text.

Do not depend on a parent component's scoped style reaching DOM rendered by a child component unless that relationship is explicitly supported.

## 19. Typography review failures

Fail typography review when:

- H1/H2 resolves to the wrong family;
- body/UI resolves to Inter Tight because `font-body` was omitted;
- BrandLockup uses a synthesized/fallback italic;
- Fraunces or Instrument Serif reappears in page headings;
- a locale falls back because the selected face lacks required glyphs;
- arbitrary one-off type values replace the semantic scale;
- layout is tuned around a fallback font.

## 20. Completion checklist

- [ ] Theme V2 typography JSON inspected.
- [ ] Fonts CSS inspected.
- [ ] H1 computed family verified.
- [ ] H2 computed family verified.
- [ ] Body/UI computed family verified.
- [ ] BrandLockup family + italic verified where relevant.
- [ ] Serbian/English/Russian coverage considered.
- [ ] Heading wrapping reviewed at tablet widths.
- [ ] No stale Fraunces/Instrument Serif assumptions introduced.
- [ ] No arbitrary type scale drift introduced.
