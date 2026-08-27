/**
 * Navigation — FND-I18N-10 / FND-ARCH-03 / FND-TYPE-02.
 *
 * The navigation structure is authored as typed TS in this module (not JSON):
 * every `routeKey` is a member of the generated `RouteKey` union, so a typo
 * is a compile error before it can ship into production HTML. This matches the
 * repo's pattern for structural site data coupled to routes (routes.ts,
 * business.ts) — neither is Zod-parsed; both are typed at authoring.
 *
 * Display labels stay as JSON (navigation-labels.json): they are translator-
 * edited i18n content that changes often, so keeping them as data is correct.
 * They are imported here and exposed via typed accessors; a parity guard
 * (assertNavConsistency) verifies every locale declares the same key set as
 * the default locale (sr) — the same parity logic content:validate applies to
 * content/ui/*.json.
 *
 * FND-TYPE-02: structure routeKeys checked at compile time; label key
 * validity + cross-locale parity checked at module load (dev/build), not in
 * production HTML.
 */
import type { LocaleCode, RouteKey } from "@astro-foundation/core";
import { routeMap } from "./routes.ts";
import navLabelsJson from "./navigation-labels.json";
import { defaultLocale, localeCodes } from "./locales.ts";

// --- Types -----------------------------------------------------------------

/** Label keys: every route key, plus the two non-route nav labels. */
export type NavLabelKey = RouteKey | "services" | "book";

/** A link target. Routes resolve via getPath; flows are app-internal (e.g. a
 *  booking wizard); external links open outbound. */
export type NavTarget =
  | { type: "route"; routeKey: RouteKey }
  | { type: "flow"; flowKey: string }
  | { type: "external"; href: string };

/** Leaf nav node — links to a route, no children. */
export interface NavLeaf {
  routeKey: RouteKey;
}

/** Branch nav node — links to a route AND has nested children (a hub index). */
export interface NavBranch {
  routeKey: RouteKey;
  children: NavChild[];
}

/** Group nav node — a label-only dropdown parent with no route of its own. */
export interface NavGroup {
  id: string;
  labelKey: NavLabelKey;
  children: NavChild[];
}

/** A header tree item: a label-only group, a plain leaf, or a branch. */
export type NavHeaderItem = NavGroup | NavLeaf | NavBranch;

/** A child of a group/branch: either a leaf or a nested branch. */
export type NavChild = NavLeaf | NavBranch;

export interface HeaderPrimaryAction {
  id: string;
  labelKey: NavLabelKey;
  target: NavTarget;
}

export interface NavStructure {
  header: NavHeaderItem[];
  headerPrimaryAction: HeaderPrimaryAction;
  footer: {
    services: NavChild[];
    company: NavChild[];
  };
}

// --- Structure (typed TS — compile-checked against RouteKey) --------------

export const navigation: NavStructure = {
  header: [
    {
      id: "services",
      labelKey: "services",
      children: [
        { routeKey: "privateChauffeur" },
        { routeKey: "airportTransportation" },
        {
          routeKey: "businessTransportation",
          children: [
            { routeKey: "corporateTransportation" },
            { routeKey: "delegationTransportation" },
            { routeKey: "conferenceCongressTransportation" },
          ],
        },
        {
          routeKey: "specialEvents",
          children: [
            { routeKey: "weddingTransportation" },
            { routeKey: "promTransportation" },
            { routeKey: "vipTransportation" },
          ],
        },
      ],
    },
    { routeKey: "fleet" },
    { routeKey: "pricing" },
    { routeKey: "about" },
    { routeKey: "contact" },
  ],
  headerPrimaryAction: {
    id: "book",
    labelKey: "book",
    target: { type: "flow", flowKey: "booking" },
  },
  footer: {
    services: [
      { routeKey: "privateChauffeur" },
      { routeKey: "airportTransportation" },
      { routeKey: "businessTransportation" },
      { routeKey: "specialEvents" },
    ],
    company: [
      { routeKey: "fleet" },
      { routeKey: "pricing" },
      { routeKey: "about" },
      { routeKey: "contact" },
    ],
  },
};

// --- Labels (JSON — translator-edited i18n content) -----------------------

const navLabels = navLabelsJson as unknown as Record<string, Record<NavLabelKey, string>>;

// --- Label access ---------------------------------------------------------

/** All declared label keys, in declaration order (drives parity checks). */
const referenceLabels = navLabels[defaultLocale];
if (!referenceLabels) {
  throw new Error(`navigation-labels.json is missing the default locale "${defaultLocale}"`);
}
const DECLARED_LABEL_KEYS: NavLabelKey[] = Object.keys(referenceLabels) as NavLabelKey[];

/**
 * Resolves a nav label for a locale. Missing translations fail closed; the
 * navigation layer never substitutes another language.
 */
export function getNavLabel(key: NavLabelKey, locale: LocaleCode): string {
  const forLocale = navLabels[locale];
  if (!forLocale) throw new Error(`navigation-labels.json is missing locale "${locale}"`);
  const label = forLocale[key];
  if (label === undefined) {
    throw new Error(`navigation-labels.json is missing label "${key}" for locale "${locale}"`);
  }
  return label;
}

