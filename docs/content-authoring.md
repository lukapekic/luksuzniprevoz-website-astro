# Content Authoring Guide

This guide covers how to author, manage, and translate content in the Astro Foundation Template.

---

## Markdown Format (FND-LIFE-05)

All page content is stored as Markdown files in `src/content/pages/`.

### File Layout Convention

One folder per route, one file per locale — nested, not flat:

```
src/content/pages/{routeKey}/{locale}.md
```

Examples:

```
src/content/pages/
  home/
    sr.md          # Serbian home page
    en.md          # English home page
    ru.md          # Russian home page
  private-chauffeur/
    sr.md          # Serbian private-chauffeur page
    en.md          # English private-chauffeur page
    ru.md          # Russian private-chauffeur page
  about/
    sr.md          # Serbian about page
    en.md          # English about page
    ru.md          # Russian about page
```

Folder and file names are organization only. The authoritative identity is the
frontmatter `routeKey` + `locale` (never the path) — `content:validate` asserts
`(routeKey, locale)` uniqueness and route binding from the frontmatter, and the
content loader globs `**/*.md` recursively so the nested layout is discovered.

### Frontmatter Fields (FND-LIFE-05)

Every content file must include the following frontmatter:

```yaml
---
routeKey: "about"          # Required. Must match a key in the route map.
locale: "en"               # Required. BCP 47 locale code matching foundation.config.ts.
status: "published"        # Required. One of: draft, in-review, published.
translationState: "reviewed" # Optional. One of: missing, draft, reviewed.

# SEO fields (FND-SEO-01, FND-SEO-03)
seoTitle: "About Us | My Brand"          # Required. 30–60 chars.
seoDescription: "Learn about our team..." # Required. 50–160 chars.
ogImage: "/og/about-en.jpg"              # Optional. OG image URL.
ogImageAlt: "Team photo"                  # Optional. Alt text for OG image.
noindex: false                            # Optional. Exclude from search engines.
h1: "About Us"                            # Optional. Custom H1 (defaults to seoTitle).
reviewedOn: "2025-01-15"                  # Optional. Last content review date.
---

Page content goes here in Markdown.
```

#### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `routeKey` | `string` | Yes | Key from the route map in `src/data/routes.ts` |
| `locale` | `string` | Yes | BCP 47 locale code (must exist in `foundation.config.ts`) |
| `status` | `string` | Yes | `draft`, `in-review`, or `published` |
| `translationState` | `string` | No | `missing`, `draft`, or `reviewed` (FND-LIFE-03) |
| `seoTitle` | `string` | Yes | 30–60 characters, page title for search engines |
| `seoDescription` | `string` | Yes | 50–160 characters, meta description |
| `ogImage` | `string` | No | Path or URL to Open Graph image (1200×630) |
| `ogImageAlt` | `string` | No | Alt text for OG image |
| `noindex` | `boolean` | No | Exclude page from sitemap and add `noindex` meta tag |
| `h1` | `string` | No | Custom H1 heading (defaults to `seoTitle`) |
| `reviewedOn` | `string` | No | ISO date of last content review (FND-LIFE-09) |

---

## Content Model & Archetypes (FND-DATA-08, FND-DATA-09)

Content frontmatter is **editorial copy only**. It holds localized headings,
intros, CTA labels, FAQ Q/A, and section prose, plus references to structured
data by stable id. The Markdown layer is a discriminated union of seven page
archetypes on the `pageType` field (see `src/content/schemas/pages.ts`):

| `pageType`   | Route `kind` | Used for                                       |
|--------------|--------------|------------------------------------------------|
| `home`       | `page`       | The homepage                                   |
| `service`    | `service`    | A leaf service page (e.g. private chauffeur)    |
| `hub`        | `hub`        | A collection index (e.g. business transport)    |
| `fleet`      | `page`       | The vehicle roster page                         |
| `pricing`    | `page`       | The pricing matrix page                         |
| `about`      | `page`       | The about page                                  |
| `contact`    | `page`       | The contact page                                |

`pageType` ↔ route `kind` consistency is enforced by `content:validate`
(FND-DATA-09): a `service` archetype must bind to a `kind:"service"` route, a
`hub` to `kind:"hub"`, and the page archetypes to `kind:"page"`.

### Content must NOT duplicate operational facts

Frontmatter MUST NOT contain: prices or pricing formulas, phone/email/address,
office hours, vehicle capacities, service limits, or localized URLs/slugs.
Those live in `src/data/*.ts`. Content references them by stable id:

```yaml
# references fleet vehicles (ids resolve in src/data/fleet.ts)
fleetSection:
  vehicleIds:
    - mercedes-s-class
    - mercedes-e-class
# references a route, never a raw URL
primaryCta:
  label: "View our fleet"
  target:
    type: route
    routeKey: fleet
```

Cross-reference resolution is enforced at two layers: the archetype schemas
(`z.enum` against the live route/vehicle/client data) reject a bad id at
`astro sync`, and `content:validate` resolves them again in the script path
(FND-DATA-08) so the gate catches bad refs before the build. CTA targets are a
`route` | `flow` discriminated union — never a raw internal URL.

### Content must NOT choose presentation

Frontmatter MUST NOT contain `layout`, `columns`, `theme`, `background`,
`imagePosition`, raw CSS classes, or color/spacing values. Blueprints and
components own presentation. An image may carry a normalized `focalPoint`
(x/y in 0–1) for art direction — a presentation *hint*, not layout.

---

