# VIP Transportation — Content Schema Changes

**Status:** NO PAGE-SCHEMA CHANGE REQUIRED

The existing `servicePageSchema` and shared editorial-section schema already support the complete VIP content contract:

- optional Hero;
- `overview` heading/body/items;
- keyed editorial `sections` with heading/body/items/CTA;
- up to four `vehicleRecommendations.vehicleIds`;
- FAQ;
- Final CTA.

Do not add VIP-only fields to `src/content/schemas/pages.ts` or `src/content/schemas/shared.ts`.

The signature Discretion message remains authored through the existing section heading/intro/body contract. Aviation uses the existing editorial section CTA. Contextual image selection remains component/blueprint-owned and is not encoded as layout data in Markdown.

## Required non-schema changes during implementation

1. Replace the three VIP scaffold entries with the supplied service entries.
2. Merge the supplied `vip.*` UI keys into all three UI dictionaries with key parity.
3. Run `pnpm content:sync-digests`; the tool owns EN/RU `sourceDigest` values.
4. Validate all content before publishing the route.
5. Change `vipTransportation.availability` from `scaffold` to `published` only after SR/EN/RU pass validation.
6. Add the dedicated page renderer and tests.

If implementation discovers a genuine content-model requirement that cannot be represented by the current schema, STOP and amend the locked blueprint before changing the schema. Presentation convenience is not a valid reason for schema expansion.
