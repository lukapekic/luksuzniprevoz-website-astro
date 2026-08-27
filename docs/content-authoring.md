# Content Authoring Guide

This guide describes the production editorial model for `site/luksuzni-prevoz`.

The key separation is:

```text
editorial/localized copy → src/content/
operational/business truth → src/data/
routes/localized slugs → src/data/routes.ts
presentation → DESIGN.md + blueprints + components + theme tokens
```

Content authors must not duplicate facts already owned by typed data modules and must not choose layout/styling from Markdown.

## 1. Content location and identity (FND-LIFE-05)

Production page content lives under:

```text
site/luksuzni-prevoz/src/content/pages/
```

The Astro loader recursively discovers `**/*.md`.

Current files are organized by route folder, for example:

```text
src/content/pages/home/home.sr.md
src/content/pages/home/home.en.md
src/content/pages/home/home.ru.md
```

The filename/path is organizational only. **Authoritative identity is the frontmatter pair `routeKey` + `locale`.** Do not derive routing behavior from the filename.

## 2. Base frontmatter

Every page archetype extends the shared foundation identity/lifecycle and SEO schemas.

Typical base fields:

```yaml
---
routeKey: home
locale: sr
pageType: home
status: published
translationState: reviewed
reviewedOn: 2026-08-17

seoTitle: "Luxury Transportation | Privatni i poslovni prevoz sa vozačem"
seoDescription: "Privatni prevoz sa profesionalnim vozačem u Beogradu..."
---
```

### Identity/lifecycle fields

| Field              | Requirement                      | Notes                                                                 |
| ------------------ | -------------------------------- | --------------------------------------------------------------------- |
| `routeKey`         | required                         | Must resolve to `src/data/routes.ts`. CamelCase route keys are valid. |
| `locale`           | required                         | Must be one of the configured site locales.                           |
| `pageType`         | required by site page schema     | One of the seven page archetypes below.                               |
| `status`           | defaults to `draft`              | `draft`, `in-review`, `published`.                                    |
| `translationState` | defaults to `missing`            | `missing`, `draft`, `reviewed`.                                       |
| `sourceLocale`     | translation-only when applicable | Source language for lifecycle tracking.                               |
| `sourceDigest`     | managed lifecycle metadata       | Do not invent; keep in sync via content digest tooling.               |
| `reviewedOn`       | optional                         | ISO date / parsed date used for staleness checks.                     |

### SEO fields

| Field            | Requirement         | Notes                                                                                                                                             |
| ---------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `seoTitle`       | required            | Page-specific title. Do not manually append the brand if the template composes it. Validator warns when the composed title exceeds 60 characters. |
| `seoDescription` | required            | Schema maximum 300; production SEO validator warns when description exceeds 160 characters.                                                       |
| `ogImage`        | optional            | OG asset path/URL according to the active OG strategy.                                                                                            |
| `ogImageAlt`     | optional            | Localized alt text where the OG image needs it.                                                                                                   |
| `noindex`        | defaults to `false` | Use deliberately for pages that should not be indexed.                                                                                            |

Do not invent artificial minimum SEO lengths. Prefer accurate, useful copy that stays within the validator's production limits.

## 3. Page archetypes (FND-DATA-08, FND-DATA-09)

`site/luksuzni-prevoz/src/content/schemas/pages.ts` defines seven explicit archetypes:

| `pageType` | Required route kind | Purpose            |
| ---------- | ------------------- | ------------------ |
| `home`     | `page`              | Homepage           |
| `service`  | `service`           | Leaf service page  |
| `hub`      | `hub`               | Service-family hub |
| `fleet`    | `page`              | Fleet page         |
| `pricing`  | `page`              | Pricing page       |
| `about`    | `page`              | About page         |
| `contact`  | `page`              | Contact page       |

`content:validate` verifies the page type matches the structural route kind.

Do not add arbitrary fields to an archetype. Update the schema deliberately when the editorial contract genuinely changes.

## 4. Editorial content vs operational truth

Markdown owns localized/editorial material such as:

- headings and intros;
- section prose;
- CTA labels;
- FAQ questions/answers;
- route-card titles/text;
- localized image alt text;
- localized client-facing explanation.

Markdown must **not** duplicate:

- prices or pricing formulas;
- phone/email/address;
- office hours;
- vehicle capacity/specification truth;
- operational limits;
- client approval/public-logo status;
- localized slugs/URLs.

Those belong in typed data modules under:

```text
site/luksuzni-prevoz/src/data/
```

Examples include `routes.ts`, `fleet.ts`, `pricing.ts`, `clients.ts`, `contact.ts`, and operational/service data modules.

If a fact already has a typed source, reference it by stable ID instead of copying it into localized Markdown.

## 5. Internal links and CTA targets

