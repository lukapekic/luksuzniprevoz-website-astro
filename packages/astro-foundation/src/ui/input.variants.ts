/**
 * Input variant definitions (Form group, FND-A11Y-10).
 * class passthrough is layout-only per FND-UI-06.
 */
import { variants } from "./variants.ts";

export const inputVariants = variants({
  base: "w-full rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-base)] text-[var(--text-primary)] px-3 py-2 min-h-11 transition-colors duration-[var(--duration-fast)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] focus:ring-offset-1 focus:ring-offset-[var(--focus-ring-offset)]",
  axes: {
    size: {
      sm: "text-[var(--text-sm)] px-2 py-1.5 min-h-9",
      md: "text-[var(--text-base)] px-3 py-2 min-h-11",
      lg: "text-[var(--text-lg)] px-4 py-3 min-h-13",
    },
  },
  defaults: {
    size: "md",
  },
});
