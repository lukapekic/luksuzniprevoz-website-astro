# Business Transportation Redesign — Required Shared Content Changes

**Status:** REQUIRED

Only these shared content-contract changes are required.

## 1. Add an in-page anchor CTA target

File: `src/content/schemas/shared.ts`

Extend `actionTargetSchema` with:

```ts
z.object({
  type: z.literal("anchor"),
  anchorId: z.string().regex(/^[a-z][a-z0-9-]*$/),
})
```

The target union becomes:

`route | flow | anchor`

Anchor targets store an ID, not a raw URL.

## 2. Resolve anchor CTAs

File: `src/lib/cta.ts`

Update `resolveCtaHref()`:

```ts
if (cta.target.type === "route") {
  return getPath(cta.target.routeKey as RouteKey, locale, routes, defaultLocale);
}

if (cta.target.type === "anchor") {
  return `#${cta.target.anchorId}`;
}

return getPath("contact", locale, routes, defaultLocale);
```

The final branch preserves the current interim flow behavior.

## 3. Add optional hub overview principles

File: `src/content/schemas/pages.ts`

Hub overview becomes:

```ts
overview: z.object({
  heading: sectionHeadingSchema,
  body: z.string().min(1),
  items: z.array(textItemSchema).min(1).max(4).optional(),
}),
```

## 4. Add one optional editorial-section CTA

File: `src/content/schemas/shared.ts`

Extend `editorialSectionSchema` with:

```ts
cta: ctaSchema.optional(),
```

## 5. Do not add presentation fields

Do not add columns, surface, layout, image position, card variant, theme values, breakpoint values, capability booleans, vehicle facts, or client-display flags to content schemas.
