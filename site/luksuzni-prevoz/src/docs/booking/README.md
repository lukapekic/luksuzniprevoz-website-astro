# Luxury Transportation — Booking page

Status: **DEPLOYED REQUEST SUBMISSION — MANUAL CONFIRMATION**
Route key: `booking` · Site: `site/luksuzni-prevoz/`

The production page uses the compact, centered four-step wizard defined by the
[blueprint](blueprint.md) and [theme contract](theme-contract.md):

```text
01 Service → 02 Journey → 03 Vehicle → 04 Review & contact
```

The normal final action sends a transfer request through `POST /api/forms/booking`.
Quote intent and quote-required commercial results retain the quote-request action.
Submission never confirms a vehicle, fare or booking; the team checks availability
and contacts the customer before confirming arrangements.

## Current scheduling policy

- `src/data/contact.ts` owns the rolling **two-hour minimum** and `Europe/Belgrade` timezone.
- Browser and server share the pure scheduling helpers from form-kit `0.2.0`; the server clock is authoritative.
- Today is selectable when the requested instant meets the minimum. Midnight does not reset the elapsed-time rule.
- Same-day and sub-24-hour requests display prominent pending-confirmation notices beside the schedule and in the final review, in Serbian Latin, English and Russian.
- Earliest-time guidance rounds upward to a selectable minute. Invalid or ambiguous daylight-saving wall times are rejected.
- Final submission revalidates every step. Airport handoffs, saved drafts and return journeys cannot bypass the policy.

A successful server response supplies the request reference and schedule metadata.
The visible receipt keeps the requested date, time, timezone and reference after
clearing the form. Accepted retries use the stored original validation clock and
keyed payload digest, preserving a received request after its cutoff without
allowing changed content under the same submission ID.

## Sources and maintenance

| Document                                                              | Responsibility                                                   |
| --------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Blueprint](blueprint.md)                                             | Page regions, step flow, current actions and responsive behavior |
| [Manifest](MANIFEST.md)                                               | Existing source ownership and dependencies                       |
| [Data contract](data-contract.md)                                     | Request, pricing, schedule and confirmation rules                |
| [Implementation guide](implementation.md)                             | Maintaining the deployed integration                             |
| [Acceptance contract](acceptance.md)                                  | Checks for affected future changes                               |
| [Theme contract](theme-contract.md)                                   | Existing semantic styling and typography                         |
| [Forms runbook](../../../../../docs/cloudflare-pages-forms/README.md) | Environments, security, delivery, release evidence and rollback  |

Commercial results remain `fixed`, `calculated`, `estimate`, `quote-required` and
`unavailable`. Pending manual confirmation is a submission lifecycle state, not
an additional price state. Pricing comes from canonical data and the resolver.

Localized page content lives in `src/content/pages/booking/`; shared UI copy lives
in `src/content/ui/`. This documentation is not a runtime content source.

## Release and verification

The two-hour release was merged in [PR #40](https://github.com/lukapekic/luksuzniprevoz-website-astro/pull/40)
and deployed on 2026-11-15. Required PR checks and the post-merge Release workflow
passed. Production and staging served the policy in all three locales. A non-sending
production API health probe was rechecked on 2026-11-16; no accepted request or
new inbox delivery is claimed by that probe.

For future changes, distinguish pure/unit checks, intercepted local browser sends,
non-sending deployed health checks and explicitly authorized real delivery tests.
A mocked receipt is not evidence of provider acceptance or inbox delivery.

`wireframe.html` and `proposed-code/` are historical design/drafting references.
They do not own current runtime behavior, component inventory or deployment status;
do not restore their disabled-action or obsolete layout assumptions.
