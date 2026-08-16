// @astro-foundation/core i18n subpath

// Schema re-exports
export {
  LocaleCodeSchema,
  LocaleSchema,
  RouteSchema,
  type LocaleCode,
  type Locale,
  type Route,
} from "./schema.ts";

// Core routing
export { getPath, type RouteRef } from "./get-path.ts";

// Helpers
export {
  resolveAllPaths,
  buildHreflangSet,
  getBreadcrumbs,
  isDefaultLocale,
  type ResolvedPath,
  type HreflangLink,
  type BreadcrumbItem,
} from "./helpers.ts";

// Intl formatters
export { createDateFormatter, createNumberFormatter, formatCurrency } from "./format.ts";
