/**
 * Container variant definitions (FND-UI-03, Document group).
 * Uses max-width from layout tokens.
 * class passthrough is layout-only per FND-UI-06.
 */
import { variants } from "./variants.ts";

export const containerVariants = variants({
  base: "w-full mx-auto px-[var(--gutter-md)]",
  axes: {
    size: {
      sm: "max-w-[var(--container-sm)]",
      md: "max-w-[var(--container-md)]",
      lg: "max-w-[var(--container-lg)]",
      xl: "max-w-[var(--container-xl)]",
      full: "max-w-full",
    },
  },
  defaults: {
    size: "lg",
  },
});
