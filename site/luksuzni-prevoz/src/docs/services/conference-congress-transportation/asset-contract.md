# Conference / Congress Transportation — Asset Contract

Status: **LOCKED**

All page-specific editorial images come from the existing repository pool:

```text
src/assets/shared/other/
```

Do not copy, rename, convert or duplicate these assets for this page.

## 1. Hero — owner approved

```text
src/assets/shared/other/s-class-hotel-entrance-night.webp
```

Role: full-bleed Conference Hero.

Required component:

```text
ServiceHero
variant="full-bleed"
imageAlt=""
```

The image is decorative because the Hero copy carries the page meaning. Use the existing `ServiceHero` image pipeline, dark treatment and scrim. Do not add a second page-specific black overlay in the Conference renderer.

The older S-Class generation visible in the source image is an explicitly accepted owner decision. Do not replace the asset because of model generation alone.

Required review:

```text
320px mobile
768px tablet portrait
1024px tablet landscape
1440px desktop
1920px wide desktop
```

The crop MUST retain the hotel/venue arrival context and keep the vehicle visible without reducing H1/CTA contrast.

## 2. Event Journey

```text
src/assets/fleet/original/sprinter/interior-entrance.webp
```

Role: supporting right-side image in the contained six-stage Business movement sequence.

Reason: communicates group-passenger access and the practical event-transport role of the Sprinter.

Decorative alt: `""`.

At mobile/tablet the image follows the shared stacked sequence footprint. From
the shared desktop threshold it occupies the 5-track media side and its height
matches the adjacent stepped sequence; the portrait asset must not enlarge the
grid row through intrinsic sizing. Preserve the passenger entrance and visible
seating in the crop and do not upscale beyond the component's generated source set.

## 3. Passenger movement

No editorial image. The two movement types are expressed as a vertical,
divider-led fact sequence using authored copy and canonical vehicle-role labels.

## 4. Multi-vehicle schedule

No editorial image.

The section is a static scheduling/coordination composition built from typography, dividers and restrained connectors. Adding a decorative photograph weakens the information hierarchy.

## 5. Vehicle Recommendations

Use canonical fleet media through the existing fleet-media/data path. Do not use `assets/shared/other` as a substitute for vehicle-card media.

Locked vehicle IDs:

```text
mercedes-s-class
mercedes-e-class
mercedes-v-class-7-plus-1-extra-long
mercedes-sprinter
```

## 7. Service Standards

No new image. Reuse the shared `ServiceStandards` presentation.

## 8. Final CTA

```text
src/assets/shared/other/v-class-parked-outside.webp
```

Role: integrated decorative media in shared `FinalCTA`.

Required props:

```text
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
```

Final CTA must remain a medium-height closer and MUST NOT become Hero #2.

Use the shared integrated-media crop and reserved geometry. Keep the vehicle readable without increasing the CTA's height to Hero scale.

## 9. Explicitly not assigned to Conference

These sibling-signature assets remain out of the Conference page unless the asset contract is revised:

```text
chauffeur-inside-grayedout.webp         Corporate Hero
s-class-driving-forest-intheback.webp   Corporate Working Day
s-class-interior-driver-side.webp       Corporate Final CTA
v-class-embassy-entrance.webp           Delegation Hero
s-class-hotel-entrance-vertical.webp    Delegation audience
emplyoee-group-outside.webp             Delegation movement
v-class-on-the-move-veertical.webp      Delegation mixed-fleet story
s-class-interior-1.webp                  Delegation Final CTA
```

This prevents the three Business child pages from becoming visually interchangeable.

## 10. Image handling rules

- Use `astro:assets` through the existing shared component APIs or page-local components.
- Hero loads eagerly through `ServiceHero`; non-Hero editorial images load lazily.
- Preserve intrinsic geometry and responsive image generation.
- Verify generated `srcset`/`sizes`, decoded dimensions, crop and loading behavior at 320, 768, 1024, 1440 and 1920 CSS px.
- Preserve the configured image/route performance budgets and verify that images do not cause avoidable CLS.
- If an asset fails to load, preserve the section geometry and readable adjacent content; never substitute a misleading image at runtime.
- No CSS background image when the existing image component path can serve the role.
- No text baked into images.
- No fake venue logos, conference branding or event names.
- No image implies a service capability that canonical data does not support.
