# Content Semantic Validation

Add to the existing `content:validate` gate.

## Hard failures
- Missing SR/EN/RU entry for any public page.
- Duplicate `(routeKey, locale)`.
- Unknown routeKey.
- Invalid CTA route target.
- Invalid relatedRouteKey.
- Invalid fleet/client reference.
- pageType inconsistent with route archetype.
- Internal raw URL authored where a route key is required.
- Content fallback.
- Production `noindex` accidentally enabled on an indexable page.

## Additional rules
- Filename locale suffix should match entry locale.
- FAQ schema output must consume the same visible FAQ data.
- Canonical/hreflang are derived by route/SEO foundation, never authored here.
- Project facts remain in structured project data, not duplicated in Markdown.
