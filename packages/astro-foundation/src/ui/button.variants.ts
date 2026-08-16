/**
 * Button variant definitions (FND-UI-03).
 * Min 44×44 target size per FND-A11Y-05.
 * class passthrough is layout-only per FND-UI-06.
 */
import { variants } from "./variants.ts";

export const buttonVariants = variants({
  base: "inline-flex items-center justify-center rounded-[var(--radius-lg)] font-medium transition-colors duration-[var(--duration-fast)] min-h-11 min-w-11",
  axes: {
    variant: {
      primary:
        "bg-[var(--accent-primary)] text-[var(--text-on-accent)] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--focus-ring-offset)]",
      secondary:
        "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--surface-overlay)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
      ghost:
        "text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
      outline:
        "border-2 border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--accent-subtle)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
    },
    size: {
      sm: "px-3 py-1.5 text-[var(--text-sm)] gap-1.5",
      md: "px-4 py-2 text-[var(--text-base)] gap-2",
      lg: "px-6 py-3 text-[var(--text-lg)] gap-2.5",
    },
  },
  defaults: {
    variant: "primary",
    size: "md",
  },
});
