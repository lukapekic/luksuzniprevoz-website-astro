# Special Events Hub — Acceptance Contract

Route key: `specialEvents`

## A. Authority

- [ ] Root `AGENTS.md` followed.
- [ ] `DESIGN.md` followed.
- [ ] Locked Special Events blueprint followed.
- [ ] Wireframe treated as structural only.
- [ ] Active Theme V2 used without page-local token duplication.
- [ ] Required skills loaded.

## B. Content lifecycle

- [ ] Production page does not use scaffold content.
- [ ] SR entry is complete/approved.
- [ ] EN entry is reviewed.
- [ ] RU entry is reviewed.
- [ ] No invented translations exist in component code.
- [ ] Route is not switched to published before content parity is valid.
- [ ] Noindex/indexability matches lifecycle.

## C. Route + hub integrity

- [ ] `specialEvents` is rendered as a hub.
- [ ] Canonical children are exactly Wedding / Prom / VIP.
- [ ] Child links use route helpers / `<Link>`.
- [ ] No manual locale URL concatenation.
- [ ] Unknown/missing/duplicate child content fails validation or loud renderer checks.

## D. Page structure

Required order:

- [ ] ServiceHero / contained
- [ ] ServiceOverview
- [ ] SpecialEventServiceSelector
- [ ] Event Coordination
- [ ] Other Special Occasions
- [ ] VehicleRecommendations
- [ ] ServiceStandards
- [ ] FAQ
- [ ] FinalCTA

- [ ] Final CTA is not Hero #2.
- [ ] No unapproved duplicate trust/process/pricing section added.

## E. Visual identity

- [ ] Black & Platinum system is intact.
- [ ] Inter Tight computes for headings.
- [ ] Manrope computes for body/UI.
- [ ] No gold/floral/party-limo theme.
- [ ] No SaaS/dashboard cardification.
- [ ] Platinum is restrained.
- [ ] Imagery is contextual and purposeful.
- [ ] Hero is event-neutral rather than wedding-only.

## F. Child-service selector

- [ ] Uses `ServiceCard` or a reviewed extracted selector built on it.
- [ ] Three child services are clearly distinct.
- [ ] CTA is visible.
- [ ] Card surface itself is not an ambiguous invisible link.
- [ ] Mobile does not depend on hover.
- [ ] Images/placeholders follow approved asset contract.

## G. Event capability accuracy

- [ ] Wedding couple/guest/multi-vehicle claims are data-supported.
- [ ] Prom individual/group/multi-vehicle claims are data-supported.
- [ ] VIP discretion/privacy/multi-vehicle claims are data-supported.
- [ ] VIP remains quote-oriented.
- [ ] Waiting is not presented as automatically included.
- [ ] Return capability is not generalized to services that do not own it.
- [ ] No security/bodyguard/close-protection claim exists.
- [ ] No standard decoration/champagne inclusion is invented.

## H. Other occasions

- [ ] Use cases derive from `services.specialEvents.generalUseCases`.
- [ ] Display labels come from approved localization/UI content.
- [ ] No hardcoded English enum labels in production markup.
- [ ] Section is not a generic four-icon-card grid.

## I. Fleet

- [ ] Vehicle IDs come from localized content/canonical data.
- [ ] Vehicle facts come from fleet data.
- [ ] No duplicated capacities/specs.
- [ ] No invented event pricing.
- [ ] Pending fleet verification is respected.

## J. Shared components

- [ ] ServiceHero reused.
- [ ] ServiceOverview reused.
- [ ] VehicleRecommendations reused.
- [ ] ServiceStandards reused.
- [ ] FAQ reused.
- [ ] FinalCTA reused.
- [ ] OpenSplitSection reused where contract fits.
- [ ] No page-local clone of approved shared infrastructure.

## K. Accessibility

- [ ] Exactly one H1.
- [ ] Heading order is logical.
- [ ] 44×44 minimum targets.
- [ ] Focus-visible is clear.
- [ ] Keyboard order follows DOM/visual logic.
- [ ] Images have correct informative/decorative alt behavior.
- [ ] No hover-only information.
- [ ] Reduced motion works.
- [ ] WCAG 2.2 AA contrast.

## L. Responsive

Reviewed at:
- [ ] mobile
- [ ] tablet portrait
- [ ] tablet landscape
- [ ] desktop
- [ ] wide desktop

Checks:
- [ ] no horizontal overflow
- [ ] RU strings do not clip
- [ ] selector topology is readable
- [ ] open split stacks intentionally
- [ ] image focal points remain meaningful
- [ ] text measure stays controlled
- [ ] whitespace is intentional, not excessive

## M. SEO

- [ ] unique localized SEO title/description
- [ ] canonical correct
- [ ] hreflang correct
- [ ] internal links to all three children
- [ ] FAQ schema only through approved helper if used
- [ ] no inappropriate Event schema
- [ ] no fake ratings/reviews/prices

## N. Performance

- [ ] Astro image pipeline used.
- [ ] dimensions/aspect prevent CLS.
- [ ] below-fold images lazy-load where appropriate.
- [ ] hero image policy follows project LCP requirements.
- [ ] no unnecessary `client:*`.
- [ ] performance budget respected.

## O. Verification

- [ ] design context run
- [ ] foundation doctor run
- [ ] types generated/validated
- [ ] theme validated
- [ ] routes validated
- [ ] content validated
- [ ] SEO validated
- [ ] lint passed
- [ ] unit tests passed
- [ ] build passed
- [ ] design review completed
- [ ] technical page review completed

Any unchecked blocking item means the page is not ready for publication.
