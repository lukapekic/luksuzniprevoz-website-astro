# FinalCTA — Exact V1.2 Contract

## Section wrapper

- Feature spacing before/around CTA.
- Contained by the Theme V2 main container.

## Panel

- Theme V2 section radius.
- Overflow hidden.
- Restrained neutral graphite → slightly elevated graphite gradient is allowed.
- No warm-brown/gold theme drift.
- No metallic/platinum gradient.
- No glow.

## Desktop

Grid:

```text
~62fr 38fr
```

Content:

- vertically centered;
- Theme V2 semantic spacing;
- strong but not Hero-scale heading.
- content-driven height: a fixed maximum must not clip longer localized or
  enlarged text; the image fills the height established by the content.

Image:

- visually constrained to about 35–40%;
- optional right-zone contextual or vehicle image supplied by the caller;
- `contain` for transparent/cutout imagery; `cover` for contextual photography;
- blended/no hard edge;
- not a separate bordered card.
- the optional `integrated` media treatment fills the complete media region, adds a restrained light-neutral veil, and fades the media itself from transparent to opaque at its inline start so the panel's exact background shows through without a color seam.
- the `integrated` treatment is opt-in so existing consumers remain unchanged.

The shared component never selects or imports a page-specific image. Callers
own image selection, alt intent, fit, and media treatment. Without an image,
the component remains a valid gradient-only conversion panel.

## Tablet

Keep the split only while content remains legible.

Do not force desktop geometry when the available width is too small.

## Mobile

- One column.
- Content first.
- Book CTA full width.
- Request Quote CTA full width.
- Verified phone/email contacts presented compactly.
- Dedicated media area below content.
- Integrated media switches to a block-start fade on mobile.
- No image-behind-copy treatment if it harms legibility.

## CTA group

- Primary: Book a Chauffeur.
- Secondary: Request a Quote.
- Use approved shared Button contracts.
- Actions are independently optional after canonical destination resolution.
- If no action has a destination, omit the action region; never render an
  empty, placeholder, disabled-link, current-page, or substituted-contact CTA.
- Existing callers that provide both actions retain this hierarchy unchanged.

## Contact row

Only show canonical verified data.

Potential methods:

- phone;
- email;

Do not invent missing values for visual completeness.

Contact items must be shrinkable within the content column. Long canonical
e-mail addresses may wrap within a word when necessary, including at 200% text
size. Do not truncate, hide, abbreviate or reduce the font size of contact data.
This is a compatible intrinsic-sizing correction, not an API or visual redesign.
It affects every FinalCTA consumer; existing labels, destinations, spacing,
image treatments and action priority remain unchanged.

The content grid uses a shrinkable single column. Its minimum-content width
must not force headings, buttons or contact links outside the panel. The former
implementation's desktop height cap is removed to meet the non-waivable
enlarged-text accessibility requirement. Ordinary panels may become slightly
taller where their content requires it; no text is hidden or scaled down.

At 320 and 768 CSS px the order is heading, supporting text, actions, contacts,
then image. At 1024, 1440 and 1920 CSS px the approved content/image split
applies; reading and keyboard order stay unchanged. Contact links remain within
the content width in every state, including enlarged-text variants. The
44×44 CSS px target floor and visible keyboard focus remain required.

## Typography

- Inter Tight heading.
- Manrope supporting/contacts/UI.
- FinalCTA must remain visibly distinct from the full-bleed Homepage Hero.
