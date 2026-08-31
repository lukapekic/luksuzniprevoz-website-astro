export { defineSeoResearchConfig } from "./config/define-config.ts";
export { loadSeoResearchConfig } from "./config/load-config.ts";
export {
  seoResearchConfigSchema,
  type SeoResearchConfig,
  type SeoResearchConfigInput,
  type SeoResearchTarget,
  type LocaleSearchTarget,
  type CompetitorTarget,
} from "./config/schema.ts";
export {
  runSeoResearch,
  type RunSeoResearchOptions,
  type RunSeoResearchOptions as SeoResearchRequest,
} from "./reports/build-report.ts";
export { renderSeoResearchMarkdown } from "./reports/markdown.ts";
export {
  seoResearchReportSchema,
  parseSeoResearchReport,
  type SeoResearchReport,
  type SeoFinding,
  type SeoProposal,
  type EvidenceReference,
  type EvidenceReference as SeoEvidence,
} from "./reports/schema.ts";
export { compareSeoSnapshots } from "./storage/snapshots.ts";
export {
  seoSuggestionFileSchema,
  parseSeoSuggestionFile,
  type SeoSuggestionFile,
} from "./suggestions/schema.ts";
export { validateSuggestionFile } from "./suggestions/validate.ts";
export { buildSuggestionInput, allowedSuggestionFieldPaths } from "./suggestions/input.ts";
export type { SeoSuggestionInput, SeoSuggestionProvider } from "./suggestions/provider.ts";
