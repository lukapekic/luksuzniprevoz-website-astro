---
name: blueprint-to-ui
description: >
  Converts a locked Luxury Transportation page blueprint and grayscale HTML wireframe
  into production UI. Use for any page implementation or major page-section build.
  Prevents literal wireframe copying, blueprint omissions, CTA drift, component identity
  collapse, and unauthorized redesign.
---

# Luxury Transportation — Blueprint to Production UI

## 0. Mission

Translate:

```text
LOCKED BLUEPRINT
+
GRAYSCALE WIREFRAME
+
DESIGN SYSTEM
+
APPROVED COMPONENTS
```

into:

```text
HIGH-VALUE PRODUCTION UI
```

without:

- redesigning locked structure;
- copying wireframe visual CSS;
- omitting required regions;
- inventing CTA hierarchy;
- converting placeholders into production boundaries;
- simplifying functional requirements away;
- turning every section into a generic card.

## 1. Blueprint authority

The blueprint is the primary page-level authority.

Treat these as locked when the blueprint says so:

- section order;
- page purpose;
- conversion hierarchy;
- required content regions;
- component selection;
- surface role;
- image role;
- desktop composition;
- responsive intent;
- page-specific exceptions;
- functional states;
- internal-link hooks.

Do not silently alter them.

## 2. Language strength

Interpret blueprint wording precisely.

### MUST / REQUIRED / LOCKED / EXACTLY
Mandatory.

### SHOULD / DEFAULT / PREFERRED
Expected unless real implementation constraints justify deviation.

### MAY / OPTIONAL / WHERE APPROPRIATE / WHERE SPACE ALLOWS
Design discretion.

### DO NOT / FORBIDDEN
Prohibited.

Do not convert "may" into "must" merely because the wireframe demonstrates one option.

## 3. Required preflight

Before coding:

1. read the page blueprint completely;
2. read the wireframe completely;
3. read global design decisions;
4. read component rules;
5. inspect existing approved components;
6. inspect relevant design tokens;
7. inspect existing global page/container primitives;
8. identify missing assets/data.

Do not start from the wireframe HTML alone.

## 4. Create a blueprint compliance matrix

Before implementation, create an internal mapping.

Example:

```text
REGION                         REQUIRED   COMPONENT/PATTERN          STATUS
Hero H1                        yes        ServiceHero                pending
Hero support                   yes        ServiceHero                pending
Primary CTA                    yes        Button primary             pending
Secondary CTA                  yes        Button secondary           pending
Right-side supporting region   yes        HomepageHero slot          pending
Hero image role                yes        full-panel background       pending
```

After implementation, every required region must be:

```text
present
or
explicitly blocked with reason
```

Never silently drop a region to make layout easier.

## 5. Wireframe decontamination

The wireframe is **not production CSS**.

Extract from the wireframe:

- section order;
- relative proportions;
- grid topology;
- grouping;
- image footprint;
- content hierarchy;
- responsive stacking;
- control presence;
- carousel continuation;
- approximate density.

Discard from the wireframe:

- grayscale palette;
- Arial/Helvetica/system font declarations;
- skeleton blocks;
- uppercase helper labels;
- dashed image outlines;
- placeholder borders;
- placeholder backgrounds;
- exact gray values;
- helper min-heights unless confirmed by blueprint;
- helper radii unless matching locked tokens;
- inline widths used only to simulate text.

Production visual styling comes from the design system.

## 6. Wireframe annotation is not page content

Text such as:

```text
MAIN SERVICES
WHY CHOOSE US
AIRPORT HERO
FULL-PANEL BACKGROUND IMAGE
```

inside a wireframe is usually an implementation annotation.

Do not render it as production copy.

Especially do not convert wireframe labels into uppercase eyebrow labels.

## 7. Placeholder boundary ≠ production boundary

A wireframe box around an image or text does not automatically mean the production design should have a visible card/panel.

Examples:

### Hero

Wireframe may draw a copy block for contrast.

Blueprint may intend:

```text
full-panel image
+ directional scrim
+ unboxed text
```

Do not create a floating rounded copy card unless the blueprint says so.

### Final CTA

Wireframe may draw:

```text
[ content ][ image box ]
```

to show proportions.

Blueprint may intend:

```text
content
+
vehicle blended directly into panel
```

Do not retain a hard image boundary when the blueprint says "blended."

## 8. Geometry vs styling

Wireframe geometry is meaningful.

Wireframe styling is generally not.

Preserve things like:

```text
5/7
7/5
35/30/35
3 columns
2×2
content-first stack
partial-next-card carousel
```

unless the blueprint explicitly leaves them flexible.

Then apply production:

- type;
- colors;
- spacing;
- radius;
- surface;
- imagery;
- motion;
- focus states;

from the design system.

## 9. Topology vs pixel literalism

A wireframe may demonstrate:

```text
tablet 2 + 1 cards
```

The production implementation must preserve the intended topology, but may improve:

- centering;
- alignment;
- card width;
- container-query activation;

within blueprint freedom.

Do not copy awkward placeholder geometry literally.

## 10. Component identity preservation

Different sections may contain:

```text
image + heading + text + CTA
```

but still serve different identities.

Examples:

### Hero
Dominant cinematic entrance.

### OpenSplitSection
Editorial/explanatory content moment.

