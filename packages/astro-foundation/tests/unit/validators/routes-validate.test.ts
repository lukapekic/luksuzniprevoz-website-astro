import { describe, it, expect } from "vitest";
import { validateRoutes, type RouteDef } from "../../../src/validators/validate-routes.ts";

describe("validateRoutes", () => {
  function makeConfig(overrides?: Record<string, unknown>) {
    return {
      foundationVersion: "0.1.0",
      site: "https://test.example.com",
      brand: "Test",
      locales: {
        locales: [
          {
            code: "en",
            htmlLang: "en",
            hreflang: "en",
            label: "English",
            dir: "ltr" as const,
            isDefault: true,
            isXDefault: true,
            intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
          },
          {
            code: "fr",
            htmlLang: "fr",
            hreflang: "fr",
            label: "Français",
            dir: "ltr" as const,
            isDefault: false,
            isXDefault: false,
            intl: { dateTimeLocale: "fr-FR", numberLocale: "fr-FR" },
          },
        ],
        missingTranslation: "omit" as const,
        parityFloor: 1,
        fallbackLocale: undefined,
        ...overrides?.locales,
      },
      capabilities: {
        forms: false,
        legalPages: false,
        consentBanner: false,
        thirdParty: [],
        structuredData: [],
        ogImages: "static" as const,
      },
      ...overrides,
    };
  }

  const validRoutes: RouteDef[] = [
    { key: "home", slugs: { en: "", fr: "" } },
    { key: "about", slugs: { en: "about", fr: "a-propos" }, parent: "home" },
    { key: "services", slugs: { en: "services", fr: "services" }, parent: "home" },
  ];

  it("returns no issues for valid routes", () => {
    const issues = validateRoutes({
      config: makeConfig(),
      routes: validRoutes,
    });
    expect(issues).toEqual([]);
  });

  it("detects non-ASCII slugs (FND-I18N-05)", () => {
    const routes: RouteDef[] = [
      { key: "home", slugs: { en: "", fr: "" } },
      { key: "about", slugs: { en: "about", fr: "о-нами" } },
    ];
    const issues = validateRoutes({ config: makeConfig(), routes });
    const nonAscii = issues.filter((i) => i.ruleId === "FND-I18N-05");
    expect(nonAscii.length).toBeGreaterThan(0);
    expect(nonAscii[0]!.offendingValue).toContain("non-ASCII");
    expect(nonAscii[0]!.severity).toBe("error");
  });

  it("detects duplicate paths (FND-I18N-06)", () => {
    const routes: RouteDef[] = [
      { key: "home", slugs: { en: "", fr: "" } },
      { key: "about", slugs: { en: "about", fr: "a-propos" } },
      { key: "about-us", slugs: { en: "about", fr: "a-propos" } },
    ];
    const issues = validateRoutes({ config: makeConfig(), routes });
    const dupes = issues.filter((i) => i.ruleId === "FND-I18N-06");
    expect(dupes.length).toBeGreaterThan(0);
    expect(dupes[0]!.offendingValue).toContain("Duplicate");
    expect(dupes[0]!.severity).toBe("error");
  });

  it("detects previousSlugs with unknown locale (FND-I18N-07)", () => {
    const routes: RouteDef[] = [
      { key: "home", slugs: { en: "", fr: "" } },
      {
        key: "about",
        slugs: { en: "about", fr: "a-propos" },
        previousSlugs: { de: ["ueber-uns"] },
      },
    ];
    const issues = validateRoutes({ config: makeConfig(), routes });
    const prevSlugIssues = issues.filter((i) => i.ruleId === "FND-I18N-07");
    expect(prevSlugIssues.length).toBeGreaterThan(0);
    expect(prevSlugIssues[0]!.offendingValue).toContain("unknown locale");
  });

  it("detects fallback strategy without fallbackLocale (FND-I18N-09)", () => {
    const config = makeConfig({
      locales: {
        locales: [
          {
            code: "en",
            htmlLang: "en",
            hreflang: "en",
            label: "English",
            dir: "ltr" as const,
            isDefault: true,
            isXDefault: true,
            intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
          },
          {
            code: "fr",
            htmlLang: "fr",
            hreflang: "fr",
            label: "Français",
            dir: "ltr" as const,
            isDefault: false,
            isXDefault: false,
            intl: { dateTimeLocale: "fr-FR", numberLocale: "fr-FR" },
          },
        ],
        missingTranslation: "fallback" as const,
        parityFloor: 1,
        fallbackLocale: undefined,
      },
    });
    const issues = validateRoutes({ config, routes: validRoutes });
    const fallbackIssues = issues.filter((i) => i.ruleId === "FND-I18N-09");
    expect(fallbackIssues.length).toBe(1);
    expect(fallbackIssues[0]!.severity).toBe("error");
  });

  it("warns at 80% scale ceiling (FND-SCALE-01)", () => {
    const routes: RouteDef[] = [
      { key: "home", slugs: { en: "", fr: "" } },
      ...Array.from({ length: 24 }, (_, i) => ({
        key: `page-${i + 1}`,
        slugs: { en: `page-${i + 1}`, fr: `page-${i + 1}` } as Record<string, string | undefined>,
      })),
    ];
    const issues = validateRoutes({ config: makeConfig(), routes });
    const scaleIssues = issues.filter((i) => i.ruleId === "FND-SCALE-01");
    expect(scaleIssues.length).toBeGreaterThan(0);
    expect(scaleIssues[0]!.severity).toBe("warning");
  });

  it("errors when exceeding route ceiling (FND-SCALE-01)", () => {
    const routes: RouteDef[] = [
      { key: "home", slugs: { en: "", fr: "" } },
      ...Array.from({ length: 30 }, (_, i) => ({
        key: `page-${i + 1}`,
        slugs: { en: `page-${i + 1}`, fr: `page-${i + 1}` } as Record<string, string | undefined>,
      })),
    ];
    const issues = validateRoutes({ config: makeConfig(), routes });
    const scaleIssues = issues.filter((i) => i.ruleId === "FND-SCALE-01");
    expect(scaleIssues.length).toBeGreaterThan(0);
    // At least one should be an error
    const errors = scaleIssues.filter((i) => i.severity === "error");
    expect(errors.length).toBeGreaterThan(0);
  });

  it("allows empty slugs for home route", () => {
    const routes: RouteDef[] = [{ key: "home", slugs: { en: "", fr: "" } }];
    const issues = validateRoutes({ config: makeConfig(), routes });
    expect(issues).toEqual([]);
  });
});
