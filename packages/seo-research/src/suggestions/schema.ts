import { z } from "zod";
import { seoProposalSchema } from "../reports/schema.ts";

export const seoSuggestionFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    generatedAt: z.string().datetime(),
    reportId: z.string().min(1),
    project: z.string().min(1),
    proposals: z.array(seoProposalSchema),
  })
  .strict();

export type SeoSuggestionFile = z.infer<typeof seoSuggestionFileSchema>;

export function parseSeoSuggestionFile(raw: unknown): SeoSuggestionFile {
  return seoSuggestionFileSchema.parse(raw);
}
