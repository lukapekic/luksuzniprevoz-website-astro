/**
 * Root-level foundation.config.ts — re-exports the reference site config.
 *
 * This file exists so that `pnpm foundation:doctor` (and other scripts)
 * work when invoked from the monorepo root without specifying a target.
 *
 * For downstream projects created from this template, replace this
 * with your own `defineFoundationConfig(...)` call.
 */
export { config as default, config } from "./examples/reference-site/foundation.config.ts";
