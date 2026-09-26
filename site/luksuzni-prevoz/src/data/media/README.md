# Media registry

Production image and logo file paths are owned by these typed modules. Use a
focused area import in components:

```ts
import { home } from "../../data/media/home";
const chauffeurImage = home.services.chauffeur;
```

The optional barrel supports a combined namespace:

```ts
import { assets } from "../../data/media";
const chauffeurImage = assets.home.services.chauffeur;
```

Values retain Astro's imported image metadata and work directly with `Image`
and `Picture`. SVG imports retain their Astro SVG component type. Fonts remain
referenced by the stylesheet.

## Folder ownership

- `src/assets/brand`: brand artwork.
- `src/assets/fonts`: font sources.
- `src/assets/logos/{clients,partners}`: relationship logos.
- `src/assets/images/fleet/<model>`: canonical vehicle presentation photography.
- `src/assets/images/pages/<page>`: images specific to a page.
- `src/assets/images/shared/<subject>`: reusable contextual photography.

Use lowercase hyphenated filenames. Store an image once, even when several
pages use it. Keep source images here; Astro generates responsive delivery
variants. Keep future unselected candidates under `reference/imagery/`, outside
production assets.

## Adding or moving an asset

1. Choose the owner folder and add a static import to its registry.
2. Expose a descriptive property; keep existing properties stable when moving files.
3. Consume the area registry rather than importing a file directly.
4. Update any approved asset-contract paths when moving an existing image.
5. Run the site check and build.

Localized alt text stays in approved content. Crop settings, image roles, fleet
relationships, and verification gates stay in existing presentation/data modules
(`selected-media.ts`, `closing-media.ts`, `fleet-media.ts`, `fleet-page-media.ts`,
and `client-media.ts`). These modules now consume the registry; their public APIs
are preserved.

`catalog.json` records the folder migration's previous paths (including stock
source identifiers) and SHA-256 hashes. It is an audit record, not a runtime
registry or a claim of licensing approval. New externally sourced images should
record verified source and licensing information in their asset contract.
