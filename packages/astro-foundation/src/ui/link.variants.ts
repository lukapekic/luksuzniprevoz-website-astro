/**
 * Link variant definitions (FND-UI-13).
 * Uses CSS custom properties from the theme pipeline.
 * class passthrough is layout-only per FND-UI-06.
 */
import { variants } from "./variants.ts";

export const linkVariants = variants({
  base: "inline-flex items-center gap-2 transition-colors duration-[var(--duration-fast)]",
  axes: {
    variant: {
      default:
        "text-[var(--text-secondary)] underline-offset-4 hover:underline hover:text-[var(--text-primary)]",
      nav: "text-[var(--text-primary)] font-medium px-3 py-2 rounded-[var(--radius-md)] hover:bg-[var(--accent-subtle)]",
      cta: "inline-flex items-center justify-center bg-[var(--accent-primary)] text-[var(--text-on-accent)] font-semibold px-6 py-3 rounded-[var(--radius-lg)] hover:opacity-90",
      button:
        "inline-flex items-center justify-center border-2 border-[var(--border-strong)] px-4 py-2 rounded-[var(--radius-lg)] hover:bg-[var(--accent-subtle)]",
    },
    size: {
      sm: "text-[var(--text-sm)]",
      md: "text-[var(--text-base)]",
      lg: "text-[var(--text-lg)]",
    },
  },
  defaults: {
    variant: "default",
    size: "md",
  },
});
