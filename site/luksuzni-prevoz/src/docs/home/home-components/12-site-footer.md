# SiteFooter — four-tier shared contract

Status: **approved footer refinement**. The public identity is **Luksuzni prevoz** in every locale. The footer follows the FinalCTA directly and remains a compact site ending.

## Surface and hierarchy

The full-width footer uses one continuous `footerBackground` graphite-to-black gradient from the active theme. Its content stays aligned to `container.main` and `gutter.page`. `footerBoundary` marks the top edge; `footerDivider` separates the four regions. Navigation groups have no card surfaces. No glow, texture, animation, or container opacity is used.

Use `footerTextStrong` for the brand and navigation headings, `footerTextLink` for contact and route links, and `footerTextMuted` for hours, copyright, and address. Hovered links brighten toward the strong text role and gain a small-offset underline; focus keeps the visible `focusDark` ring. All footer text uses Manrope. Headings and navigation links use the semantic small UI size, with semibold headings and regular links. Supporting information uses the semantic extra-small size. Contrast is checked against `footerSurfaceStart`, the lightest gradient stop.

## Tiers

1. **Utility:** the approved owner-supplied car symbol is the only visible content of the home link. The link retains the canonical public name for assistive technology. The `BrandLockup` footer variant crops only empty symbol artboard space. Verified phone and email follow as `tel:` and `mailto:` links. Verified office hours close the row. Unverified social and WhatsApp slots remain absent.
2. **Navigation:** four route-data groups in order—Services (`privateChauffeur`, `airportTransportation`), Business transport (`businessTransportation`, `corporateTransportation`, `delegationTransportation`, `conferenceCongressTransportation`), Special occasions (`specialEvents`, `weddingTransportation`, `promTransportation`, `vipTransportation`), Information (`fleet`, `pricing`, `contact`). Headings and labels use approved localized sources; destinations use `getPath()`. Unavailable routes/groups are omitted. Each group is a heading and link list within one footer navigation landmark.
3. **Partners:** a localized “Our partners” heading at the start of one horizontal row, followed by two linked SVG logos in order: Belgrade Transfers, then Transferi. Both logos have the same rendered height and use the semantic platinum accent. Their URLs and accessible names come from `src/data/partners.ts`; the heading comes from localized UI content. The row uses the same divider and block padding as the bottom row. Logo links retain a visible focus ring and at least a 44×44 target.
4. **Bottom:** current-year copyright with the canonical public name and localized rights text, one verified address cluster, and route-preserving inline SR/EN/RU links with the active locale underlined. The address becomes a link only when `contact.office.googleMapsUrl` is verified and present; otherwise it remains readable text. Legal links appear only where published destinations exist.

## Responsive contract

The DOM order is brand → phone → email → hours → four navigation groups → partners heading → Belgrade Transfers → Transferi → copyright → address → languages at every width. The site container limits measure; labels, email, and address wrap without truncation. All links have at least a 44×44 CSS-pixel target and visible focus. No accidental horizontal overflow is permitted.

| State | Topology and placement |
| --- | --- |
| Mobile, 320px and 390px, below `md` | Brand first; phone and email in separate rows; hours below. Navigation uses two columns. The partners heading may wrap within its own narrow column; both equal-height logos stay beside it on the same row. Bottom information and languages stack in DOM order. |
| Tablet portrait, 768px, `md` to below `lg` | Brand occupies its own row. Contacts may wrap in the first column, with hours beside or below them as content requires. Navigation remains two columns. The partners heading and equal-height logos share one row. Bottom items wrap in DOM order. |
| Tablet landscape, 1024px, `lg` to below `xl` | Brand remains on its own row above contacts and hours. Four navigation columns. The partners heading and equal-height logos share one row. Bottom items wrap in DOM order if translated content needs space. |
| Desktop, 1440px, `xl` and wider | Brand, contacts, and far-end hours form one balanced row. Four navigation columns. The partners heading and equal-height logos share one row aligned to the container start. Bottom information forms a horizontal row when it fits. |
| Wide desktop, 1920px, `xl` and wider | Same topology as desktop; the capped main container prevents the regions from spreading across the viewport. The partners row stays aligned to the container start. |

Compatibility decision: `BrandLockup.variant="footer"` and `LanguageSwitcher.tone="footer"` are additive opt-ins used only by `SiteFooter`. Existing header, full, responsive, mark-only, and inline-default presentations keep their prior behavior; no consumer migration is required. No client-side behavior is added.
