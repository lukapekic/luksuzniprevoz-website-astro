# Booking Page — Theme and composition contract

Status: **DR-07 approved direction**. No new theme version is created. The configured Theme V2 provides the dark page canvas, light functional panel, input surfaces/borders, selection, error, and focus roles. Headings use Inter Tight; body, controls, labels, progress, and summaries use Manrope. Brand typography remains inside BrandLockup.

The page has one H1 and short introduction on the dark canvas. A centered booking-local light panel contains progress, optional compact summary, current step, validation, and the action row in that order. The panel uses `radius-section`; controls use `radius-control`. Selectable service rows are real bounded items and may use `radius-card`. No repeated field cards, dark summary sidebar, floating action block, or separate progress strip is allowed.

At mobile and tablet portrait widths the panel is one column with a full current-step label, count, and four accessible progress segments. At tablet landscape, desktop, and wide desktop it remains one centered panel with four readable step labels. Use active layout tokens for thresholds and the normal page gutters; cap the panel locally without widening the global container. The panel height is content-driven. All translated labels wrap and all targets remain at least 44×44.

Completed progress steps are buttons, current progress uses `aria-current="step"`, and future steps cannot bypass validation. Selection, hover, focus, invalid, pending, unavailable, and success states are distinct. Back/Edit preserves valid state, Continue validates before advancing, and each step change focuses the next H2. A compact disclosure shows known facts only on Steps 02–03; the final complete review replaces it on Step 04.

The Serbian visible date uses `DD/MM/YYYY` and time uses grouped native hour/minute controls for 24-hour `HH:mm`, independent of browser locale. Canonical values remain `YYYY-MM-DD` and `HH:mm`; timezone-dependent rules use `Europe/Belgrade`. An optional native calendar picker is an enhancement, not the sole input method. Return fields follow the same format and validation.

Use semantic tokens and restrained motion only. Reduced motion removes nonessential transitions. Verify all five viewport states, Serbian/English/Russian content, text zoom, keyboard and screen-reader flow, and zero horizontal overflow. Do not use gold, blue corporate styling, glow, glass, metallic gradients, oversized radius, or decorative dashboard patterns.