/** Map<routeKey, label> for the breadcrumb helper (helpers.buildBreadcrumbs). */
export function navLabelMap(locale: LocaleCode): Map<string, string> {
  const map = new Map<string, string>();
  for (const key of DECLARED_LABEL_KEYS) {
    if (key in routeMap) {
      map.set(key, getNavLabel(key, locale));
    }
  }
  return map;
}

// --- Flat views for the current flat NavList (until the dropdown Header) ---
//
// The foundation's NavList renders a flat {routeKey, label}[] with no nesting.
// The full header tree (services dropdown + 2-level branches + book CTA) needs
// a dedicated dropdown-capable Header component (pending). These flat views
// expose only the top-level route-bearing items so the current Header/Footer
// stay green and wired to real labels in the meantime.

/** Top-level header leaves/branches (route-bearing) — excludes the services
 *  dropdown group and the book CTA. */
export const primaryNavFlat: { routeKey: RouteKey }[] = navigation.header
  .filter((item): item is NavLeaf | NavBranch => "routeKey" in item)
  .map((item) => ({ routeKey: item.routeKey }));

/** All footer leaves, in services-then-company order. */
export const footerNavFlat: { routeKey: RouteKey }[] = [
  ...navigation.footer.services,
  ...navigation.footer.company,
].map((item) => ({ routeKey: item.routeKey }));

// --- Drift guard (dev/build) ----------------------------------------------

/** Every routeKey referenced in the nav structure (recursively). */
function collectNavRouteKeys(): string[] {
  const keys: string[] = [];
  const visit = (node: NavHeaderItem | NavChild): void => {
    if ("routeKey" in node) {
      keys.push(node.routeKey);
      if ("children" in node) node.children.forEach(visit);
    } else if ("children" in node) {
      node.children.forEach(visit);
    }
  };
  navigation.header.forEach(visit);
  navigation.footer.services.forEach(visit);
  navigation.footer.company.forEach(visit);
  return keys;
}

/**
 * Verifies, at module load (dev/build):
 *   1. structure routeKeys ⊆ routeMap  (compile already guarantees they're
 *      valid RouteKeys; this guarantees they're *known* routes — closes the
 *      gap if a RouteKey is renamed in routes.ts but not regenerated);
 *   2. every declared label key is a route or a known non-route nav label;
 *   3. cross-locale label parity — en/ru declare the exact key set sr does
 *      (no missing translations, no stray keys). sr is the reference locale.
 * Throws on drift so it fails loud in dev/build, not in production HTML.
 */
export function assertNavConsistency(): void {
  const knownRoutes = new Set(Object.keys(routeMap));
  const knownNonRouteLabelKeys = new Set<string>(["services", "book"]);

  // (1) structure routeKeys are known routes
  for (const key of collectNavRouteKeys()) {
    if (!knownRoutes.has(key)) {
      throw new Error(
        `navigation references unknown routeKey "${key}" — not in src/data/routes.ts routeMap (was RouteKey regenerated after a route rename?).`,
      );
    }
  }

  // (2) + (3) label key validity + cross-locale parity
  const referenceLocale = defaultLocale;
  const referenceKeys = new Set<string>(Object.keys(navLabels[referenceLocale]));

  const configuredLocaleSet = new Set(localeCodes);
  const declaredLocaleSet = new Set(Object.keys(navLabels));
  const missingLocales = localeCodes.filter((locale) => !declaredLocaleSet.has(locale));
  const extraLocales = [...declaredLocaleSet].filter(
    (locale) => !configuredLocaleSet.has(locale as LocaleCode),
  );
  if (missingLocales.length > 0 || extraLocales.length > 0) {
    throw new Error(
      `navigation-labels.json locale set differs from foundation.config.ts: missing ${JSON.stringify(missingLocales)}, extra ${JSON.stringify(extraLocales)}.`,
    );
  }

  // (2) reference-locale keys are all valid label keys
  for (const key of referenceKeys) {
    if (!knownRoutes.has(key) && !knownNonRouteLabelKeys.has(key)) {
      throw new Error(
        `navigation-labels.json (${referenceLocale}) declares label "${key}" which is neither a known route nor a non-route nav label (${[...knownNonRouteLabelKeys].join("/")}).`,
      );
    }
  }

  // (3) every other locale matches the reference key set exactly
  for (const locale of localeCodes) {
    if (locale === referenceLocale) continue;
    const localeKeys = new Set(Object.keys(navLabels[locale]));
    const missing = [...referenceKeys].filter((k) => !localeKeys.has(k));
    const extra = [...localeKeys].filter((k) => !referenceKeys.has(k));
    if (missing.length > 0 || extra.length > 0) {
      const parts: string[] = [];
      if (missing.length > 0) parts.push(`missing ${JSON.stringify(missing)}`);
      if (extra.length > 0) parts.push(`extra ${JSON.stringify(extra)}`);
      throw new Error(
        `navigation-labels.json (${locale}) label keys differ from ${referenceLocale}: ${parts.join(", ")}. Every locale must declare the same label key set.`,
      );
    }
  }
}

assertNavConsistency();
