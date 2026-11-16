# Booking page — implementation and maintenance guide

Status: **DEPLOYED REQUEST FLOW**

This guide describes the current implementation. Use the [blueprint](blueprint.md)
for composition, the [manifest](MANIFEST.md) for existing files, the
[data contract](data-contract.md) for domain rules and the
[forms runbook](../../../../../docs/cloudflare-pages-forms/README.md) for operations.
The former build-from-scratch and disabled-submit plans are retired.

## Scheduling

`contact.bookingLeadTime` owns `publicMinimumHours = 2`,
`timeZone = "Europe/Belgrade"` and `confirmationMode = "manual"`.
The form-kit root exports `resolveZonedDateTime`, `getZonedDateTimeParts`,
`getEarliestBookingSchedule` and `evaluateBookingSchedule`.

Browser and server validate a real instant at least two elapsed hours ahead.
Calendar bounds remain today through the next calendar-year anniversary, with
leap-day clamping. Dates display as `DD/MM/YYYY`, times as 24-hour `HH:mm`, and
payloads remain `YYYY-MM-DD` plus `HH:mm`. Reject nonexistent or ambiguous DST
wall times; never substitute the device timezone or silently change a customer's
selected schedule. Earliest-time guidance rounds upward to a selectable minute.

The controller refreshes guidance on edits, page restoration, focus/visibility
changes and periodic refresh. Final submission revalidates all steps against the
current clock. Return instants must follow departure and remain inside the date
horizon; Airport handoffs and recovered drafts retain their existing strict rules.

## Request-only notices and receipt

Show the localized same-day notice for today's requests and the short-notice
notice for other departures less than 24 hours away. Both the schedule and final
review explain that availability must be checked and submission does not confirm
a booking. Staff notifications mark the urgency. Maintain Serbian Latin, English
and Russian together.

The normal final action is **Send transfer request**; quote intent and
quote-required pricing keep **Request quote**. The actual control is a guarded
`type="submit"` button. JavaScript sends JSON to `/api/forms/booking`; the form
omits native `action`/`method` attributes because the controller owns submission.
Managed Turnstile and the configured build key gate sending. Missing configuration
or failed verification keeps direct-contact recovery available and never displays
an accepted-request receipt.

Only a genuine successful API response with a reference clears contact/free-text
values and the session draft, resets schedules/branches/progress and returns to
Service. Focus moves to visible receipt feedback. Preserve the submitted date,
time, timezone and reference there, with explicit “booking not confirmed” and
team-contact language. Failure preserves values; server schedule errors reopen
Journey with associated feedback. Pending submission locks controls.

## Server validation and retries

The Pages Function enforces bounded JSON, supported locale/envelope, same-origin
and host rules, Turnstile hostname/action, canonical booking validation and
pricing recomputation. Client amounts and qualification flags are not trusted.

For an already accepted booking ID, the pipeline validates with its stored original
`created_at` clock and compares form, locale and keyed normalized-payload digest.
Unchanged retries return the same reference and receipt schedule even after the
cutoff or calendar day passes. New/unaccepted requests use the current server clock;
changed content under an accepted ID is rejected. Schedule classifications do not
enter the immutable payload digest. Uncertain provider outcomes remain protected
from blind automatic resend.

D1 records metadata and provider correlation rather than submitted form content.
The email renderer escapes HTML, supplies plain text and uses the validated
customer address as Reply-To. Provider acceptance does not prove inbox delivery.

## Maintaining the page

1. Read the current authority chain and run exact-target design context before UI/contract work.
2. Change canonical facts or domain mechanisms in their owners; avoid component-level copies.
3. Keep the compact single-panel wizard, completed-step navigation, Back/Edit state, semantic controls, focus and non-PII storage rules.
4. Update affected localized notices, helpers, API adapters and focused regression checks together.
5. Refresh generated contracts through their generators only when authoritative inputs changed.
6. Use the applicable checks for the change. Existing required GitHub checks remain mandatory for publication; document the checks actually run.

The two-hour rollout verified the affected schedule, browser/server, replay,
receipt and localization paths; required PR CI and post-merge Release also passed.
Future verification should cover the exact boundary, midnight/DST, stale editing,
server-clock rejection, successful receipt/reset and accepted-retry identity.
Review all three locales and five reference widths for visible changes. Keep local
mocked delivery distinct from deployed health probes; a real inbox send requires
explicit authorization and a controlled recipient.

Publish through reviewed staging, protected `master` PR checks, successful
Cloudflare deployment and post-deploy acceptance. Preserve noindex booking routes,
preview exclusion, direct-contact fallback and rollback evidence. See the runbook
for environment bindings and the verified release record.
