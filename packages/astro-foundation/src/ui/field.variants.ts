/**
 * Field variant definitions (Form group, FND-A11Y-03, FND-A11Y-10).
 * Wraps Input/Textarea/Select with label association.
 * class passthrough is layout-only per FND-UI-06.
 */
import { variants } from "./variants.ts";

export const fieldVariants = variants({
  base: "flex flex-col gap-[var(--space-1)]",
  axes: {
    size: {
      sm: "text-[var(--text-sm)]",
      md: "text-[var(--text-base)]",
      lg: "text-[var(--text-lg)]",
    },
  },
  defaults: {
    size: "md",
  },
});
