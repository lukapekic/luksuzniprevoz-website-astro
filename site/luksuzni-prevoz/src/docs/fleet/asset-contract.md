# Fleet Page — Asset Contract

**Status:** LOCKED

## Hero

Exact required source:

```text
site/luksuzni-prevoz/src/assets/pages/fleet/hero.webp
```

Role:

- full-bleed Hero background;
- `object-cover`;
- responsive focal point controlled in Hero;
- optimized through Astro;
- decorative unless the asset contains page-essential information, which it must not.

No other asset substitutes for the Hero.

## Vehicle chapter sources

Use exactly one standardized left-facing source per visual chapter. This set
is reserved for the large Fleet-page chapters; compact Homepage cards keep
their separate left-facing presentation set.

```text
Mercedes S-Class
site/luksuzni-prevoz/src/assets/fleet/original/s-class/left-facing.webp

Mercedes E-Class
site/luksuzni-prevoz/src/assets/fleet/original/e-class/left-facing.webp

Škoda Superb
site/luksuzni-prevoz/src/assets/fleet/original/superb/left-facing.webp

Škoda Kodiaq
site/luksuzni-prevoz/src/assets/fleet/original/kodiaq/left-facing.webp

Mercedes V-Class Extra Long
site/luksuzni-prevoz/src/assets/fleet/original/v-class/left-facing.webp

Mercedes Sprinter
site/luksuzni-prevoz/src/assets/fleet/original/sprinter/left-facing.webp
```

The V-Class asset represents both canonical V-Class passenger configurations.

## Current remote snapshot caveat

The current local repository contains:

- `e-class/`
- `kodiaq/`
- `s-class/`
- `sprinter/`
- `superb/`
- `v-class/`

It also contains `src/assets/pages/fleet/hero.webp`. No Vito Fleet-page source image exists, so Vito is deliberately excluded from the showcase through page-specific presentation data while remaining canonical and priced.

Implementation MUST verify the exact files before production completion.

If a required path is missing:

- fail the asset gate;
- do not substitute a Homepage compact image;
- do not use another model;
- do not use a side-facing image;
- do not redesign the chapter.

## Delivery

The `original` files are source media, not delivery-size assets.

Use Astro image transformation.

Vehicle chapters:

- `object-fit: contain`;
- lazy;
- stable aspect ratio;
- responsive widths;
- decorative alt when adjacent text fully identifies the model.

Hero:

- eager;
- high fetch priority;
- optimized LCP output;
- cover crop;
- existing full-bleed Hero scrim.
