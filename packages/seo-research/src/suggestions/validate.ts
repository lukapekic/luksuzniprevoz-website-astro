import { seoSuggestionFileSchema, type SeoSuggestionFile } from "./schema.ts";

export interface SuggestionValidationContext {
  readonly reportId: string;
  readonly project: string;
  readonly routeKey: string;
  readonly locale: string;
  readonly sourcePath: string;
  readonly sourceDigest: string;
  readonly allowedFieldPaths: ReadonlySet<string>;
  readonly evidenceIds: ReadonlySet<string>;
}

export function validateSuggestionFile(
  raw: unknown,
  context: SuggestionValidationContext,
): SeoSuggestionFile {
  const parsed = seoSuggestionFileSchema.parse(raw);
  if (parsed.reportId !== context.reportId) throw new Error("Suggestion reportId does not match");
  if (parsed.project !== context.project) throw new Error("Suggestion project does not match");

  for (const proposal of parsed.proposals) {
    if (proposal.target.routeKey !== context.routeKey)
      throw new Error(`Unknown proposal routeKey: ${proposal.target.routeKey}`);
    if (proposal.target.locale !== context.locale)
      throw new Error(`Unknown proposal locale: ${proposal.target.locale}`);
    if (proposal.target.sourcePath !== context.sourcePath)
      throw new Error(`Proposal sourcePath does not match: ${proposal.target.sourcePath}`);
    if (proposal.sourceDigest !== context.sourceDigest)
      throw new Error(`Stale proposal sourceDigest: ${proposal.id}`);
    if (!context.allowedFieldPaths.has(proposal.target.fieldPath))
      throw new Error(`Proposal field is not allowed: ${proposal.target.fieldPath}`);
    for (const evidenceId of proposal.evidenceIds) {
      if (!context.evidenceIds.has(evidenceId))
        throw new Error(`Unknown evidence id ${evidenceId} in proposal ${proposal.id}`);
    }
    if (proposal.factImpact === "new-claim" && proposal.proposedValue !== null) {
      throw new Error(
        `New-claim proposal ${proposal.id} must not contain publishable replacement content`,
      );
    }
  }

  return parsed;
}