Do not author internal localized URLs manually.

CTA targets use typed intent:

```yaml
primaryCta:
  label: "Pogledaj vozila"
  target:
    type: route
    routeKey: fleet
```

or an application flow:

```yaml
primaryCta:
  label: "Rezerviši"
  target:
    type: flow
    flowKey: booking
```

Routes resolve through the repository's localization helpers. Never hard-code `/en/...`, `/ru/...`, or Serbian internal paths in content.

## 6. Presentation is not content

Frontmatter must not choose visual implementation.

Do not add fields such as:

```text
layout
columns
theme
background
imagePosition
cardStyle
cssClass
radius
spacing
breakpoint
```

Presentation comes from `DESIGN.md`, the active theme, locked blueprints, shared contracts, and components.

An image may carry a normalized `focalPoint` when the schema supports it. That is an art-direction hint, not permission to define layout.

## 7. Images (FND-IMG-01, FND-IMG-08)

Do not use Markdown image syntax for production page imagery.

Structured editorial image references use the site's `imageReferenceSchema`, which contains:

```yaml
image:
  src: "/images/example.webp"
  alt: "Localized useful description"
  role: informative
  focalPoint:
    x: 0.5
    y: 0.4
```

`role` is:

- `informative` — alt text must communicate the image's purpose;
- `decorative` — use empty alt text according to the component/accessibility contract.

Rendering is component-specific. Production components currently use Astro's `astro:assets <Image>` for imported `ImageMetadata` where appropriate. Follow the component contract; do not assume a generic foundation Image component exists.

Raw `<img>`/`<picture>` usage remains prohibited where the project lint rule requires the approved image pipeline.

## 8. UI dictionaries (FND-I18N-08, FND-ARCH-03)

Reusable interface strings live in:

```text
site/luksuzni-prevoz/src/content/ui/sr.json
site/luksuzni-prevoz/src/content/ui/en.json
site/luksuzni-prevoz/src/content/ui/ru.json
```

Use them for navigation, generic controls, form labels/errors, accessibility labels, and other repeated UI strings.

Rules:

1. Locale dictionaries must keep matching key coverage where the validator requires parity.
2. Do not hard-code translatable reusable UI strings in components.
3. Keep stable semantic keys; do not encode presentation in key names.
4. Use the project's translation helper rather than indexing locale JSON manually in arbitrary components.

Page-specific editorial prose stays in the page Markdown rather than bloating the global UI dictionary.

## 9. Translation lifecycle

Serbian is the default production locale; English and Russian are localized alternatives according to `foundation.config.ts`.

For a translated page:

- set `sourceLocale` to the source language where lifecycle tracking is used;
- keep `sourceDigest` synchronized with the source content;
- use `translationState: reviewed` only after review;
- update `reviewedOn` when a real editorial review occurred.

Use the canonical repository command for digest synchronization:

```bash
pnpm content:sync-digests
```

Then validate:

```bash
pnpm content:validate
```

Do not fake a digest or review date to silence a gate.

## 10. Adding a page

1. Add/confirm the route in `site/luksuzni-prevoz/src/data/routes.ts` with all configured locale slugs.
2. Choose the correct `pageType`/route kind.
3. Create the localized Markdown files under `src/content/pages/`.
4. Author only editorial copy and typed references.
5. Add reusable UI keys only when the interface genuinely needs them.
6. Run the applicable validation stack:

```bash
pnpm types:generate
pnpm routes:validate
pnpm content:validate
pnpm seo:validate
pnpm check
```

For production UI implementation of the page, separately follow the relevant blueprint and design-governance workflow:

```bash
pnpm design:context --target <exact-file> --surface <surface-id>
```

Content authoring is not authorization to redesign a page.

## 11. Adding or changing a locale

Locale configuration is owned by the production site's `foundation.config.ts`.

A locale change requires coordinated updates to:

- locale config;
- route slugs;
- UI dictionaries;
- page content;
- SEO/hreflang/parity validation;
- any locale-aware 404 or routing behavior.

Run the full route/content/SEO checks after the change. Do not introduce an implicit fallback language that conflicts with the configured `missingTranslation` strategy.

## 12. Authoring completion checklist

Before considering a content batch complete:

- [ ] `routeKey` and `locale` resolve correctly.
- [ ] `pageType` matches route kind.
- [ ] No operational truth is duplicated in Markdown.
- [ ] No internal raw URLs are authored where a route target exists.
- [ ] No layout/theme/CSS choices are encoded in content.
- [ ] Image roles/alts are valid.
- [ ] UI dictionary parity is maintained.
- [ ] Translation lifecycle metadata is truthful.
- [ ] SEO fields pass repository validation.
- [ ] `pnpm content:validate` and `pnpm seo:validate` pass.
