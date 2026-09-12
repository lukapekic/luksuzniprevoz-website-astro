# Fleet Page — Canonical Data Contract

**Status:** LOCKED DATA CHANGE

This file resolves the Kodiaq conflict with the current fleet↔pricing invariant without inventing price data.

## 1. Fleet model

### VehicleClass

Change:

```ts
export type VehicleClass = "sedan" | "suv" | "van" | "minivan" | "bus";
```

### PricingStatus

Add:

```ts
export type VehiclePricingStatus = "published" | "quote-only";
```

Extend `Vehicle`:

```ts
pricingStatus: VehiclePricingStatus;
```

### VehicleId

Add:

```text
"skoda-kodiaq"
```

### Kodiaq canonical record

Add in the locked Fleet-page order after Superb:

```ts
{
  id: "skoda-kodiaq",
  displayName: "Škoda Kodiaq",
  vehicleClass: "suv",
  passengers: null,
  pricingStatus: "quote-only",
}
```

`passengers: null` is mandatory until the owner supplies the actual chauffeur-service passenger limit.

Manufacturer seating capacity does not authorize an operator capacity.

### Existing vehicles

Add:

```ts
pricingStatus: "published"
```

to every existing vehicle.

No existing passenger value changes.

## 2. Pricing model

The current type:

```ts
Record<VehicleId, VehiclePricing>
```

cannot represent a real fleet vehicle whose owner-confirmed price is not yet supplied.

Change the pricing storage contract to:

```ts
Partial<Record<VehicleId, VehiclePricing>>
```

This is not permission for arbitrary missing prices.

### Consistency invariant

Replace “every fleet vehicle must be priced” with:

1. every vehicle with `pricingStatus === "published"` MUST have a pricing record;
2. every vehicle with `pricingStatus === "quote-only"` MUST NOT require a numeric pricing record;
3. every pricing key MUST refer to a canonical fleet vehicle;
4. no duplicate or unknown vehicle IDs are permitted;
5. adding numeric pricing for a quote-only vehicle requires changing that vehicle to `published` in the same change.

### getPricing

Do not return an unsafe undefined value.

Use one explicit contract:

```ts
export function getPricing(id: VehicleId): VehiclePricing | null
```

Return `null` for quote-only vehicles without numeric pricing.

Every consumer MUST branch on null before arithmetic or formatted price output.

## 3. Existing price rows

Do not modify the current numeric values for:

- Škoda Superb
- Mercedes E-Class
- Mercedes V-Class 6+1 Extra Long
- Mercedes V-Class 7+1 Extra Long
- Mercedes Vito Tourer 8+1
- Mercedes S-Class
- Mercedes Sprinter

Kodiaq receives no fabricated row.

## 4. Fleet page behavior

Fleet page:

- renders Kodiaq because it is canonical fleet data;
- does not show numeric price;
- does not show passenger capacity while null;
- does not display a public “unknown” marker.

Pricing page / booking:

- continue to show current published rows;
- Kodiaq follows quote-only handling until pricing is owner-supplied.

## 5. Future Kodiaq completion

When owner-confirmed data is supplied:

1. set Kodiaq `passengers` to the real service capacity;
2. add exact Kodiaq `VehiclePricing`;
3. set `pricingStatus: "published"`;
4. update pricing source documentation;
5. run all drift guards and pricing tests.

Do not alter Fleet editorial content merely to inject those operational facts. The page resolves them from canonical data.
