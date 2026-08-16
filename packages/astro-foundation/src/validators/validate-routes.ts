import type { FoundationIssue } from "../core/errors.ts";
import type { FoundationConfig } from "../core/config.ts";

const ASCII_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ROUTE_CEILING = 30;

export interface RouteDef {
  key: string;
  slugs: Record<string, string | undefined>;
  parent?: string;
  noindex?: boolean;
  previousSlugs?: Record<string, string[]>;
}

export interface ValidateRoutesOptions {
  config: FoundationConfig;
  routes: RouteDef[];
  filePath?: string;
  routeCeiling?: number;
}

/**
 * Validates route definitions.
 * Returns all issues found (aggregated, FND-DX-02).
 */
export function validateRoutes(opts: ValidateRoutesOptions): FoundationIssue[] {
  const { config, routes, filePath, routeCeiling } = opts;
  const issues: FoundationIssue[] = [];
  const ceiling = routeCeiling ?? ROUTE_CEILING;
  const warnAt = Math.floor(ceiling * 0.8);

  const localeCodes = config.locales.locales.map((l) => l.code);
  const defaultLocale = config.locales.locales.find((l) => l.isDefault);

  // FND-I18N-05: ASCII-normalized slugs
  for (const route of routes) {
    for (const [locale, slug] of Object.entries(route.slugs)) {
      if (slug === "" || slug === undefined) continue;
      if (!ASCII_SLUG_RE.test(slug)) {
        issues.push({
          ruleId: "FND-I18N-05",
          severity: "error",
          filePath,
          offendingValue: `Route "${route.key}", locale "${locale}" has non-ASCII slug: "${slug}"`,
          expectedValue: "Lowercase ASCII, hyphen-separated slug",
          docAnchor: "#FND-I18N-05",
        });
      }
    }
  }

  // FND-I18N-06: Full paths must be unique
  if (defaultLocale) {
    const pathMap = new Map<string, { routeKey: string; locale: string }>();
    for (const route of routes) {
      for (const locale of localeCodes) {
        const slug = route.slugs[locale];
        if (slug === undefined) continue;
        const prefix = locale === defaultLocale.code ? "" : `/${locale}`;
        const segment = slug === "" ? "" : `/${slug}`;
        const path = `${prefix}${segment}/`;
        const existing = pathMap.get(path);
        if (existing) {
          issues.push({
            ruleId: "FND-I18N-06",
            severity: "error",
            filePath,
            offendingValue: `Duplicate path "${path}" for "${existing.routeKey}" (${existing.locale}) and "${route.key}" (${locale})`,
            expectedValue: "Unique paths across all route × locale combinations",
            docAnchor: "#FND-I18N-06",
          });
        }
        pathMap.set(path, { routeKey: route.key, locale });
      }
    }
  }

  // FND-I18N-07: previousSlugs structure
  for (const route of routes) {
    if (route.previousSlugs) {
      for (const locale of Object.keys(route.previousSlugs)) {
        if (!localeCodes.includes(locale)) {
          issues.push({
            ruleId: "FND-I18N-07",
            severity: "error",
            filePath,
            offendingValue: `Route "${route.key}" has previousSlugs for unknown locale "${locale}"`,
            docAnchor: "#FND-I18N-07",
          });
        }
        for (const slug of route.previousSlugs[locale] ?? []) {
          if (!ASCII_SLUG_RE.test(slug)) {
            issues.push({
              ruleId: "FND-I18N-07",
              severity: "error",
              filePath,
              offendingValue: `Route "${route.key}" previousSlug "${slug}" for locale "${locale}" is not ASCII`,
              docAnchor: "#FND-I18N-07",
            });
          }
        }
      }
    }
  }

  // FND-I18N-09: Missing translation strategy
  const strategy = config.locales.missingTranslation;
  if (strategy === "fallback" && !config.locales.fallbackLocale) {
    issues.push({
      ruleId: "FND-I18N-09",
      severity: "error",
      filePath,
      offendingValue: "missingTranslation is 'fallback' but no fallbackLocale is set",
      docAnchor: "#FND-I18N-09",
    });
  }

  // FND-SCALE-01
  for (const locale of localeCodes) {
    const count = routes.filter((r) => r.slugs[locale] !== undefined).length;
    if (count > ceiling) {
      issues.push({
        ruleId: "FND-SCALE-01",
        severity: "error",
        filePath,
        offendingValue: `Locale "${locale}" has ${count} routes (ceiling: ${ceiling})`,
        docAnchor: "#FND-SCALE-01",
      });
    } else if (count >= warnAt) {
      issues.push({
        ruleId: "FND-SCALE-01",
        severity: "warning",
        filePath,
        offendingValue: `Locale "${locale}" has ${count} routes (approaching ceiling: ${ceiling})`,
        docAnchor: "#FND-SCALE-01",
      });
    }
  }

  return issues;
}
