import {
  seoResearchConfigSchema,
  type SeoResearchConfig,
  type SeoResearchConfigInput,
} from "./schema.ts";

export function defineSeoResearchConfig(input: SeoResearchConfigInput): SeoResearchConfig {
  return seoResearchConfigSchema.parse(input);
}
