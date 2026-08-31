import { z } from "zod";
import { localeSearchTargetSchema, searchDeviceSchema } from "../config/schema.ts";

export const headingEvidenceSchema = z
  .object({
    level: z.number().int().min(1).max(6),
    text: z.string(),
    id: z.string().nullable(),
  })
  .strict();

export const internalLinkEvidenceSchema = z
  .object({
    href: z.string(),
    text: z.string(),
  })
  .strict();

export const imageEvidenceSchema = z
  .object({
    src: z.string(),
    alt: z.string().nullable(),
    width: z.number().int().positive().nullable(),
    height: z.number().int().positive().nullable(),
    loading: z.string().nullable(),
  })
  .strict();

export const renderedPageEvidenceSchema = z
  .object({
    requestedUrl: z.string(),
    finalUrl: z.string(),
    status: z.number().int().nullable(),
    htmlLang: z.string().nullable(),
    dir: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    canonical: z.string().nullable(),
    robots: z.string().nullable(),
    hreflang: z.record(z.string()),
    openGraph: z.record(z.string()),
    twitter: z.record(z.string()),
    headings: z.array(headingEvidenceSchema),
    textExcerpt: z.string(),
    internalLinks: z.array(internalLinkEvidenceSchema),
    images: z.array(imageEvidenceSchema),
    jsonLdTypes: z.array(z.string()),
    invalidJsonLdCount: z.number().int().min(0),
  })
  .strict();

export const sourcePageEvidenceSchema = z
  .object({
    pageType: z.string(),
    status: z.string(),
    translationState: z.string(),
    noindex: z.boolean(),
    seoTitle: z.string().nullable(),
    seoDescription: z.string().nullable(),
    primaryHeading: z.string().nullable(),
    textFields: z.record(z.string()),
    textExcerpt: z.string(),
  })
  .strict();

export const foundationIssueSchema = z
  .object({
    ruleId: z.string(),
    severity: z.string(),
    filePath: z.string().optional(),
    offendingValue: z.string().optional(),
    expectedValue: z.string().optional(),
    fix: z.string().optional(),
  })
  .passthrough();

export const currentPageEvidenceSchema = z
  .object({
    source: sourcePageEvidenceSchema,
    rendered: renderedPageEvidenceSchema.nullable(),
    foundationIssues: z.array(foundationIssueSchema),
  })
  .strict();

export const serpOrganicResultSchema = z
  .object({
    position: z.number().int().positive(),
    url: z.string().url(),
    domain: z.string(),
    displayedUrl: z.string().nullable(),
    title: z.string().nullable(),
    snippet: z.string().nullable(),
  })
  .strict();

export const serpEvidenceSchema = z
  .object({
    keyword: z.string(),
    fetchedAt: z.string().datetime(),
    location: z.string().nullable(),
    languageCode: z.string(),
    countryCode: z.string(),
    googleDomain: z.string().nullable(),
    device: searchDeviceSchema,
    numResults: z.number().int().positive(),
    organicResults: z.array(serpOrganicResultSchema),
    ourPosition: z.number().int().positive().nullable(),
    ourUrl: z.string().url().nullable(),
  })
  .strict();

export const competitorEvidenceSchema = z
  .object({
    url: z.string().url(),
    domain: z.string(),
    fetchedAt: z.string().datetime(),
    source: z.enum(["serp", "configured"]),
    title: z.string().nullable(),
    description: z.string().nullable(),
    canonical: z.string().nullable(),
    robots: z.string().nullable(),
    headings: z.array(headingEvidenceSchema),
    textExcerpt: z.string(),
    jsonLdTypes: z.array(z.string()),
  })
  .strict();

export const seoFindingSchema = z
  .object({
    id: z.string().min(1),
    category: z.enum([
      "technical",
      "serp",
      "intent",
      "metadata",
      "heading",
      "content-coverage",
      "internal-link",
      "locale-parity",
      "image",
      "structured-data",
    ]),
    severity: z.enum(["low", "medium", "high"]),
    confidence: z.enum(["low", "medium", "high"]),
    summary: z.string().min(1),
    detail: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)).min(1),
    ruleId: z.string().optional(),
  })
  .strict();

