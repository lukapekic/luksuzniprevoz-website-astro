# Booking Page — Theme and composition contract

Status: **DR-07 approved direction**. No new theme version is created. The configured Theme V2 provides the dark page canvas, light functional panel, input surfaces/borders, selection, error, and focus roles. Headings use Inter Tight; body, controls, labels, progress, and summaries use Manrope. Brand typography remains inside BrandLockup.

The page has one H1 and short introduction on the dark canvas. A centered booking-local light panel contains progress, optional compact summary, current step, validation, and the action row in that order. The panel uses `radius-section`; controls use `radius-control`. Selectable service rows are real bounded items and may use `radius-card`. No repeated field cards, dark summary sidebar, floating action block, or separate progress strip is allowed.

At mobile and tablet portrait widths the panel is one column with a full current-step label, count, and four accessible progress segments. At tablet landscape, desktop, and wide desktop it remains one centered panel with four readable step labels. Use active layout tokens for thresholds and the normal page gutters; cap the panel locally without widening the global container. The panel height is content-driven. All translated labels wrap and all targets remain at least 44×44.

The booking-local cap is `container-reading` minus `space-12`, yielding an approximately 864–880px panel in the current active theme; it is a composition relationship, not a new global container or a literal component value. The introductory measure stays `measure-body`.

Completed progress steps are buttons, current progress uses `aria-current="step"`, and future steps cannot bypass validation. Selection, hover, focus, invalid, pending, unavailable, and success states are distinct. Back/Edit preserves valid state, Continue validates before advancing, and each step change focuses the next H2. A compact disclosure shows known facts only on Steps 02–03; the final complete review replaces it on Step 04.

Across Serbian Latin, English, and Russian, the visible date uses `DD/MM/YYYY` and time uses grouped native hour/minute controls for 24-hour `HH:mm`, independent of browser locale. Canonical values remain `YYYY-MM-DD` and `HH:mm`; timezone-dependent rules use `Europe/Belgrade`. An optional native calendar picker is an enhancement, not the sole input method. Return fields follow the same format and validation.

Use semantic tokens and restrained motion only. Reduced motion removes nonessential transitions. Verify all five viewport states, Serbian/English/Russian content, text zoom, keyboard and screen-reader flow, and zero horizontal overflow. Do not use gold, blue corporate styling, glow, glass, metallic gradients, oversized radius, or decorative dashboard patterns.


## Schedule controls shared with Airport booking start

`BookingScheduleControls.astro` is consumed by the Booking wizard (outbound and return) and Airport booking start. Its existing API remains compatible: `idPrefix` defaults to `booking`; `nativeValidation` defaults to false for the wizard's controlled validation. Airport uses prefix `airport` and native validation. One calendar parser and one canonical/display synchronization helper serve both consumers. Eight digits entered on a numeric mobile keyboard are formatted into DD/MM/YYYY without requiring a slash key. Visible dates must be complete `DD/MM/YYYY`; impossible calendar dates are rejected. Hour options are `00–23`, minute options `00–59`, with canonical `HH:mm`. API/query dates remain `YYYY-MM-DD`.

At 320 the date precedes the grouped time controls in one column; at 768, 1024, 1440, and 1920 the date and time occupy the existing two-column field grid. Each pair follows source order, all controls retain 44px targets and visible focus, and grid children can shrink without page overflow. The return pair follows the outbound pair when requested. No imagery or CTA ordering changes. Empty, filled, invalid, recovered draft, and incoming query states use the same conversion rules.

Phone is optional in both final forms. The shared phone validator accepts international `+` and `00` dialing prefixes, Serbian local mobile/landline numbers beginning with `0`, and spaces, parentheses, periods, hyphens, or slashes. Numbers retain the user's display formatting; no country code is guessed. Shape validation applies on the client and server with 7–15 dialing digits and at most 32 displayed characters.
