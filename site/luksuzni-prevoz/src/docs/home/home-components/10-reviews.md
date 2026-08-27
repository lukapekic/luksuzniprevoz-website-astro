# GoogleReviews — Exact V1.1 Contract

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Authority

This section provides social proof immediately before FinalCTA.

Use active Theme V2 semantic roles and the repository's carousel/accessibility patterns. Do not create a second local review-card design system.

Relevant skills:

```text
.skills/component-architecture.md
.skills/high-value-visual-execution.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
```

## Section

- open dark Homepage section;
- uses the blueprint-approved `standard` section rhythm;
- section remains visually quieter than Hero and FinalCTA.

## Heading row

Desktop:

- heading and short intro left;
- compact verified Google profile action right;
- spacing/alignment use Theme V2 semantic layout/spacing roles.

Mobile:

- stack when needed;
- section CTA remains clearly interactive.

## Presentation

Target continuation behavior:

```text
desktop → approximately 2.5–3 reviews visible
tablet  → approximately 1.5–2 reviews visible, depending available width
mobile  → swipeable track with a clear partial-next-card cue
```

Exact item width belongs to the carousel/container implementation, not to duplicated literal theme values.

## Review card

- surface uses the semantic `surfaceElevated` role or approved equivalent;
- card radius uses Theme V2 semantic `card` radius;
- internal spacing uses Theme V2 spacing tokens;
- maintain a stable readable footprint without forcing a decorative fixed height;
- quote text receives a stronger readable measure and hierarchy than metadata;
- reviewer/date resolve into a clear closing row;
- no heavy shadow or bright border.

## Content

Each review may contain only verified/source-backed data:

- restrained rating treatment;
- review excerpt;
- reviewer name;
- relevant verified metadata.

Do not fabricate review copy or reviewer details.

Development fixtures may exercise the visual contract. Production remains gated until the real Google profile URL and source-backed review data are verified.

## Typography / color

Use semantic roles:

```text
primary review text → textPrimary
secondary metadata  → textMuted
rating treatment    → recognizable Google-compatible treatment with restraint
```

Do not introduce old gold accent styling or flood the cards with bright yellow stars.

Typography uses the project system:

```text
headings → Inter Tight
body/UI  → Manrope
```

## External profile CTA

The section-level Google action must use the **verified actual Google Maps / Google Business profile URL**.

Until that destination is verified, do not invent or guess a link.

## Carousel / interaction

- no autoplay;
- keyboard-operable controls where carousel mechanics are used;
- accessible control labels;
- focus-visible stronger than hover;
- reduced-motion behavior required;
- intentional carousel overflow must remain contained.

## Forbidden

- fabricated reviews;
- unverified Google profile URLs;
- oversized yellow star graphics;
- autoplay;
- raw theme values;
- dashboard/SaaS card styling.
