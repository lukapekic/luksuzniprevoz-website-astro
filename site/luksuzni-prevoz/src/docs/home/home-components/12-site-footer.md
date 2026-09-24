# SiteFooter — three-tier shared contract

Status: **DR-08 and DR-09 approved direction**. This replaces the former three-column/GS-mark-only footer and parent-company attribution. The public identity is exactly **Luksuzni transport** across locales.

The full-width dark footer uses Theme V2 semantic surfaces, dividers, spacing, Manrope UI text, and the capped main container. It follows FinalCTA without an oversized blank band, glow, heavy shadow, newsletter, or additional primary CTA.

## Tiers

1. Utility: approved own-brand symbol/lockup, verified phone and email, and quiet verified office hours. Omit unverified social/WhatsApp slots entirely.
2. Navigation: four route-data groups in order—Services (`privateChauffeur`, `airportTransportation`), Business transport (`businessTransportation`, `corporateTransportation`, `delegationTransportation`, `conferenceCongressTransportation`), Special occasions (`specialEvents`, `weddingTransportation`, `promTransportation`, `vipTransportation`), Information (`fleet`, `pricing`, `contact`). Labels are localized through approved sources; unavailable routes/groups are omitted.
3. Bottom: current-year canonical copyright and localized rights text, verified location, route-preserving inline SR/EN/RU language links, and legal links only where published destinations exist. Use one semantic DOM tree.

At widths below `md`, stack utility, navigation, and bottom content in logical order. From `md` to below `xl`, use two utility columns, a 2×2 navigation grid, and a two-column bottom region. At `xl` and wider, use horizontal utility rows, four navigation columns, and naturally wrapping bottom groups. Review 320/768/1024/1440/1920 and both sides of `md`/`xl`; no duplicate landmarks, clipped translations, or page overflow. Every interactive target is at least 44×44 with visible focus. The shared LanguageSwitcher gains an inline presentation without changing its header dropdown default.

The approved logo package's full artwork says “LUKSUZNI PREVOZ,” which differs from the canonical public name. Use its approved symbol with the canonical BrandLockup text unless corrected artwork is supplied. Do not copy Belgrade Transfers branding, palette, contact data, routes, or placeholder links.
