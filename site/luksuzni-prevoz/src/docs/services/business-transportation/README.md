# Business Transportation Redesign V2 — Complete Handoff

This package replaces the previous Business Transportation redesign handoff and includes the corrected content/data contract.

## Included files

### Locked page documentation
- `site/luksuzni-prevoz/src/docs/services/business-transportation/blueprint.md`
- `site/luksuzni-prevoz/src/docs/services/business-transportation/acceptance.md`
- `site/luksuzni-prevoz/src/docs/services/business-transportation/implementation.md`
- `site/luksuzni-prevoz/src/docs/services/business-transportation/wireframe.md`

### Replacement page content
- `site/luksuzni-prevoz/src/content/pages/business-transportation/business-transportation.sr.md`
- `site/luksuzni-prevoz/src/content/pages/business-transportation/business-transportation.en.md`
- `site/luksuzni-prevoz/src/content/pages/business-transportation/business-transportation.ru.md`

### Shared content/UI changes
- `site/luksuzni-prevoz/src/docs/services/business-transportation/redesign-content-pack/schema-changes.md`
- `site/luksuzni-prevoz/src/docs/services/business-transportation/redesign-content-pack/ui-additions.sr.json`
- `site/luksuzni-prevoz/src/docs/services/business-transportation/redesign-content-pack/ui-additions.en.json`
- `site/luksuzni-prevoz/src/docs/services/business-transportation/redesign-content-pack/ui-additions.ru.json`

## Canonical corrections included

- Corporate card uses one-off, recurring, invoicing, and negotiated-term capability labels.
- Delegation card uses multiple vehicles, mixed vehicle classes, and dedicated coordination only.
- Delegation security/protection wording is prohibited because canonical `securityService` is false.
- Conference card uses airport arrivals, hotel transfers, venue shuttles, and multi-vehicle schedules.
- Generic Business flight tracking is removed.
- Client proof renders the four owner-confirmed public-display assets; the unapproved Chinese Embassy record stays hidden.
- Business uses the shared full-bleed Service Hero and approved over-Hero Header state.
- Final CTA keeps Request a Quote as the secondary CTA; verified phone/email remain tertiary contacts.
- Fleet role labels live in `content/ui`; canonical fleet facts remain in fleet data.
- Business Standards are data-gated instead of authored as duplicate capability lists.

## Source digest

Packaged EN/RU files currently reference the computed Serbian source digest:

`e7b18ed597e47c9d`

After copying the files into the repository, run the repository-owned digest command:

```bash
pnpm content:sync-digests
```

That command remains authoritative.

## Installation order

1. Replace the four Business Transportation docs.
2. Replace the three Business Transportation locale content files.
3. Apply `redesign-content-pack/schema-changes.md`.
4. Merge each `ui-additions.*.json` object into the matching existing `src/content/ui/*.json`.
5. Run `pnpm content:sync-digests`.
6. Run `pnpm content:validate`.
7. Implement the dedicated Business Transportation renderer from `implementation.md`.
8. Satisfy every item in `acceptance.md`.
9. Run the complete verification gates.

The JSON files in `redesign-content-pack` are merge fragments. Do not replace the existing locale UI dictionaries with these fragments.
