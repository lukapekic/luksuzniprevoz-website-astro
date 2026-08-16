/**
 * Dialog variant definitions (FND-A11Y-08).
 * Uses native <dialog> element.
 * class passthrough is layout-only per FND-UI-06.
 */
import { variants } from "./variants.ts";

export const dialogVariants = variants({
  base: "backdrop:bg-[var(--surface-sunken)]/80 backdrop:backdrop-blur-sm bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-[var(--radius-xl)] p-[var(--space-6)] max-w-[var(--container-lg)] w-full shadow-lg",
  axes: {
    size: {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
    },
  },
  defaults: {
    size: "md",
  },
});
