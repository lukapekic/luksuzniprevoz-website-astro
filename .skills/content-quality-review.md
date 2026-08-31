---
name: content-quality-review
description: Use to audit, propose, or apply improvements to existing localized website copy before the final SEO pass. Covers factual support, user usefulness, clarity, brand voice, conversion, accessibility, consistency, and native-facing localization without inventing facts or redesigning pages.
source-of-truth: AGENTS.md
---

# Content Quality Review

## Purpose and modes

Use after page structure and copy exist, before final SEO optimization. Make content specific, credible, restrained, useful, premium, accessible, and conversion-aware without redefining product truth, design, routing, schema, or SEO strategy.

- **Audit/proposal mode is the default.** Inspect and recommend; do not edit files unless the user requests implementation.
- **Apply mode** makes the smallest authorized editorial edits, then verifies them.
- A review request does not authorize lifecycle certification, schema work, route changes, or unrelated rewrites.

## Authority and preflight

Read the smallest relevant chain:

1. `AGENTS.md`
2. `docs/content-authoring.md`
3. approved page blueprint/content contract
4. relevant verified `site/luksuzni-prevoz/src/data/*`
5. content schema, renderer, interpolation source, and UI keys used by the surface
6. current localized content
7. this skill

State the target page or corpus, locales, user task, and mode before reviewing. Higher authority wins.

## Boundaries

Editorial/localized copy belongs in `src/content/`; reusable interface strings belong in `src/content/ui/`; operational truth belongs in typed `src/data/*`. Do not duplicate typed facts where the model references stable IDs.

May improve headings, intros, sections, cards, FAQs, captions, alt text, UI copy, and CTA labels. Must not change routes, typed IDs, route/flow targets, lifecycle fields, image structure, schema fields, locked hierarchy, components, or presentation without separate authorization. Never invent or strengthen prices, capacities, availability, timings, guarantees, clients, policies, coverage, statistics, awards, security, support, or operational limits.

Record unverifiable needs only in review notes as `[CONTENT INPUT REQUIRED: <exact missing fact>]`; never insert that marker into production content.

## Review procedure

1. **Composed surface:** Read the whole customer-facing page, not isolated YAML. Trace copy combined from Markdown, typed data, UI dictionaries, interpolation, and component output. Inspect rendered output when available.
2. **User task:** State what the visitor must understand, compare, decide, or do. Each major section must advance that task; remove copy that only fills layout space.
3. **Claim evidence:** For material claims, record `claim → source file/field → verified | conditional | unsupported | contradicted`. Treat negative facts and conditions as authoritative. Never turn possibility, quote handling, or manual confirmation into a promise.
4. **Clarity and accessibility:** Prefer familiar words, concise natural sentences, literal instructions, descriptive headings, meaningful CTA/link labels, explained jargon, and useful informative alt text. Decorative images keep empty alt according to their contract.
5. **Specificity and value:** Replace generic praise with verified process, vehicle role, coordination method, booking rule, policy, or proof. Explain why a feature matters when the benefit is not obvious.
6. **Conversion and objections:** Confirm the page explains scope, audience, coordination, limitations, next step, and when booking, quote, pricing, fleet, or contact is appropriate. Do not use artificial urgency or fear.
7. **Brand voice:** Use professional confidence, discretion, calm authority, and premium restraint. Luxury comes from precision, coordination, comfort, suitability, and reliability—not adjective volume. Remove unsupported superlatives, forced emotion, cliché, and status signalling.
8. **Human polish:** Improve rhythm and continuity. Treat repeated em dashes, slogan triplets, mirrored constructions, `whether...or...`, `designed to`, and generic summaries as diagnostic signals, not automatic deletion rules.
9. **Repetition:** Distinguish necessary shared operational truth from harmful boilerplate. Within a page, each section adds information. In corpus reviews, compare sibling routes for audience, unique scope, proof, objections, CTA, and duplicated FAQs or claims.
10. **CTA integrity:** Labels describe the real next action and still match their typed target. Do not imply instant confirmation, fixed price, availability, or response time without explicit support.

## Tokens and localization

Preserve every expected interpolation token and compare token sets across corresponding locale fields. Check resolved wording with representative values; token validity does not guarantee natural grammar, plural forms, units, or punctuation.

Treat Serbian Latin, English, and Russian as native-facing copy, not literal translations. Preserve facts, qualification, CTA intent, section purpose, and content order while allowing native syntax. Flag uncertainty when native-quality review is unavailable.

Do not change `translationState` to `reviewed` or refresh `reviewedOn` without real language review. Digest handling is conditional:

- no content edit: do not run `content:sync-digests`;
- source-only edit: do not sync away staleness; leave or demote affected translations to `draft` and report them;
- genuinely retranslated and reviewed locales: update truthful lifecycle metadata, then sync digests.

## SEO handoff

Keep required SEO frontmatter valid, but do not perform keyword-density work, manufacture location repetition, add FAQs only for search coverage, or change canonical/hreflang/schema strategy. If visible-copy changes alter the offer, audience, location, H1 meaning, or service scope, flag metadata and search-intent alignment for the final SEO pass.

## Report contract

For audit mode, report each material finding with priority (`P0` false/risky, `P1` blocks understanding or action, `P2` polish), exact file/field, issue, repository evidence, proposed replacement/action, confidence, and dependency. Also report the page intent, claims checked, locale concerns, retained intentional repetition, content inputs required, and SEO deferrals. Say when no change is recommended.

For apply mode, additionally report files changed, strongest improvements, claims removed/softened/flagged, lifecycle decisions, and unresolved items.

## Verification for edits

Run applicable checks and report only commands actually executed:

```bash
pnpm content:validate site/luksuzni-prevoz
pnpm seo:validate site/luksuzni-prevoz
pnpm --filter @luksuzni-prevoz/site check
pnpm --filter @luksuzni-prevoz/site build
```

Run `pnpm content:sync-digests` only in the reviewed-translation case above. `seo:validate` is a regression gate, not the final SEO review.
