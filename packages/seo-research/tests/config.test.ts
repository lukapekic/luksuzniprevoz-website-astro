import { describe, expect, it } from "vitest";
import { defineSeoResearchConfig } from "../src/config/define-config.ts";

function validConfig() {
  return {
    schemaVersion: 1 as const,
    targets: [
      {
        routeKey: "serviceA",
        intent: "transactional" as const,
        locales: {
          en: {
            primaryKeyword: "service a",
            search: { languageCode: "en", countryCode: "rs" },
          },
        },
      },
    ],
  };
}

describe("SEO research configuration", () => {
  it("applies bounded defaults", () => {
    const config = defineSeoResearchConfig(validConfig());
    expect(config.targets[0]?.locales["en"]?.search.device).toBe("desktop");
    expect(config.targets[0]?.locales["en"]?.search.numResults).toBe(20);
    expect(config.limits.maxQueriesPerRun).toBe(20);
    expect(config.competitors).toEqual([]);
  });

  it("rejects unknown keys", () => {
    expect(() =>
      defineSeoResearchConfig({
        ...validConfig(),
        site: "https://duplicated-site-truth.example",
      } as ReturnType<typeof validConfig>),
    ).toThrow(/Unrecognized key/);
  });

  it("rejects duplicate route targets", () => {
    const target = validConfig().targets[0]!;
    expect(() => defineSeoResearchConfig({ ...validConfig(), targets: [target, target] })).toThrow(
      /Duplicate research target/,
    );
  });
});