### PrivateAviationFeature
Contained premium operational subsection.

### FinalCTA
Medium-height conversion closer, explicitly not Hero #2.

Do not reduce these into one generic image-text component with different copy.

Do not reuse hero visual treatment for Final CTA.

## 11. CTA role locking

CTA hierarchy comes from blueprint/product architecture.

Implementation agents do not invent destinations.

Typical taxonomy:

```text
primary      booking/conversion
secondary    request quote
section      view fleet / explore service
contextual   cross-service link
tertiary     phone / email / WhatsApp
quiet        low-emphasis contextual link
```

Do not replace:

```text
Request a Quote
```

with:

```text
View Fleet
Contact
Learn More
```

because it fits the layout better.

## 12. Immutable product strings

Treat locked identifiers separately from localized marketing copy.

Examples include:

- public brand name;
- parent-company name;
- confirmed vehicle model names;
- legal identifiers.

Do not translate or rewrite an immutable identifier unless localization rules explicitly say so.

## 13. Locale integrity

A design implementation task must not become an ad-hoc translation task.

Use existing localized content.

If placeholders are required, use explicit neutral placeholders.

Do not mix scripts/locales.

For Serbian pages in this project:

```text
Latin script only
```

unless an explicit exception exists.

## 14. Content implementation boundary

Blueprint implementation does not authorize final marketing-copy generation.

If final copy is pending:

- preserve the required content shape;
- use approved placeholder data;
- avoid invented claims;
- avoid invented pricing;
- avoid invented trust statistics.

## 15. Missing assets

Missing production imagery does not grant permission to redesign.

If required asset is unavailable:

1. preserve the required footprint;
2. preserve image role;
3. preserve crop/aspect behavior;
4. use a neutral placeholder;
5. document missing asset.

Do not:
- reuse the hero image for Final CTA;
- add abstract gradients to replace photography;
- swap contextual photography for studio cutouts;
- invent unrelated stock images.

## 16. Static wireframe does not override behavior

Wireframes cannot fully represent:

- sticky headers;
- dropdown menus;
- carousels;
- accordion semantics;
- hover;
- active;
- focus-visible;
- reduced motion;
- scroll-state changes.

Use global component rules for dynamic behavior.

## 17. Responsive interpretation

Wireframe breakpoints demonstrate expected behavior, but blueprint wording controls flexibility.

If blueprint says:

```text
where space allows
retain split while readable
may stack
```

use content-fit and component/container width rather than blindly copying one media-query number.

## 18. Canonical homepage examples

### Homepage Hero
Required:
- contained full-panel S-Class background;
- left H1/support/2 CTAs;
- right concise statement;
- content columns only, not image column.

Failure:
- remove right statement;
- replace Request a Quote with View Fleet;
- create separate right image card.

### Homepage ServiceShowcase
Required:
- page-specific asymmetric mosaic;
- full-card photography;
- overlaid title/CTA;
- Private Chauffeur dominant by footprint.

Failure:
- generic 4-card grid;
- image-above/text-below;
- add "Featured" badge;
- generalize this pattern to all ServiceCards.

### Homepage FinalCTA
Required:
- 60–65% content;
- 35–40% blended vehicle visual;
- booking + quote + tertiary contacts;
- medium-height closer.

Failure:
- full photographic background;
- Hero #2;
- hard right-side image card;
- omit contact methods.

## 19. Canonical airport examples

### Airport Hero
Required:
- contained full-background image at all breakpoints;
- low content density;
- directional scrim;
- no calculator.

Do not infer from grayscale helper blocks that copy must be inside a rounded dark card.

### Route + Price
The wireframe's equal field rectangles mean required controls, not necessarily equal visual priority.

Production field widths may reflect usability while preserving required inputs.

### Private Aviation
Contained feature subsection; do not create a new page.

### Arrival Handling
Desktop image-first may become content-first on mobile.

Preserve content order rules.

## 20. Implementation sequence

Use:

```text
1. Blueprint read
2. Wireframe structural extraction
3. Compliance matrix
4. Existing component mapping
5. Missing-component decision
6. Production layout
7. Production visual system
8. Responsive implementation
9. Interaction/state implementation
10. Browser render
11. Blueprint completeness check
12. Visual review
```

Do not skip directly from wireframe HTML to Astro markup.

## 21. Completion rejection conditions

Reject implementation if:

- required section missing;
- required content region missing;
- CTA intent changed;
- page order changed;
- wireframe annotations appear as content;
- wireframe Arial/system typography leaked into production;
- placeholder image boundary became a production card against blueprint intent;
- Final CTA became Hero #2;
- missing asset caused redesign;
- global component was reimplemented locally;
- page-specific exception leaked globally;
- static wireframe overrode component interaction behavior.

## 22. Completion report

Report:

```text
BLUEPRINT COMPLIANCE
- sections: X/X present
- required regions: X/X present
- explicit exceptions used:
- unresolved requirements:

WIREFRAME INTERPRETATION
- structural patterns preserved:
- visual placeholder artifacts discarded:

COMPONENTS
- reused:
- new:
- page-local compositions:

ASSETS
- production assets used:
- placeholders remaining:

RESPONSIVE
- mobile:
- tablet portrait:
- tablet landscape:
- desktop:

KNOWN DIFFERENCES
- ...
```
