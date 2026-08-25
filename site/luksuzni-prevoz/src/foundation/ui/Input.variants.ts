/**
 * Input/Select/Textarea variant definitions — local to the luksuzni site.
 *
 * Overrides the core re-export (legacy tokens that don't exist here).
 * Uses the shared `variants()` engine with complete static class strings on
 * locked tokens. Shared by Input.astro, Select.astro, Textarea.astro.
 *
 * Form controls are a locked light-surface use case (DESIGN.md §5,
 * functional-ui.md §10): they render on inputSurface with inputBorder,
 * text-on-light, and focusLight. The dark-first system uses these light
 * functional controls for forms/pricing — not a parallel theme.
 *
 * States: default / focus-visible / aria-invalid (error) / disabled.
 * Error is never color-only: aria-invalid drives a border + outline change AND
 * the Field renders a text explanation (functional-ui.md §17). Min 44×44 target
 * (FND-A11Y-05). Control radius = --radius-control (6px). class passthrough is
 * layout-only (FND-UI-06). Logical properties only.
 */
import { variants } from "@astro-foundation/core/ui";

export const inputVariants = variants({
  base: [
    "w-full min-h-11",
    "rounded-[var(--radius-control)]",
    "border border-solid border-[var(--color-input-border)]",
    "bg-[var(--color-input-surface)]",
    "text-[var(--color-text-on-light)]",
    "font-body text-[length:var(--text-base)] leading-[var(--line-height-body)]",
    "px-[var(--space-3)] py-[var(--space-2)]",
    "transition-colors duration-[var(--duration-fast)]",
    // Muted, readable placeholder derived from the on-light text token (no raw
    // color, no new token): text-on-light lightened toward the input surface.
    "placeholder:text-[color-mix(in_oklab,var(--color-text-on-light),var(--color-input-surface)_35%)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus-light)]",
    "aria-invalid:border-[var(--color-error)] aria-invalid:focus-visible:outline-[var(--color-error)]",
    "disabled:opacity-70 disabled:cursor-not-allowed",
  ].join(" "),
  axes: {
    size: {
      sm: "text-[length:var(--text-sm)] px-[var(--space-2)]",
      md: "",
      lg: "text-[length:var(--text-lg)] px-[var(--space-4)] py-[var(--space-3)]",
    },
  },
  defaults: {
    size: "md",
  },
});
