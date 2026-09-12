# Execution log

## 2026-09-11 — Setup

- User authorized autonomous content writing, editorial approval, multilingual
  application, seven-competitor Serbian-market SEO research, technical SEO and
  JSON-LD review, and a final content upgrade informed by research.
- Created `feature/content-seo-finalization` from `65398a3`.
- Found root `.env` untracked and not ignored; added secret-file ignore rules.
- Added the durable execution workflow and status record.
- Next: governance preflight, baseline/data inspection, first multilingual batch.

## First multilingual batches

- Fleet/Pricing: removed internal data terminology and unsupported physical
  vehicle claims; clarified pricing, capacity checks and quote handling.
- Booking/Contact: removed staging/future promises, unsupported two-hour response
  SLA and saved-data claims; clarified request/confirmation and recovery actions.
- Private Chauffeur/Airport: reduced adjacent repetition, explained aviation
  terminology and qualified custom/international arrangements.
- Standardized booking-entry actions across locales; Serbian uses polite plural.
- Added airport FAQ `{minutes}` in all locales; renderer/schema interpolation is
  a tracked technical dependency before validation.
- Baseline site build passed: 43 pages. Root `.env` loads the key and is ignored.
- Preflight reported a stale snapshot; regenerated it with `pnpm design:sync`.
- Next: remaining business/event/home copy, full UI language pass, SEO research.


### SEO implementation and final language review

Compared seven local providers using observed organic rankings and public search
crawler extracts. All seven direct HTML fetches were verification challenges,
so their raw technical-head values are classified unknown, not missing.
Completed 42 ValueSERP attempts: 15 successful, 27 failed; no automatic retries.
The direct-provider collector made one 42-query sequential collection rather
than respecting the planned 12-query batch size. This is a recorded workflow
deviation; it stayed below the 60-query total ceiling. Future CLI runs retain
the configured 12-query limit. Actual billable credits are not inferred from
request counts. No additional paid calls are planned.

Updated 45 metadata records and the final multilingual copy. Corrected Russian
false friends and agreement, Serbian terminology, booking/error wording and
numeric units. Review dates reflect AI editorial review on 2026-09-11; source
digests synchronized after comparing translations against the updated Serbian.
Owner final review remains outstanding as requested.

Technical changes: contextual safe JSON-LD, verified LocalBusiness data and
opening hours, homepage WebSite, breadcrumb/FAQ alignment, OG/Twitter defaults,
route noindex defence, airport waiting interpolation, localized place/institution
names, and unavailable-link handling. Business blueprint and header contract
record the narrow enquiry-destination exception. No child page was published.

Browser checks found a missing sitemap despite the robots reference. Added static
XML outputs from route/content publication gates, with reciprocal locale links.
No runtime endpoint or deployment was introduced. Initial site checks exposed
and then corrected a breadcrumb property/label mismatch and a booking-service
type mismatch. Initial browser tests also exposed an incorrect test assumption
about existing title-brand deduplication; the regression now checks one brand.
Full release and browser gates are in progress; no passing claim made yet.

## Final verification and rendered review

- Root `quality:release` completed successfully, including 45/45 SEO entries with
  no issues, lint, types, unit tests, site build and secret scan. Its nonblocking
  dependency audit reports 16 advisories (1 critical); this is not a clean audit.
- Built SEO research requires emitted HTML. `--all --mode built` correctly failed
  on the two scaffold route families. Corrected the audit to 36 published targets
  in built mode and all 42 research targets in offline mode. Both use skip-SERP
  and skip-competitors flags and spend no further provider queries. All completed
  built reports had zero foundation issues and valid JSON-LD.
- The initial broad browser run was interrupted after WebKit repeatedly failed
  to launch because system libraries are absent. No browsers/packages were installed.
  Some initial 404/form failures also resulted from overlapping builds replacing
  test output. Later browser runs own their build exclusively. A built-research
  attempt overlapping a browser build also failed on a missing artifact and was
  rerun after the build completed; it is not recorded as a successful audit.
- Corrected old tests that expected pre-existing generic booking links, obsolete
  manual-confirmation wording or unsupported driving-experience claims. The new
  SEO suite checks all 39 published route/locale documents and their internal
  link graph, plus the sitemap and six unpublished document exclusions.
- Homepage decorative image scaling caused real horizontal overflow; added a
  media-only clipping wrapper after source diagnosis, preflight and contract
  review. Content/focus layers and composition remain intact. The small-ui
  profile passed. AI screenshot review covers all five governed widths; shortened
  homepage headings and the Russian Fleet heading to avoid unwieldy wrapping.
- Axe now waits for real homepage reveals/animations to settle with motion enabled.
  No contrast rule is disabled. The target-size helper waits for finite animations
  to settle before measurement; the strict 44px comparison is unchanged.
  Lazy-image checks poll decode completion instead of sampling immediately after
  scrolling. These fix measurement races without hiding substantive UI failures.
- Page and Footer component profiles, homepage small-ui, routing-content and final
  Airport page profile passed. The theme profile rejected foundation.config.ts as
  outside its supported UI roots; the corrected invocation targets its affected
  Page.astro head surface and still validates configured theme consistency.
- Final exact command results, visual observations and any remaining limitations
  are stored in verification.json. The reviewed file manifest is changed-files.json.

## Lighthouse correction

The initial 18-run Lighthouse audit returned 100 for SEO/accessibility/best practices
but failed the separate LCP budget on `/` (2.564s) and `/ru/` (2.785s). Source/network
inspection led to HomePage using the already-supported image-LCP font-preload
opt-out. The Russian probe passed at 1.529s LCP and four category scores of 100.
No font declarations, visual tokens, image quality or thresholds were changed.
The complete six-URL audit was then rerun. An earlier temporary-server attempt
selected pnpm 11 outside the repository; setting the server working directory to
the repository restored its required pnpm 10.14.0, without bypassing the version check.

The final configured Lighthouse command exited 0. Its configured aggregation
passes the hard assertions, with nonblocking FCP warnings. The Serbian homepage's
three-run median LCP remains about 2.64s even though the selected aggregate passes;
this variability is retained in verification.json rather than described as every
sample meeting 2.5s. SEO, accessibility and best-practices scores are 100 across
all six page/locale combinations. Performance medians are 94–99.
