# Delegation Transportation v1 — Asset Contract

Status: **LOCKED**

The coding agent uses the exact owner-supplied paths below.

Missing path = **ASSET BLOCKER**.

Do not rename, duplicate, convert, regenerate, hotlink or substitute assets in this task.

## Hero

```text
src/assets/shared/other/v-class-embassy-entrance.webp
```

Use through shared `ServiceHero`, `imageAlt=""`.

Do not identify the photographed building, flags, country or institution as a client/location claim.

Review crop at 320/768/1024/1440/1920.

Use the reviewed shared `ServiceHero` crop behavior. If the vehicle cannot remain recognisable while the left-side copy stays readable at any required width, raise an asset blocker; do not add page-local raw focal-point values.

## Audience

```text
src/assets/shared/other/s-class-hotel-entrance-vertical.webp
```

Decorative alt. Use through `OpenSplitSection`.

Use the shared 4:3 cover frame with a centered crop at every responsive state. Confirm that the vehicle remains recognisable at all required widths.

## Movement signature supporting media

```text
src/assets/shared/other/emplyoee-group-outside.webp
```

Decorative alt. Secondary to the semantic movement sequence. Do not identify photographed people or vehicles as company staff/fleet.

Use a page-local 4:3 cover frame with a centered crop at every responsive state. The semantic sequence remains the primary information source.

## Mixed-fleet section

```text
src/assets/shared/other/v-class-on-the-move-veertical.webp
```

Decorative alt. Use through `OpenSplitSection`.

Use the shared 4:3 cover frame with a centered crop at every responsive state. Confirm that the moving V-Class remains recognisable.

## Discretion section

```text
src/assets/shared/other/s-class-interior-1.webp
```

Decorative alt. Do not infer exact vehicle specifications from the photo.

Use the shared 4:3 cover frame with a centered crop at every responsive state.

## Institutional client proof

Exactly:

```text
src/assets/clients/chinesee-embassy.png
src/assets/clients/osce.png
src/assets/clients/serbian-swimming-association.png
```

Rules:

```text
localized meaningful alt text
preserve original supplied artwork
no grayscale
no CSS filter
no recolour
no hue rotation
no crop
no distortion
object-fit contain
no outgoing links
no additional client mark
```

Use a light proof surface.

Resolve these files only through `clientLogoMedia` after `getApprovedClientsFor("delegationTransportation")` has returned the approved canonical client records. Page components do not import the files directly.

Do not reuse `BusinessClientProof` because its current grayscale treatment conflicts with this contract.

## Vehicle recommendations

Use canonical repository fleet media for S-Class, E-Class and V-Class.

## Final CTA

```text
src/assets/shared/other/s-class-hotel-entrance-night.webp
```

Pass:

```text
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
```

## Explicitly unused v1 images

```text
embasy-flags.webp
s-class-hotel-front-winter.webp
s-class-interior-2.webp
v-class-interior-1.webp
```

Do not add them solely because they exist.

## Performance

Use `astro:assets`. Hero remains eager/high priority through shared `ServiceHero`. Below-fold media and logos lazy-load. No client-side image JavaScript.