## Content Lifecycle States (FND-LIFE-02, FND-LIFE-03, FND-LIFE-06, FND-LIFE-08)

### Status Field

The `status` field controls whether content appears in the build output:

| Status | Build | Sitemap | Search Engines |
|--------|-------|---------|---------------|
| `draft` | Excluded | Excluded | Excluded |
| `in-review` | Included | Excluded | Excluded |
| `published` | Included | Included | Included |

### Translation State

The `translationState` field tracks translation quality:

| State | Meaning |
|-------|---------|
| `missing` | No translation exists yet (content falls back to default locale or is omitted per `missingTranslation` strategy) |
| `draft` | Translation is a work in progress |
| `reviewed` | Translation has been reviewed by a native speaker |

### Review Staleness (FND-LIFE-08)

If `reviewedOn` is set and `reviewStalenessWindowMonths` is configured in `foundation.config.ts`, the SEO validator will warn when content has not been reviewed within the window.

Example: If `reviewStalenessWindowMonths: 12` and `reviewedOn: "2024-01-15"`, a warning is issued after 2025-01-15.

---

## Image Handling (FND-IMG-01, FND-IMG-08)

### Use Frontmatter, Not Markdown Syntax

**Do not use Markdown image syntax** (`![](path)`). The Foundation Template uses the `<Image>` primitive for all images.

**Instead**, declare images in frontmatter and render them via the component:

```yaml
---
routeKey: "about"
locale: "en"
status: "published"
seoTitle: "About Us"
seoDescription: "Learn about our team"
heroImage: "/images/team.jpg"
heroImageAlt: "Our team at the annual retreat"
---
```

Then in the page component:

```astro
---
import Image from "@astro-foundation/core/ui";
const { heroImage, heroImageAlt } = Astro.props;
---

<Image src={heroImage} alt={heroImageAlt} role="hero" />
```

### Image Rules

1. **Always use the `<Image>` primitive** — never raw `<img>` or `<picture>` (enforced by `no-raw-img-element` rule)
2. **Always provide alt text** — empty string only for decorative images with `role="decorative"`
3. **Store images in `src/assets/`** or `public/images/`
4. **Use Astro's image optimization** for responsive images
5. **Generate OG images** via `pnpm og:generate` if `capabilities.ogImages` is `"generated"`

### Image Roles

| Role | Description |
|------|-------------|
| `"hero"` | Full-width hero image, LCP candidate |
| `"content"` | Inline content image |
| `"logo"` | Brand logo |
| `"decorative"` | Visual-only, hidden from screen readers |
| `"icon"` | Small icon (not a photo) |

---

## UI Strings Dictionary (FND-I18N-08, FND-ARCH-03)

UI strings (button labels, navigation items, form labels, error messages, etc.) are stored in JSON files:

```
src/content/ui/
  sr.json    # Serbian UI strings
  en.json    # English UI strings
  ru.json    # Russian UI strings
```

### Format

```json
{
  "nav.home": "Početna",
  "nav.about": "O nama",
  "nav.services": "Usluge",
  "nav.contact": "Kontakt",
  "nav.language": "Jezik",
  "form.name": "Ime",
  "form.email": "E-pošta",
  "form.submit": "Pošalji",
  "form.success": "Poruka je poslata!",
  "form.error.required": "Ovo polje je obavezno",
  "a11y.skipLink": "Preskoči na sadržaj",
  "a11y.closeMenu": "Zatvori meni",
  "a11y.openMenu": "Otvori meni"
}
```

### Rules

1. **All locales must have the same set of keys** (enforced by `content:validate` — FND-I18N-08)
2. **Never hardcode UI strings** in templates — use the dictionary (enforced by `no-hardcoded-ui-string` ESLint rule)
3. **Use dot-notation keys** for namespacing (e.g., `nav.home`, `form.submit`)
4. **Reference strings in templates** using the `t()` function: `t("nav.home")`

---

## Translation Workflow

### Adding a New Page

1. Add the route to `src/data/routes.ts` with slugs for all locales
2. Create a per-route folder `src/content/pages/{routeKey}/` and add one file per
   locale: `{locale}.md` (e.g. `home/sr.md`, `home/en.md`, `home/ru.md`)
3. Add UI strings used by the page to each `src/content/ui/{locale}.json`
4. Run `pnpm content:validate` to verify route binding and coverage
5. Run `pnpm seo:validate` to verify SEO data
6. Run `pnpm routes:validate` to verify route definitions

### Adding a New Locale

1. Add the locale to `foundation.config.ts` → `locales.locales`
2. Add slugs for the new locale in every route in `src/data/routes.ts`
3. Create content files for the new locale for all routes
4. Create `src/content/ui/{locale}.json` with all keys from existing locale files
5. Write 404 page copy for the new locale
6. If `capabilities.legalPages` is `true`, create legal pages for the new locale
7. Run `pnpm quality:fast` to verify everything
8. Test language switching on every page

### Updating Existing Content

1. Edit the Markdown file
2. Update `reviewedOn` to today's date
3. Set `status` to `in-review` during the review process
4. After review, set `status` back to `published`
5. Run `pnpm content:validate` and `pnpm seo:validate`

### Translating Content

1. Copy the source locale's `.md` file to the target locale within the same
   per-route folder (e.g. `home/sr.md` → `home/en.md`)
2. Translate all text content (body, frontmatter fields)
3. Translate `seoTitle` and `seoDescription` (not just copy)
4. Translate any alt text for images
5. Set `translationState: "reviewed"` after native speaker review
6. Verify parity via `content:validate` (FND-I18N-10)
