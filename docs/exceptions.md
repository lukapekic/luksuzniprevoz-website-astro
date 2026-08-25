# Exceptions & Waivers (FND-META-10)

This is the canonical repository waiver registry parsed by `pnpm parse-waivers`.

It is for explicit exceptions to `FND-*` foundation rules. It is **not** a place to bypass `DESIGN.md`, locked blueprints, accessibility requirements, or deterministic design-governance findings merely for convenience.

## No approved exceptions

This project currently has no approved waiver entries.

## Rules

- `FND-A11Y-01` is non-waivable.
- Approved waivers must include a review date.
- Review dates may be at most six months from the request/review point enforced by the parser.
- Expired waivers must be marked `expired` or renewed through an explicit review.
- Do not change field names below: `scripts/parse-waivers.ts` parses them mechanically.
- A waiver documents risk acceptance; it does not change the underlying rule or design-system authority.

## Waiver format

Create real waiver entries as top-level `### [W-NNN]` sections using exactly these fields:

```markdown
### [W-001] Brief Title

- **Rule**: FND-XX-YY
- **Severity**: error | warning
- **Component/Area**: Header, route, validator, theme tooling, etc.
- **Requested by**: Name, YYYY-MM-DD
- **Reason**: Why compliance is currently infeasible or disproportionate.
- **Proposed Mitigation**: What reduces the resulting risk.
- **Review Date**: YYYY-MM-DD
- **Status**: proposed | approved | expired
```

## Example only

The fenced example below is intentionally ignored by the parser.

```markdown
### [W-001] Temporary Third-Party Loading Exception

- **Rule**: FND-PERF-03
- **Severity**: warning
- **Component/Area**: Third-party integration
- **Requested by**: Example Owner, 2026-08-25
- **Reason**: Vendor integration temporarily cannot use the preferred loading strategy.
- **Proposed Mitigation**: Scope the integration, measure its impact, and replace it before the review date.
- **Review Date**: 2026-11-25
- **Status**: proposed
```

## Active waivers

_Add real approved/proposed entries here when needed._

## Expired waivers

_Move expired entries here and keep `Status: expired` for audit history._
