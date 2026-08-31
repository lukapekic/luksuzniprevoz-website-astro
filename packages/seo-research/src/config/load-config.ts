import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { SeoResearchError } from "../errors.ts";
import { seoResearchConfigSchema, type SeoResearchConfig } from "./schema.ts";

export async function loadSeoResearchConfig(projectDirectory: string): Promise<SeoResearchConfig> {
  const configPath = resolve(projectDirectory, "seo-research.config.ts");
  if (!existsSync(configPath)) {
    throw new SeoResearchError(
      `No seo-research.config.ts found at ${configPath}`,
      "missing_research_config",
    );
  }

  const module = (await import(pathToFileURL(configPath).href)) as {
    default?: unknown;
    config?: unknown;
  };
  const value = module.default ?? module.config;
  if (!value) {
    throw new SeoResearchError(
      `SEO research config must export default or named "config": ${configPath}`,
      "invalid_research_config",
    );
  }
  return seoResearchConfigSchema.parse(value);
}
