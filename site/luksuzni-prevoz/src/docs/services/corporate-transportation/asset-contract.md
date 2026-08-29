# Corporate Transportation — Image Slot Contract

The implementation uses exactly three locked contextual assets from the existing
shared image pool. Source files are imported in place and are never duplicated
into a Corporate-specific directory.

## Hero

Locked source:

```text
src/assets/shared/other/chauffeur-inside-grayedout.webp
```

Required character:

```text
chauffeur/executive arrival or departure
modern office/hotel/business architecture
professional business context
premium and discreet
room for full-bleed Hero text
```

Avoid:

```text
taxi/rideshare appearance
party limousine styling
security/bodyguard implication
prominent non-fleet branding
testimonial-like framing
watermarks
```

## Working Day

Locked source:

```text
src/assets/shared/other/s-class-driving-forest-intheback.webp
```

Required character:

```text
executive or business guest in rear cabin
work / call / preparation / quiet travel
credible premium corporate context
```

## Final CTA

Locked source:

```text
src/assets/shared/other/s-class-interior-driver-side.webp
```

Use through shared `FinalCTA` with:

```text
imageAlt=""
imageFit="cover"
mediaTreatment="integrated"
```

The caller imports and supplies the decorative image. The shared component
must not select or import a fixed vehicle asset.

## Integration rule

Use the existing `ServiceHero` treatment for the Hero and the existing
`OpenSplitSection` media handling for Working Day. Do not create page-local
copies, rename or convert the WebP files, hardcode browser `/src/assets/...`
URLs, or retain the obsolete JPG placeholder paths.

The following shared images remain reserved for later Business-family work and
are not additional Corporate sections:

```text
src/assets/shared/other/v-class-interior.webp
src/assets/shared/other/v-class-on-the-move-veertical.webp
```

Do not use the restricted Maybach-like, third-party-branded or London-context
images identified in the owner asset brief for Corporate production.
