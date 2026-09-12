# Proposed route / flow changes

## `src/data/routes.ts`

Add:

```ts
booking: {
  kind: "page",
  availability: "published", // activate atomically with schema, content, renderer, and CTA migration
  parent: null,
  slugs: { sr: "rezervacija", en: "booking", ru: "bronirovanie" },
  noindex: true,
  sitemap: { include: false, priority: 0 },
},
```

Do not use folder paths as URLs.

## `src/data/flows.ts`

Change:

```ts
const flowTargets: Record<FlowKey, FlowTarget> = {
  booking: { routeKey: "booking", intent: "booking" },
  quote: { routeKey: "booking", intent: "quote" },
};
```

Preserve the existing canonical CTA-resolution helper behavior.

## Handoff query

The Booking page may accept only:

```text
intent
service
flightNumber
date
time
```

The URL remains a handoff mechanism, not a serialized booking object.

## Existing Airport booking start

Keep its current GET handoff behavior, but change the resolved action to the canonical Booking flow target. Existing field names already align with the proposed handoff:

```text
service=airportTransportation
intent=booking
flightNumber
date
time
```

Do not add a duplicate Airport-specific detailed form.
