# Corporate Transportation v1 — Implementation Compliance Matrix

| Requirement | Authority | Data source | Production owner | Responsive verification |
| --- | --- | --- | --- | --- |
| Full-bleed Hero, two actions, five support facts | Blueprint §§4, 17 | localized content, `services.ts`, `contact.ts`, UI dictionaries | `ServiceHero` via `CorporateTransportationPage` | 320/768/1024/1440/1920 crop, contrast, actions, support topology |
| Four numbered overview facts | Blueprint §5 | localized overview, `services.ts`, UI dictionaries | `ServiceOverview` | vertical below `lg`; 5/7 from `lg` |
| Five-item audience rail | Blueprint §6 | `sections.audience` | page composition | 1/2/2/3/5 columns at locked states |
| One-off and recurring pathways | Blueprint §7 | `sections.engagementModel`, `services.ts`, UI dictionaries | `CorporateEngagementPanel` | stacked below `lg`; 5/7 from `lg` |
| Working Day split and six-stop itinerary | Blueprint §8 | `sections.workingDay`, Corporate UI dictionaries, locked shared WebP | `OpenSplitSection` plus page composition | copy then image below `lg`; visual image 7/copy 5 and horizontal itinerary from `lg` |
| Three-source coordination model | Blueprint §9 | `sections.coordination`, Corporate UI dictionaries | `CorporateCoordinationPanel` | stacked below `lg`; 5/7 from `lg` |
| Exact S/E/V vehicle order | Blueprint §10 | localized content, `fleet.ts`, `fleet-media.ts` | `VehicleRecommendations` | shared carousel contract |
| Four standards groups with three facts | Blueprint §11 | `operations.ts`, service-standard builder, Corporate UI dictionaries | `ServiceStandards` | one sequence below `lg`; 4/8 and 2×2 from `lg` |
| Nine resolved FAQ rows and matching schema | Blueprint §12 | localized content, canonical data assertions, Corporate UI dictionaries | `FAQ`, `buildFaqPage` | reading width and wrapping at every state |
| Two final flow actions | Blueprint §13 | localized content, canonical flow resolver | `FinalCTA` | both visible; stacked on narrow mobile |
| Localized route/SEO lifecycle | Blueprint §§15, 19 | route map, localized content, SEO helper | existing renderer and `BaseLayout` | SR/EN/RU route and head checks |

Unresolved release gate: localized entries intentionally remain `in-review` and
`noindex:true` until owner approval. No image blocker remains.
