# Fleet Page — Content Schema Changes

**Status:** LOCKED

The existing Fleet schema has a flat `vehicleIds` list. Variant 1 requires model-family chapters, including one V-Class chapter backed by two canonical records.

Apply the following Fleet-only schema extension in `src/content/schemas/pages.ts`.

## New Fleet profile schema

```ts
const fleetProfileSchema = z.object({
  key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/),
  vehicleIds: z.array(vehicleIdEnum).min(1).max(2),
  summary: z.string().min(1),
  bestFor: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(2).max(3),
});
```

## Replace Fleet section shape

Replace:

```ts
fleetSection: z.object({
  heading: sectionHeadingSchema.optional(),
  vehicleIds: z.array(vehicleIdEnum).min(1),
}),
```

with:

```ts
fleetSection: z.object({
  heading: sectionHeadingSchema.optional(),
  profiles: z.array(fleetProfileSchema).length(6),
}),
```

Keep:

```ts
hero;
introSection;
sections;
faq;
finalCta;
```

under the existing Fleet archetype.

## Locked profile keys

All locales MUST contain these exact profile keys and order:

```text
mercedesSClass
mercedesEClass
skodaSuperb
skodaKodiaq
mercedesVClass
mercedesSprinter
```

## Locked ID cardinality

```text
mercedesSClass
  [mercedes-s-class]

mercedesEClass
  [mercedes-e-class]

skodaSuperb
  [skoda-superb]

skodaKodiaq
  [skoda-kodiaq]

mercedesVClass
  [mercedes-v-class-6-plus-1-extra-long,
   mercedes-v-class-7-plus-1-extra-long]

mercedesSprinter
  [mercedes-sprinter]
```

## Ownership

`summary`, `bestFor`, and `highlights` are editorial suitability copy.

They MUST NOT contain:

- passenger numbers;
- numeric prices;
- vehicle class enum labels;
- model year claims;
- luggage litre values;
- unverified equipment.

Those facts stay canonical or data-gated.

## Sections

Fleet candidate content requires:

```text
sections[key=chooseRightVehicle]
```

with exactly four items.

No new generic schema is created for the Fit Guide; the existing editorial section shape is sufficient.

## Validation

Page code MUST fail loudly if:

- a required profile key is missing;
- profile order differs;
- V-Class does not contain exactly two IDs;
- any non-V-Class profile contains more than one ID;
- a profile points at a Fleet-page presentation entry with `showOnFleetPage: false`;
- `chooseRightVehicle` is missing;
- Fit Guide item count differs from four.
