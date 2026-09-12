# Proposed content schema change

Add a dedicated Booking archetype rather than forcing this page into `contact` or generic `service`.

Conceptual addition to `src/content/schemas/pages.ts`:

```ts
export const bookingPageSchema = pageBase.extend({
  pageType: z.literal("booking"),
  booking: z.object({
    heading: sectionHeadingSchema,
    assuranceTitle: z.string().min(1),
    assuranceBody: z.string().min(1),
  }),
});
```

Add it to `authoredPageSchema`:

```ts
const authoredPageSchema = z.discriminatedUnion("pageType", [
  homePageSchema,
  servicePageSchema,
  hubPageSchema,
  fleetPageSchema,
  pricingPageSchema,
  contactPageSchema,
  bookingPageSchema,
]);
```

Update any route-kind/page-type consistency validator so:

```text
booking -> route kind "page"
```

Do not put field labels, validation messages, service names or pricing-result labels in page Markdown. Those are reusable localized UI strings and belong in `content/ui`.
