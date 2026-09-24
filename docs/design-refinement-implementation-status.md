# Design refinement implementation status

Branch: `codex/design-refinement-dr06-dr12`
Source: `docs/project-starter/luksuzniprevoz-design-refinement-handoff/luksuzniprevoz-design-refinements/luksuzniprevoz-design-refinement-backlog.md` (DR-06–DR-12)

The owner confirmed that the chauffeur photograph is `site/luksuzni-prevoz/src/assets/sections/home/private-chauffeur.webp`. This replaces the handoff's unavailable `b58da850-396c-46da-a528-4143ea28d859.webp` filename. The source is 1200×800 WebP and currently appears in the larger homepage chauffeur feature; implementation moves it to the service card and uses the approved passenger-at-work photo for that feature.

| Phase | Scope | Status | Commit |
| --- | --- | --- | --- |
| 0 | Authority/contract and asset reconciliation | Complete; contract migration and corrected chauffeur path recorded | `8b0bd82` |
| 1 | Public identity and three-tier footer | Complete; canonical brand, approved symbol, four navigation groups, inline locales, shared footer and assertions updated | `7e32401` |
| 2 | Universal fleet card and family adapter | Complete; shared card in Home/services, typed family and airport fare projection, updated carousel sizing and focused unit assertions | `61b2880` |
| 3 | Booking panel, progress, summary, and date/time | Implemented; single panel, validated step controls, compact review, explicit date/time adapter and return chronology; final verification pending | `f8dabb7` |
| 4 | Image assignments, delivery policy, and full-width Final CTA | Implemented; selected images, source-capped role policies, natural treatments, and one interior closer across 13 consumers; final verification pending | Phase 4 commit |
| 5 | Final automated tests, browser review, fixes, and governance evidence | Pending | — |

Test cases and automated browser testing are deferred to phase 5 at the owner's request. Design-context preflight for Home, Booking, SiteFooter, and FinalCTA reported a current Theme V2 snapshot; `components:check` reported 31 current shared components. Each completed phase gets a scoped commit and push; pre-existing Lighthouse outputs remain outside this branch.

Phase 1 generated localization types after removing obsolete parent-brand keys and preserved the existing verified contact gating. The retired GS mark component and GS favicon source were removed from tracked production assets; git history retains both. Final quality gates and rendered/browser evidence remain deferred to phase 5.

Phase 2 registered `FleetCard` as a new shared component (32 registry entries), refreshed the design snapshot after the brand/config change, and retained service suitability prose in a labelled section-level list. `VehicleRecommendations` accepts its prior `displayName` and `showPassengerCapacity` input shape for compatibility with existing callers, but canonical family names/capacity now come from the shared adapter. Existing Fleet detail, pricing, and booking configuration records remain unchanged.

Phase 3 retained the existing `/api/forms/booking` controller, Turnstile protection, handoff/draft flow, and canonical date/time payload. The visible date is typed as `DD/MM/YYYY`; hour/minute selects span all 24 hours and 60 minutes. Native calendar popup enhancement was not added because manual entry is the guaranteed path and the handoff treats the popup as optional. Browser/automation and locale review remain in Phase 5.

Phase 4 migrates the selected corporate, VIP, Special Events, and Homepage chauffeur images without changing originals. The incoming CTA source measures 2400×1600, so its candidate ladder is capped at 2400 rather than the handoff's earlier 2048 example. The reserve files `pexels-oneilgonzales-11373655.webp` and `vadym-kudriavtsev-4uCykQ0fNhY-unsplash.webp`, plus two unassigned incoming photos, remain untracked and unplaced. `FinalCTA` removes its legacy image/treatment props; the 13 production callers and development preview now use the common closing-media assignment. Shared component registry and design snapshot were synchronized after the new component/transitive changes. New image crops, candidate selection, contrast, and payload are to be reviewed in Phase 5.
