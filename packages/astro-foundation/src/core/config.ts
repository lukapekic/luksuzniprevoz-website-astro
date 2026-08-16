import { z } from "zod";

export const LocaleCodeSchema = z
  .string()
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, "BCP 47 language or language-region");

export const LocaleSchema = z.object({
  code: LocaleCodeSchema,
  htmlLang: z.string().min(2),
  hreflang: z.string().min(2),
  label: z.string().min(1),
  dir: z.enum(["ltr", "rtl"]).default("ltr"),
  isDefault: z.boolean().default(false),
  isXDefault: z.boolean().default(false),
  intl: z.object({
    dateTimeLocale: z.string().min(2),
    numberLocale: z.string().min(2),
    currency: z.string().length(3).optional(),
  }),
});

export const LocaleConfigSchema = z
  .object({
    locales: z.array(LocaleSchema).min(2).max(6),
    missingTranslation: z.enum(["omit", "fallback", "notFound"]).default("omit"),
    fallbackLocale: LocaleCodeSchema.optional(),
    parityFloor: z.number().min(0).max(1).default(1),
  })
  .superRefine((cfg, ctx) => {
    if (cfg.locales.filter((l) => l.isDefault).length !== 1)
      ctx.addIssue({
        code: "custom",
        message: "Exactly one locale must be isDefault",
      });
    if (cfg.locales.filter((l) => l.isXDefault).length > 1)
      ctx.addIssue({
        code: "custom",
        message: "At most one locale may be isXDefault",
      });
    if (new Set(cfg.locales.map((l) => l.code)).size !== cfg.locales.length)
      ctx.addIssue({
        code: "custom",
        message: "Duplicate locale codes",
      });
    if (cfg.missingTranslation === "fallback" && !cfg.fallbackLocale)
      ctx.addIssue({
        code: "custom",
        message: "fallbackLocale required for strategy 'fallback'",
      });
  });

export const SlugSegmentSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "lowercase ASCII, hyphen-separated");

export const RouteSchema = z.object({
  key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  slugs: z.record(LocaleCodeSchema, SlugSegmentSchema),
  parent: z.string().optional(),
  noindex: z.boolean().default(false),
  sitemap: z
    .object({
      include: z.boolean().default(true),
      priority: z.number().min(0).max(1).optional(),
    })
    .default({ include: true }),
  previousSlugs: z.record(LocaleCodeSchema, z.array(SlugSegmentSchema)).default({}),
});

const CapabilitiesSchema = z.object({
  forms: z.boolean().default(false),
  legalPages: z.boolean().default(false),
  consentBanner: z.boolean().default(false),
  thirdParty: z
    .array(
      z.object({
        origin: z.string().url(),
        purpose: z.string(),
        weight: z.number().optional(),
        strategy: z.enum(["eager", "lazy"]).default("lazy"),
      }),
    )
    .default([]),
  structuredData: z.array(z.string()).default([]),
  ogImages: z.enum(["static", "generated"]).default("static"),
});

type CapabilitiesOutput = z.output<typeof CapabilitiesSchema>;
const capabilitiesDefault: () => CapabilitiesOutput = () => CapabilitiesSchema.parse({});

const PerformanceBudgetSchema = z.object({
  maxJsKb: z.number().default(50),
  maxCssKb: z.number().default(40),
  maxFontFiles: z.number().default(4),
  maxFontTotalKb: z.number().default(150),
  maxLcpImageKb: z.number().default(150),
  maxTotalRouteKb: z.number().default(800),
  maxIslandsPerRoute: z.number().default(3),
});

type PerformanceBudgetOutput = z.output<typeof PerformanceBudgetSchema>;
const performanceBudgetDefault: () => PerformanceBudgetOutput = () =>
  PerformanceBudgetSchema.parse({});

export const FoundationConfigSchema = z
  .object({
    foundationVersion: z.string(),
    site: z.string().url(),
    brand: z.string().min(1),
    locales: LocaleConfigSchema,
    capabilities: CapabilitiesSchema.default(capabilitiesDefault),
    activeThemeVersion: z.string().default("version-1"),
    reviewStalenessWindowMonths: z.number().min(1).default(12),
    performanceBudget: PerformanceBudgetSchema.default(performanceBudgetDefault),
  })
  .readonly();

export type FoundationConfig = z.infer<typeof FoundationConfigSchema>;

/**
 * Recursively freezes an object/array so it cannot be mutated at runtime.
 * FND-CAP-05: the parsed config is immutable — both at the type level (the
 * schema is `.readonly()`) and at runtime (the value is deep-frozen).
 */
function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const v of Object.values(value as Record<string, unknown>)) {
      deepFreeze(v);
    }
  }
  return value;
}

export function defineFoundationConfig(
  config: z.input<typeof FoundationConfigSchema>,
): FoundationConfig {
  return deepFreeze(FoundationConfigSchema.parse(config));
}
