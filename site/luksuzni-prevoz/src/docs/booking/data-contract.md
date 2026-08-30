# Booking Page — Data & Pricing Contract

Status: **LOCKED DOMAIN CONTRACT**

This file owns the new booking-domain boundary required by the Booking page.

Presentation components MUST NOT contain fare formulas or service-routing logic.

---

# 1. Existing authoritative data

Keep these owners:

```text
services.ts
pricing.ts
fleet.ts
contact.ts
operations.ts
routes.ts
flows.ts
```

Do not duplicate them into `booking.ts`.

`booking.ts` owns only booking-request vocabulary, step state, intent and cross-data references.

---

# 2. Required pricing metadata change

Current `pricing.ts` explicitly stores Airport fare currency as EUR but the other tariff numbers have no currency field.

Before the booking page exposes hourly/half-day/full-day amounts, add canonical currency metadata.

Preferred contract:

```ts
export type PricingCurrency = "EUR";

export interface VehiclePricing {
  vehicleId: VehicleId;
  currency: PricingCurrency;
  hourly: number;
  halfDay: number;
  fullDay: number;
  perKm: number;
  airportTransfer: {
    amount: number;
    currency: PricingCurrency;
    scope: "belgrade-airport-to-belgrade-city";
  };
}
```

Do not hardcode `EUR` in the Booking UI.

---

# 3. Per-km hard gate

`perKm` exists in authoritative pricing facts, but V1 does not have a canonical applicability contract.

Therefore:

```text
DO NOT expose /km as a customer-selectable booking tariff.
DO NOT compute Business price as distance × perKm.
DO NOT compute excess half/full-day km using perKm.
```

A future business-data change must define applicability explicitly before the resolver uses it.

Suggested future typed field, only after owner confirmation:

```ts
perKmPolicy: {
  applicability: "...owner-confirmed-vocabulary...";
  billingDistance: "...owner-confirmed-vocabulary...";
  minimumFare?: number;
}
```

---

# 4. Half/full-day excess-km hard gate

The source provides:

```text
Half Day  -> 5 h / 100 km included
Full Day  -> 10 h / 200 km included
```

It does not define excess-km or overtime arithmetic.

Resolver behavior:

```text
distance known and <= limit   -> calculated flat package fare
distance unknown              -> estimate/base package fare
distance known and > limit    -> quote-required
```

Do not infer `excess km × perKm`.

---

# 5. Hourly behavior

Canonical current service contract:

```text
minimumHours = 1
publishedKmLimit = null
```

V1 hourly resolver:

```text
hourly tariff × whole booked hours
```

Whole-hour increments are the V1 input contract because no smaller billing increment is defined.

Do not add 30-minute increments without a new owner-confirmed rule.

If the booking is multi-day or international, result becomes quote-required before arithmetic is exposed as final booking pricing.

---

# 6. Airport behavior

Canonical exact scope:

```text
Belgrade Nikola Tesla Airport <-> Belgrade city
single direction
per vehicle
```

Resolver returns `fixed` only when scope is validated.

Customer scope input is an explicit required enum:

```ts
type AirportScope = "belgrade-city" | "other";
```

`belgrade-city` may qualify for the fixed fare when all other conditions pass.
`other` is always `quote-required`. Do not infer this choice from pickup or
destination free text, and do not accept a client-supplied qualification flag.

V1 return handling:

```text
return requested -> quote-required
```

Do not assume `one-way × 2`.

V1 outside-scope handling:

```text
outside validated city scope -> quote-required
```

Do not stretch the Airport fare to other Serbian cities.

---

# 7. Fixed routes from Belgrade

`src/docs/pricing.csv` also contains `PUTEVI IZ BEOGRADA`.

This table remains unavailable to V1 resolver because it has no typed source owner.

Recommended future module:

```text
src/data/route-pricing.ts
```

Required shape before use:

```ts
interface FixedRoutePrice {
  origin: "belgrade";
  destinationId: ...;
  vehiclePricing: Partial<Record<VehicleId, Money>>;
  currency: "EUR";
  directionPolicy: ...;
  returnPolicy: ...;
}
```

Do not parse CSV at runtime.

---

# 8. Booking request union

Use a discriminated union by concrete service.

Minimum families:

```text
private-chauffeur
airport
corporate
delegation
conference-congress
wedding
prom
vip
other-special-event
```

Shared fields stay small.

Service-specific fields remain inside their discriminated member rather than one giant object with dozens of optional values.

Keep partial and complete state distinct:

```text
BookingDraft    -> partial browser planning state
BookingRequest  -> complete validated discriminated request
```

Pricing resolution accepts `BookingRequest`. While the draft is incomplete,
the derived pricing result is `null`; incomplete input is not `unavailable`.

---

# 9. Pricing result union

Required:

```ts
type BookingPricingResult =
  | FixedPricingResult
  | CalculatedPricingResult
  | EstimatePricingResult
  | QuoteRequiredPricingResult
  | UnavailablePricingResult;
```

Every priced result carries:

```text
vehicleId
currency
amount
source
```

Calculated result additionally carries transparent arithmetic metadata.

Estimate additionally carries an estimate reason.

Quote-required carries a machine-readable reason code but no amount.

Unavailable carries a recovery/blocker code.

---

# 10. Quote reason vocabulary

Initial allowed reasons:

```text
multi-day
international
outside-airport-scope
airport-return-policy-undefined
package-distance-exceeded
business-estimate-policy-undefined
multiple-vehicles
complex-itinerary
quote-only-service
vehicle-recommendation
```

UI maps reason codes to localized copy where a reason needs to be shown.

Do not expose raw enum values.

---

# 11. Distance provider boundary

Distance is optional in V1 domain state.

If future implementation introduces a routing provider, use an abstraction:

```ts
interface BookingDistanceResult {
  distanceKm: number;
  source: "approved-routing-provider";
}
```

The provider is not allowed to decide price.

It returns distance only. `booking-pricing.ts` remains the pricing authority.

Trusted provider output belongs to resolver context, not `BookingRequest`,
query parameters, or persisted customer state.

If the provider is unavailable, half/full-day falls back to estimate, not an invented distance.

---

# 12. Vehicle eligibility

Use `fleet.ts` passenger capacity only.

```text
capacity known and passengerCount > capacity -> vehicle not eligible
capacity null -> keep eligible; manual review
```

Luggage count is collected but does not automatically filter because luggage capacity is not canonical today.

---

# 13. Multiple vehicles

Multiple-vehicle request is allowed only when canonical service capability supports it.

It does not mean exact arithmetic exists.

V1:

```text
multiple vehicles -> quote-required
```

This prevents misleading sum-of-card prices for coordinated services.

---

# 14. Confirmation lifecycle

Canonical `contact.ts` says:

```text
confirmationMode = manual
```

Future submission lifecycle:

```text
draft
submitting
submitted-pending-confirmation
submission-error
```

There is no `confirmed` client-side state.

Confirmation belongs to a later business process outside the public request form.

The current public-testing release does not implement submission lifecycle
states. It renders a disabled intended final action and a verified direct-contact
recovery path. Cloudflare submission is a separate implementation phase.

---

# 15. Lead time

Use canonical `publicMinimumHours` and `timeZone` from
`contact.bookingLeadTime`.

Current time zone:

```text
Europe/Belgrade
```

Client validation and server validation both enforce the same value.

Client validation must interpret the entered local date/time in this zone,
not in the browser or device zone. Future server validation repeats the same
conversion authoritatively.

The server is authoritative.

Do not serialize a bypass flag from the browser.
