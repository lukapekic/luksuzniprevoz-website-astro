# Exceptions & Waivers (FND-META-10)

This file tracks approved exceptions and waivers to the Foundation Template specification.

> **Template projects start with an empty exceptions file.** If your project requires an exception, document it below using the waiver format.

---

## No Exceptions

This project currently has no approved exceptions.

---

## Waiver Format

To request a waiver, create a new section with the following format:

```markdown
### [W-001] Brief Title

- **Rule**: FND-XX-YY
- **Severity**: error | warning
- **Component/Area**: _e.g. Header, /about page, theme tokens_
- **Requested by**: _Name, Date_
- **Reason**: Why the exception is needed. Include context about
  why compliance is infeasible or would cause disproportionate effort.
- **Proposed Mitigation**: What is done instead to reduce risk.
- **Review Date**: When this waiver should be re-evaluated (max 6 months).
- **Status**: proposed | approved | expired
```

### Example Waiver

```markdown
### [W-001] Third-Party Script Without Lazy Loading

- **Rule**: FND-PERF-03
- **Severity**: error
- **Component/Area**: Cookie consent banner
- **Requested by**: Jane Doe, 2025-01-15
- **Reason**: The cookie consent provider (VendorX) requires their script
  to be loaded synchronously to function correctly. The script is 12 KB
  which is under the per-island JS budget, but loads before hydration.
- **Proposed Mitigation**: The script is only loaded for EU visitors
  (geo-targeted via server header). A preconnect hint is added to
  reduce connection time. Performance impact is monitored in CI via
  Lighthouse CI budget.
- **Review Date**: 2025-07-15
- **Status**: approved
```

---

## Expired Waivers

_(Expired waivers are moved here for audit trail.)_
