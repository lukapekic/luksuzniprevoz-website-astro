import type { EvidenceReference, SeoFinding, SeoProposal } from "../reports/schema.ts";

export interface SeoSuggestionInput {
  readonly reportId: string;
  readonly project: string;
  readonly routeKey: string;
  readonly locale: string;
  readonly sourcePath: string;
  readonly sourceDigest: string;
  readonly allowedFieldPaths: readonly string[];
  readonly currentValues: Readonly<Record<string, string>>;
  readonly evidence: readonly EvidenceReference[];
  readonly findings: readonly SeoFinding[];
  readonly constraints: readonly string[];
}

export interface SeoSuggestionProvider {
  readonly id: string;
  generate(input: SeoSuggestionInput): Promise<readonly SeoProposal[]>;
}
