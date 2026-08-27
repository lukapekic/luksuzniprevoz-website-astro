# Luxury Transportation — Content Model Contract

## Purpose
Define the editorial content layer before UI/component implementation.

## Separation
Content files contain localized narrative/SEO copy, FAQs, CTA labels, and references to route/fleet/client IDs.

Content files MUST NOT duplicate:
- URLs/slugs
- phone/email/address
- office hours
- prices/formulas
- vehicle capacities
- service limits
- operational/business facts already stored in structured project data

## Collection
Use one Astro build-time collection: `pages`.

```text
src/content/pages/
  home/
    home.sr.md
    home.en.md
    home.ru.md
  private-chauffeur/
    private-chauffeur.sr.md
    private-chauffeur.en.md
    private-chauffeur.ru.md
```

`routeKey + locale` are authoritative identity. Folder/file names are organization only.

## Archetypes
- home
- service
- hub
- fleet
- pricing
- about
- contact

Each archetype has an explicit Zod schema. Do not replace this with one giant schema containing dozens of optional fields.

## Shared content types
- SEO: localized title/description and optional OG copy/image override.
- CTA: route target or flow target; never a raw internal URL.
- Image reference: src, localized alt, optional normalized focal point.
- FAQ: visible FAQ source used by eligible FAQ structured data.
- Editorial section: semantic key + heading/body/items/image/references.

## Content must not choose design
Forbidden frontmatter fields include:
- layout
- columns
- theme/tone
- background
- imagePosition
- arbitrary CSS classes
- raw color/spacing values

Blueprints/components own presentation.

## Semantic validation
Zod validates shape. `content:validate` must also verify:
- every routeKey resolves;
- every public logical page has exactly SR/EN/RU;
- `(routeKey, locale)` is unique;
- CTA/related route refs resolve;
- vehicle IDs resolve in fleet data;
- client IDs resolve in client data;
- pageType matches route archetype;
- no locale fallback.

## Pilot
Populate only:
1. Home
2. Private Chauffeur
3. Airport Transportation
4. Business Transportation

Do not multiply all page copy until the pilot validates the model.
