/**
 * Root-level foundation.config.ts — re-exports the production site config.
 *
 * This file exists so that `pnpm foundation:doctor` (and other scripts)
 * work when invoked from the monorepo root without specifying a target.
 */
export { config as default, config } from "./site/luksuzni-prevoz/foundation.config.ts";
