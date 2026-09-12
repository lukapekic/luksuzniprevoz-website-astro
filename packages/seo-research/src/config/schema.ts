import { z } from "zod";

export const searchDeviceSchema = z.enum(["desktop", "tablet", "mobile"]);

export const localeSearchTargetSchema = z
  .object({
    primaryKeyword: z.string().trim().min(1),
    secondaryKeywords: z.array(z.string().trim().min(1)).default([]),
    entities: z.array(z.string().trim().min(1)).default([]),
    questions: z.array(z.string().trim().min(1)).default([]),
    search: z
      .object({
        languageCode: z.string().trim().min(2),
        countryCode: z.string().trim().min(2),
        location: z.string().trim().min(1).optional(),
        googleDomain: z.string().trim().min(1).optional(),
        device: searchDeviceSchema.default("desktop"),
        numResults: z.number().int().min(1).max(100).default(20),
      })
      .strict(),
  })
  .strict();

export const seoResearchTargetSchema = z
  .object({
    routeKey: z.string().trim().min(1),
    intent: z.enum(["informational", "navigational", "commercial", "transactional", "mixed"]),
    includeNonIndexable: z.boolean().default(false),
    locales: z
      .record(z.string().trim().min(2), localeSearchTargetSchema)
      .refine(
        (locales) => Object.keys(locales).length > 0,
        "At least one locale search target is required",
      ),
  })
  .strict();

export const competitorTargetSchema = z
  .object({
    name: z.string().trim().min(1),
    domain: z.string().trim().min(1),
    sitemapUrl: z.string().url().optional(),
    trackedRoutePatterns: z.array(z.string().trim().min(1)).default([]),
  })
  .strict();

export const seoResearchConfigSchema = z
  .object({
    schemaVersion: z.literal(1),
    targets: z.array(seoResearchTargetSchema).min(1),
    competitors: z.array(competitorTargetSchema).default([]),
    provider: z
      .object({
        kind: z.literal("valueserp"),
        apiKeyEnv: z
          .string()
          .regex(/^[A-Z][A-Z0-9_]*$/)
          .default("VALUESERP_API_KEY"),
      })
      .strict()
      .optional(),
    limits: z
      .object({
        maxQueriesPerRun: z.number().int().min(1).max(100).default(20),
        maxOrganicResultsPerQuery: z.number().int().min(1).max(100).default(20),
        maxCompetitorPagesPerQuery: z.number().int().min(0).max(10).default(3),
        maxPagesPerDomain: z.number().int().min(1).max(5).default(1),
        requestTimeoutMs: z.number().int().min(1_000).max(60_000).default(20_000),
        maxResponseBytes: z.number().int().min(10_000).max(5_000_000).default(1_000_000),
        cacheTtlHours: z.number().min(0).max(720).default(24),
      })
      .strict()
      .default({}),
  })
  .strict()
  .superRefine((config, context) => {
    const seenTargets = new Set<string>();
    for (const target of config.targets) {
      if (seenTargets.has(target.routeKey)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate research target routeKey: ${target.routeKey}`,
          path: ["targets"],
        });
      }
      seenTargets.add(target.routeKey);
    }
  });

export type LocaleSearchTarget = z.infer<typeof localeSearchTargetSchema>;
export type SeoResearchTarget = z.infer<typeof seoResearchTargetSchema>;
export type CompetitorTarget = z.infer<typeof competitorTargetSchema>;
export type SeoResearchConfig = z.infer<typeof seoResearchConfigSchema>;
export type SeoResearchConfigInput = z.input<typeof seoResearchConfigSchema>;
