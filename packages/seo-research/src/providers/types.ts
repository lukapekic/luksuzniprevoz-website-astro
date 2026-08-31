import type { LocaleSearchTarget } from "../config/schema.ts";
import type { SerpEvidence } from "../reports/schema.ts";

export interface SerpSearchRequest {
  readonly target: LocaleSearchTarget;
  readonly siteDomain: string;
}

export interface SerpProvider {
  readonly id: "valueserp";
  search(request: SerpSearchRequest): Promise<SerpEvidence>;
}
