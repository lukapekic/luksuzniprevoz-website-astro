# SiteFooter — Exact V1.1 Contract

Status: **Aligned to Homepage Blueprint v1.1 + active Theme V2**

## Authority

`SiteFooter` is approved shared infrastructure.

Homepage work reuses it; the Homepage does not create a page-specific Footer variant.

Relevant skills:

```text
.skills/component-architecture.md
.skills/responsive-layout.md
.skills/responsive-ui.md
.skills/tailwind-v4.md
.skills/accessibility-wcag.md
.skills/multilingual-routing.md
```

Theme values are consumed from active Theme V2 and must not be copied into this contract.

## Surface

- full-width dark footer surface using the appropriate Theme V2 background/surface role;
- optional subtle structural top divider using the semantic divider/border role;
- no rounded outer Footer panel;
- no glow or heavy shadow.

## Relationship to FinalCTA

Footer follows the strong contained FinalCTA as a compact site ending.

Use the blueprint-approved semantic spacing relationship. Do not create an oversized blank band between FinalCTA and Footer.

## Desktop inner layout

Contained inner shell aligned to the Theme V2 main container.

Approximate composition:

```text
Brand | Services / Company | Contact / Hours
```

The first column may carry slightly more visual weight, while all gaps/padding use Theme V2 spacing roles.

## Content groups

### 1. Brand

- approved BrandLockup using its mark-only visual variant; the hidden wordmark
  continues to provide the accessible home-link name;
- concise brand line where canonical localized content exists;
- parent-company relationship may be referenced quietly when appropriate.

### 2. Services / Company

- route-derived navigation only;
- localized labels from canonical navigation/i18n sources;
- no hand-built internal URL strings.

### 3. Contact / Hours

Render only canonical business/contact data allowed by verification status:

- address;
- phone;
- email;
- WhatsApp where approved;
- office hours.

Absence of an unverified contact method is not a visual bug.

## Bottom row

May contain:

- legal links;
- copyright;
- restrained locale shortcuts if useful and supported by routing architecture.

Use semantic divider/spacing roles rather than copied literal values.

## Mobile

- stack content groups cleanly;
- preserve comfortable touch targets;
- bottom row may stack;
- no horizontal overflow;
- maintain clear group hierarchy without turning each group into a card.

## Data ownership

All internal links are route-derived.

All contact and office-hour values are business/contact-data-derived.

Do not hardcode:

- phone;
- email;
- WhatsApp;
- address;
- office hours;
- locale paths.

## Typography / color

Use Theme V2 semantic roles and project typography:

```text
headings / strong labels → Inter Tight or approved semantic heading role
body / links / UI        → Manrope
brand wordmark           → visually hidden in the Footer's mark-only BrandLockup
```

Phone, email, office hours, and the verified address use one consistent
body/UI text treatment. The response-time note remains subordinate.

Do not introduce local font-family or palette declarations.

## Forbidden

- newsletter signup;
- giant sitemap treatment;
- oversized social-media section;
- Homepage-specific Footer redesign;
- raw theme values;
- old V1 gold/Fraunces styling.
