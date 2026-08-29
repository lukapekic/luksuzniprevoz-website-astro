# Delegation Transportation v1 — Content Contract

Status: **LOCKED**

## 1. Production content targets

```text
src/content/pages/delegation-transportation/
  delegation-transportation.sr.md
  delegation-transportation.en.md
  delegation-transportation.ru.md
```

Serbian is source locale.

All entries remain:

```text
status: in-review
translationState: reviewed
noindex: true
```

until release acceptance passes.

EN/RU `sourceDigest` is generator-owned.

Run:

```bash
pnpm content:sync-digests site/luksuzni-prevoz
```

Do not hand-author the final digest.

## 2. Content ownership

Markdown owns SEO copy, Hero copy/actions, Overview editorial copy, Audience copy, Movement copy, Mixed-fleet editorial copy, Discretion editorial copy, Briefing copy, vehicle-section framing, FAQ questions/non-operational explanations and FinalCTA copy.

UI JSON owns section labels, data-derived capability descriptions, movement stages, discretion trust facts, institutional-proof framing, briefing input labels, vehicle suitability, standards copy and operational FAQ answers.

Typed data owns Delegation booleans, quote-only mode, `securityService=false`, operations standards, discretion-training fact, manual confirmation, fleet facts/media, routes, flow destinations, institutional-client identity and per-route display permission.

`client-media.ts` owns the approved client-mark imports keyed by the stable identifiers in `clients.ts`. Assets own photographic context and mark artwork.

No localized URL appears in Markdown or UI.

## 3. Existing UI keys that MUST be reused

```text
business.coordination.multipleVehicles
business.coordination.mixedVehicleClasses
business.coordination.dedicatedCoordinator
business.hero.trust.manualConfirmation
fleet.class.*
fleet.passengers
fleet.carousel.*
serviceStandards.group.*
operations.chauffeur.*
operations.vehicle.*
operations.service.*
operations.training.discretion
```

## 4. Required editorial section keys

```text
audience
movement
mixedFleet
discretion
briefing
```

Institutional proof uses `getApprovedClientsFor("delegationTransportation")`, `clientLogoMedia` and UI framing strings.

## 5. NDA wording

The packet authorizes only this meaning:

```text
A client can state an NDA or another formal confidentiality requirement in the request.
The condition applies only after both parties agree it in writing before the confirmed engagement.
```

The content does not guarantee that every submitted NDA is accepted.

The content does not claim absolute secrecy.

The content does not equate confidentiality with physical security.

## 6. Institutional client wording

The v1 proof set is exactly:

```text
Chinese Embassy
OSCE
Serbian Swimming Federation
```

Visible framing MUST mean:

```text
Selected institutional clients of Luxury Transportation
```

Do not state that every listed organisation used the identical service configuration described on this page.

Do not write endorsements or testimonials on their behalf.

No logo creates a political-affiliation claim.

## 7. FAQ token contract

Allowed tokens only:

```text
{multipleVehiclesAnswer}
{mixedClassesAnswer}
{coordinatorAnswer}
{groupMovementAnswer}
{ndaAnswer}
{confirmationAnswer}
{securityAnswer}
```

Unknown token = build error.

Unresolved token = build error.

The same resolved array feeds visible FAQ and FAQ structured data.

## 8. Translation rules

Serbian Latin is source.

English and Russian preserve service meaning, CTA hierarchy, security exclusion, NDA non-guarantee, institutional-client framing and manual-confirmation meaning.

Russian uses natural Russian.

Institutional client names and meaningful logo alternative text use the approved canonical `clients.ts` `displayName`; supplied logo artwork remains unchanged.

## 9. Forbidden production wording

```text
security transport
secure convoy
protected transport
close protection
bodyguard
armed escort
police escort
motorcade
classified movement
secret route
guaranteed confidentiality
guaranteed NDA
instant confirmation
fixed Delegation fare
24/7 public-service claim
```

Use:

```text
discretion
confidentiality
professional conduct
coordinated transport
manual confirmation
formal confidentiality requirement
written agreement
```

## 10. Publication

Do not publish one locale independently.

If Serbian source copy changes after translation review, run digest sync and re-review EN/RU before restoring reviewed state.