export const seoProposalSchema = z
  .object({
    id: z.string().min(1),
    target: z
      .object({
        routeKey: z.string().min(1),
        locale: z.string().min(2),
        sourcePath: z.string().min(1),
        fieldPath: z.string().min(1),
      })
      .strict(),
    currentValue: z.unknown(),
    proposedValue: z.unknown(),
    category: z.enum([
      "metadata",
      "heading",
      "content-coverage",
      "internal-link",
      "image",
      "structured-data",
    ]),
    severity: z.enum(["low", "medium", "high"]),
    confidence: z.enum(["low", "medium", "high"]),
    rationale: z.string().min(1),
    evidenceIds: z.array(z.string().min(1)).min(1),
    factImpact: z.enum(["none", "restates-existing", "new-claim"]),
    requiresReview: z.literal(true),
    sourceDigest: z.string().min(1),
  })
  .strict();

export const researchWarningSchema = z
  .object({
    code: z.string().min(1),
    stage: z.enum(["config", "site", "rendered", "serp", "competitor", "analysis", "suggestion"]),
    message: z.string().min(1),
    retryable: z.boolean().default(false),
  })
  .strict();

export const evidenceReferenceSchema = z
  .object({
    id: z.string().min(1),
    kind: z.enum(["source", "rendered", "foundation", "serp", "competitor", "snapshot"]),
    label: z.string().min(1),
    value: z.string(),
  })
  .strict();

export const seoResearchReportSchema = z
  .object({
    schemaVersion: z.literal(1),
    run: z
      .object({
        id: z.string().min(1),
        generatedAt: z.string().datetime(),
        packageVersion: z.string().min(1),
        project: z.string().min(1),
        mode: z.enum(["offline", "built", "live"]),
        provider: z.literal("valueserp").nullable(),
        cache: z
          .object({ hits: z.number().int().min(0), misses: z.number().int().min(0) })
          .strict(),
        budget: z
          .object({ allowed: z.number().int().min(0), used: z.number().int().min(0) })
          .strict(),
      })
      .strict(),
    page: z
      .object({
        routeKey: z.string().min(1),
        locale: z.string().min(2),
        url: z.string().url(),
        sourcePath: z.string().min(1),
        sourceDigest: z.string().min(1),
        published: z.boolean(),
        indexable: z.boolean(),
      })
      .strict(),
    target: localeSearchTargetSchema,
    current: currentPageEvidenceSchema,
    serp: serpEvidenceSchema.nullable(),
    competitors: z.array(competitorEvidenceSchema),
    evidence: z.array(evidenceReferenceSchema),
    findings: z.array(seoFindingSchema),
    proposals: z.array(seoProposalSchema),
    warnings: z.array(researchWarningSchema),
  })
  .strict();

export type HeadingEvidence = z.infer<typeof headingEvidenceSchema>;
export type RenderedPageEvidence = z.infer<typeof renderedPageEvidenceSchema>;
export type SourcePageEvidence = z.infer<typeof sourcePageEvidenceSchema>;
export type CurrentPageEvidence = z.infer<typeof currentPageEvidenceSchema>;
export type SerpOrganicResult = z.infer<typeof serpOrganicResultSchema>;
export type SerpEvidence = z.infer<typeof serpEvidenceSchema>;
export type CompetitorEvidence = z.infer<typeof competitorEvidenceSchema>;
export type SeoFinding = z.infer<typeof seoFindingSchema>;
export type SeoProposal = z.infer<typeof seoProposalSchema>;
export type ResearchWarning = z.infer<typeof researchWarningSchema>;
export type EvidenceReference = z.infer<typeof evidenceReferenceSchema>;
export type SeoResearchReport = z.infer<typeof seoResearchReportSchema>;

export function parseSeoResearchReport(raw: unknown): SeoResearchReport {
  return seoResearchReportSchema.parse(raw);
}
