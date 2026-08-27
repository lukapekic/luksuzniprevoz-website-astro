import { describe, it, expect } from "vitest";
import {
  validateContent,
  parseFrontmatter,
  computeSourceDigest,
  extractBody,
} from "../../../src/validators/validate-content.ts";

describe("validateContent", () => {
  function makeConfig() {
    return {
      foundationVersion: "0.1.0",
      site: "https://test.example.com",
      brand: "Test",
      locales: {
        locales: [
          {
            code: "en",
            htmlLang: "en",
            hreflang: "en",
            label: "English",
            dir: "ltr" as const,
            isDefault: true,
            isXDefault: true,
            intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
          },
          {
            code: "fr",
            htmlLang: "fr",
            hreflang: "fr",
            label: "Français",
            dir: "ltr" as const,
            isDefault: false,
            isXDefault: false,
            intl: { dateTimeLocale: "fr-FR", numberLocale: "fr-FR" },
          },
        ],
        missingTranslation: "omit" as const,
        parityFloor: 1,
        fallbackLocale: undefined,
      },
      capabilities: {
        forms: false,
        legalPages: false,
        consentBanner: false,
        thirdParty: [],
        structuredData: [],
        ogImages: "static" as const,
      },
    };
  }

  const routes = [
    { key: "home", slugs: { en: "", fr: "" } },
    { key: "airport", slugs: { en: "airport", fr: "aeroport" }, parent: "home" },
  ];

  it("returns no issues for valid content files", () => {
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [
        {
          filePath: "home-en.md",
          raw: "---\nrouteKey: home\nlocale: en\nstatus: published\ntranslationState: reviewed\nreviewedOn: 2026-01-15\nseoTitle: 'Home'\nseoDescription: 'Welcome'\n---\n",
          frontmatter: parseFrontmatter(
            "---\nrouteKey: home\nlocale: en\nstatus: published\ntranslationState: reviewed\nreviewedOn: 2026-01-15\nseoTitle: 'Home'\nseoDescription: 'Welcome'\n---\n",
          ),
        },
        {
          filePath: "home-fr.md",
          raw: "---\nrouteKey: home\nlocale: fr\nstatus: published\ntranslationState: reviewed\nreviewedOn: 2026-01-15\nseoTitle: 'Accueil'\nseoDescription: 'Bienvenue'\n---\n",
          frontmatter: parseFrontmatter(
            "---\nrouteKey: home\nlocale: fr\nstatus: published\ntranslationState: reviewed\nreviewedOn: 2026-01-15\nseoTitle: 'Accueil'\nseoDescription: 'Bienvenue'\n---\n",
          ),
        },
        ...["en", "fr"].map((locale) => {
          const raw = `---\nrouteKey: airport\nlocale: ${locale}\npageType: scaffold\ntargetPageType: service\nscaffold: true\nstatus: draft\ntranslationState: missing\nnoindex: true\n---\n`;
          return { filePath: `airport-${locale}.md`, raw, frontmatter: parseFrontmatter(raw) };
        }),
      ],
    });
    const errors = issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
  });

  it("requires a content identity for every configured route and locale", () => {
    const raw =
      "---\nrouteKey: home\nlocale: en\nstatus: published\ntranslationState: reviewed\nreviewedOn: 2026-01-15\nseoTitle: 'Home'\nseoDescription: 'Welcome'\n---\n";
    const issues = validateContent({
      config: makeConfig(),
      routes: [{ key: "home", slugs: { en: "", fr: "" } }],
      contentFiles: [{ filePath: "home-en.md", raw, frontmatter: parseFrontmatter(raw) }],
    });

    expect(
      issues.some(
        (issue) =>
          issue.ruleId === "FND-I18N-10" &&
          issue.severity === "error" &&
          issue.offendingValue?.includes('missing its "fr" content file'),
      ),
    ).toBe(true);
  });

  it("detects missing routeKey (FND-DATA-05)", () => {
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [
        {
          filePath: "no-route-key.md",
          raw: "---\nlocale: en\nstatus: published\nseoTitle: 'Title'\nseoDescription: 'Desc'\n---\n",
          frontmatter: parseFrontmatter(
            "---\nlocale: en\nstatus: published\nseoTitle: 'Title'\nseoDescription: 'Desc'\n---\n",
          ),
        },
      ],
    });
    const data05 = issues.filter((i) => i.ruleId === "FND-DATA-05");
    expect(data05.length).toBe(1);
    expect(data05[0]!.offendingValue).toContain("Missing routeKey");
  });

  it("detects unknown route key (FND-DATA-05)", () => {
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [
        {
          filePath: "unknown-route.md",
          raw: "---\nrouteKey: nonexistent\nlocale: en\nstatus: published\nseoTitle: 'T'\nseoDescription: 'D'\n---\n",
          frontmatter: parseFrontmatter(
            "---\nrouteKey: nonexistent\nlocale: en\nstatus: published\nseoTitle: 'T'\nseoDescription: 'D'\n---\n",
          ),
        },
      ],
    });
    const data05 = issues.filter((i) => i.ruleId === "FND-DATA-05");
    expect(data05.length).toBe(1);
    expect(data05[0]!.offendingValue).toContain("Unknown route key");
  });

  it("detects missing seoTitle (FND-DATA-07)", () => {
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [
        {
          filePath: "no-seo.md",
          raw: "---\nrouteKey: home\nlocale: en\nstatus: published\nseoDescription: 'Desc'\n---\n",
          frontmatter: parseFrontmatter(
            "---\nrouteKey: home\nlocale: en\nstatus: published\nseoDescription: 'Desc'\n---\n",
          ),
        },
      ],
    });
    const data07 = issues.filter(
      (i) => i.ruleId === "FND-DATA-07" && i.offendingValue?.includes("seoTitle"),
    );
    expect(data07.length).toBeGreaterThan(0);
  });

  it("detects invalid status (FND-LIFE-02)", () => {
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [
        {
          filePath: "bad-status.md",
          raw: "---\nrouteKey: home\nlocale: en\nstatus: bananas\nseoTitle: 'T'\nseoDescription: 'D'\n---\n",
          frontmatter: parseFrontmatter(
            "---\nrouteKey: home\nlocale: en\nstatus: bananas\nseoTitle: 'T'\nseoDescription: 'D'\n---\n",
          ),
        },
      ],
    });
    const life02 = issues.filter((i) => i.ruleId === "FND-LIFE-02");
    expect(life02.length).toBe(1);
    expect(life02[0]!.offendingValue).toContain("bananas");
  });

  it("detects unknown parent route (FND-DATA-04)", () => {
    const issues = validateContent({
      config: makeConfig(),
      routes: [
        { key: "home", slugs: { en: "", fr: "" } },
        { key: "orphan", slugs: { en: "orphan", fr: "orphan" }, parent: "nonexistent-parent" },
      ],
      contentFiles: [],
    });
    const data04 = issues.filter((i) => i.ruleId === "FND-DATA-04");
    expect(data04.length).toBe(1);
    expect(data04[0]!.offendingValue).toContain("unknown parent");
  });
});

describe("parseFrontmatter", () => {
  it("parses basic frontmatter", () => {
    const result = parseFrontmatter("---\nrouteKey: home\nlocale: en\nstatus: published\n---\n");
    expect(result["routeKey"]).toBe("home");
    expect(result["locale"]).toBe("en");
    expect(result["status"]).toBe("published");
  });

  it("parses quoted strings", () => {
    const result = parseFrontmatter('---\ntitle: "Hello World"\n---\n');
    expect(result["title"]).toBe("Hello World");
  });

  it("parses booleans", () => {
    const result = parseFrontmatter("---\nnoindex: true\n---\n");
    expect(result["noindex"]).toBe(true);
  });

  it("returns empty object for no frontmatter", () => {
    const result = parseFrontmatter("# No frontmatter here\n");
    expect(result).toEqual({});
  });
});

describe("content lifecycle (FND-LIFE-01 / FND-LIFE-07 / FND-I18N-10)", () => {
  // makeConfig: en is default/source, fr is a translation locale.
  function makeConfig(parityFloor = 0) {
    return {
      foundationVersion: "0.1.0",
      site: "https://test.example.com",
      brand: "Test",
      locales: {
        locales: [
          {
            code: "en",
            htmlLang: "en",
            hreflang: "en",
            label: "English",
            dir: "ltr" as const,
            isDefault: true,
            isXDefault: true,
            intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
          },
          {
            code: "fr",
            htmlLang: "fr",
            hreflang: "fr",
            label: "Français",
            dir: "ltr" as const,
            isDefault: false,
            isXDefault: false,
            intl: { dateTimeLocale: "fr-FR", numberLocale: "fr-FR" },
          },
        ],
        missingTranslation: "omit" as const,
        parityFloor,
        fallbackLocale: undefined,
      },
      capabilities: {
        forms: false,
        legalPages: false,
        consentBanner: false,
        thirdParty: [],
        structuredData: [],
        ogImages: "static" as const,
      },
    };
  }

  const routes = [{ key: "home", slugs: { en: "", fr: "" } }];

  function sourceFile(body = "Hello world.") {
    const raw = `---\nrouteKey: home\nlocale: en\nstatus: published\ntranslationState: reviewed\nreviewedOn: 2025-01-15\nseoTitle: Home\nseoDescription: Welcome\nh1: Home\n---\n${body}\n`;
    return { filePath: "home-en.md", raw, frontmatter: parseFrontmatter(raw) };
  }

  function translationFile(opts: {
    digest: string;
    state?: string;
    reviewedOn?: string | null; // null = explicitly omit
    body?: string;
  }) {
    const state = opts.state ?? "reviewed";
    // null = omit; undefined = auto (add iff reviewed); string = use as-is
    const reviewed =
      opts.reviewedOn === null
        ? undefined
        : (opts.reviewedOn ?? (state === "reviewed" ? "2025-01-15" : undefined));
    const fmLines = [
      "routeKey: home",
      "locale: fr",
      `status: published`,
      `translationState: ${state}`,
      `sourceLocale: en`,
      `sourceDigest: ${opts.digest}`,
    ];
    if (reviewed) fmLines.push(`reviewedOn: ${reviewed}`);
    fmLines.push("seoTitle: Accueil", "seoDescription: Bienvenue", "h1: Accueil");
    const raw = `---\n${fmLines.join("\n")}\n---\n${opts.body ?? "Bonjour."}\n`;
    return { filePath: "home-fr.md", raw, frontmatter: parseFrontmatter(raw) };
  }

  it("FND-LIFE-07: a translation reviewed against the current source has no staleness issue", () => {
    const src = sourceFile("Hello world.");
    const digest = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [src, translationFile({ digest })],
    });
    expect(issues.filter((i) => i.ruleId === "FND-LIFE-07")).toEqual([]);
  });

  it("FND-LIFE-07: a source body change makes a reviewed translation stale (error)", () => {
    // Translation was reviewed against the OLD source body.
    const oldSrc = sourceFile("Hello world.");
    const oldDigest = computeSourceDigest(oldSrc.frontmatter, extractBody(oldSrc.raw));
    // Source body then changed.
    const newSrc = sourceFile("Hello NEW world.");
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [newSrc, translationFile({ digest: oldDigest })],
    });
    const stale = issues.filter((i) => i.ruleId === "FND-LIFE-07");
    expect(stale.length).toBe(1);
    expect(stale[0]!.severity).toBe("error");
    expect(stale[0]!.offendingValue).toContain("stale");
  });

  it("FND-LIFE-07: a stale translation demoted to 'draft' is not an error", () => {
    const oldSrc = sourceFile("Hello world.");
    const oldDigest = computeSourceDigest(oldSrc.frontmatter, extractBody(oldSrc.raw));
    const newSrc = sourceFile("Hello NEW world.");
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [newSrc, translationFile({ digest: oldDigest, state: "draft" })],
    });
    expect(issues.filter((i) => i.ruleId === "FND-LIFE-07")).toEqual([]);
  });

  it("FND-LIFE-01: a translation missing sourceDigest is flagged", () => {
    const src = sourceFile();
    const fr = translationFile({ digest: "deadbeef" });
    delete fr.frontmatter["sourceDigest"];
    fr.raw = fr.raw.replace(/sourceDigest: deadbeef\n/, "");
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [src, fr],
    });
    const life01 = issues.filter(
      (i) => i.ruleId === "FND-LIFE-01" && i.offendingValue?.includes("sourceDigest"),
    );
    expect(life01.length).toBe(1);
  });

  it("FND-LIFE-01: a reviewed translation missing reviewedOn is flagged", () => {
    const src = sourceFile();
    const digest = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    const fr = translationFile({ digest, reviewedOn: null });
    const issues = validateContent({
      config: makeConfig(),
      routes,
      contentFiles: [src, fr],
    });
    const life01 = issues.filter(
      (i) => i.ruleId === "FND-LIFE-01" && i.offendingValue?.includes("reviewedOn"),
    );
    expect(life01.length).toBe(1);
  });

  it("FND-I18N-10: parity counts only reviewed translations", () => {
    const src = sourceFile();
    const digest = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    // fr is only "draft" → reviewed coverage is 1/2 (en only) = 50% < floor 100%.
    const issues = validateContent({
      config: makeConfig(1),
      routes,
      contentFiles: [src, translationFile({ digest, state: "draft" })],
    });
    const parity = issues.filter((i) => i.ruleId === "FND-I18N-10");
    expect(parity.length).toBe(1);
    expect(parity[0]!.offendingValue).toContain("1/2");
  });

  it("FND-I18N-10: full reviewed coverage meets the floor", () => {
    const src = sourceFile();
    const digest = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    const issues = validateContent({
      config: makeConfig(1),
      routes,
      contentFiles: [src, translationFile({ digest })],
    });
    expect(issues.filter((i) => i.ruleId === "FND-I18N-10")).toEqual([]);
  });

  it("computeSourceDigest is stable (same input → same digest)", () => {
    const src = sourceFile("Stable body.");
    const d1 = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    const d2 = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    expect(d1).toBe(d2);
    expect(d1).toHaveLength(16);
  });

  it("computeSourceDigest excludes lifecycle metadata (a status change does not change the digest)", () => {
    const src = sourceFile("Body.");
    const d1 = computeSourceDigest(src.frontmatter, extractBody(src.raw));
    const fm2 = { ...src.frontmatter, status: "draft", reviewedOn: "2026-01-01" };
    const d2 = computeSourceDigest(fm2, extractBody(src.raw));
    expect(d1).toBe(d2);
  });
});

describe("review staleness window (FND-LIFE-09)", () => {
  function makeConfig(windowMonths: number) {
    return {
      foundationVersion: "0.1.0",
      site: "https://test.example.com",
      brand: "Test",
      locales: {
        locales: [
          {
            code: "en",
            htmlLang: "en",
            hreflang: "en",
            label: "English",
            dir: "ltr" as const,
            isDefault: true,
            isXDefault: true,
            intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
          },
        ],
        missingTranslation: "omit" as const,
        parityFloor: 0,
        fallbackLocale: undefined,
      },
      capabilities: {
        forms: false,
        legalPages: false,
        consentBanner: false,
        thirdParty: [],
        structuredData: [],
        ogImages: "static" as const,
      },
      reviewStalenessWindowMonths: windowMonths,
    };
  }

  const routes = [{ key: "home", slugs: { en: "" } }];

  function reviewedFile(reviewedOn: string) {
    const raw = `---\nrouteKey: home\nlocale: en\nstatus: published\ntranslationState: reviewed\nreviewedOn: ${reviewedOn}\nseoTitle: Home\nseoDescription: Welcome\nh1: Home\n---\nBody.\n`;
    return { filePath: "home-en.md", raw, frontmatter: parseFrontmatter(raw) };
  }

  it("warns when reviewedOn is older than the window", () => {
    const issues = validateContent({
      config: makeConfig(12),
      routes,
      contentFiles: [reviewedFile("2025-01-01")],
      now: "2026-08-01", // ~19 months later
    });
    const stale = issues.filter((i) => i.ruleId === "FND-LIFE-09");
    expect(stale.length).toBe(1);
    expect(stale[0]!.severity).toBe("warning");
  });

  it("does not warn when reviewedOn is within the window", () => {
    const issues = validateContent({
      config: makeConfig(12),
      routes,
      contentFiles: [reviewedFile("2026-01-01")],
      now: "2026-08-01", // ~7 months later
    });
    expect(issues.filter((i) => i.ruleId === "FND-LIFE-09")).toEqual([]);
  });

  it("does not warn when no window is configured", () => {
    const issues = validateContent({
      config: { ...makeConfig(12), reviewStalenessWindowMonths: 0 },
      routes,
      contentFiles: [reviewedFile("2020-01-01")],
      now: "2026-08-01",
    });
    expect(issues.filter((i) => i.ruleId === "FND-LIFE-09")).toEqual([]);
  });
});

describe("body linting (FND-LIFE-06 / FND-LIFE-08)", () => {
  function lint(body: string) {
    const raw = `---\nrouteKey: home\nlocale: en\nstatus: published\nseoTitle: Home\nseoDescription: Welcome\nh1: Home\n---\n${body}`;
    const config = {
      foundationVersion: "0.1.0",
      site: "https://t.example.com",
      brand: "T",
      locales: {
        locales: [
          {
            code: "en",
            htmlLang: "en",
            hreflang: "en",
            label: "English",
            dir: "ltr" as const,
            isDefault: true,
            isXDefault: true,
            intl: { dateTimeLocale: "en-US", numberLocale: "en-US" },
          },
        ],
        missingTranslation: "omit" as const,
        parityFloor: 0,
        fallbackLocale: undefined,
      },
      capabilities: {
        forms: false,
        legalPages: false,
        consentBanner: false,
        thirdParty: [],
        structuredData: [],
        ogImages: "static" as const,
      },
      reviewStalenessWindowMonths: 12,
    };
    return validateContent({
      config,
      routes: [{ key: "home", slugs: { en: "" } }],
      contentFiles: [{ filePath: "home-en.md", raw, frontmatter: parseFrontmatter(raw) }],
      now: "2026-01-01",
    });
  }

  it("rejects an h1 in the body (FND-LIFE-06)", () => {
    const issues = lint("# Top heading\n\nText.");
    const h1 = issues.filter((i) => i.ruleId === "FND-LIFE-06" && i.offendingValue?.includes("h1"));
    expect(h1.length).toBe(1);
  });

  it("warns on a heading-level skip (FND-LIFE-06)", () => {
    const issues = lint("## Section\n\n#### Jump\n\nText.");
    const skip = issues.filter(
      (i) => i.ruleId === "FND-LIFE-06" && i.offendingValue?.includes("skips"),
    );
    expect(skip.length).toBe(1);
  });

  it("rejects a <script> in the body (FND-LIFE-06)", () => {
    const issues = lint("<script>alert(1)</script>");
    expect(
      issues.filter((i) => i.ruleId === "FND-LIFE-06" && i.offendingValue?.includes("<script>")),
    ).toHaveLength(1);
  });

  it("rejects inline style= (FND-LIFE-06)", () => {
    const issues = lint('<div style="color:red">x</div>');
    expect(
      issues.filter((i) => i.ruleId === "FND-LIFE-06" && i.offendingValue?.includes("style=")),
    ).toHaveLength(1);
  });

  it("warns on non-descriptive link text (FND-LIFE-06)", () => {
    const issues = lint("See [click here](/x) for details.");
    expect(
      issues.filter((i) => i.ruleId === "FND-LIFE-06" && i.offendingValue?.includes("click here")),
    ).toHaveLength(1);
  });

  it("rejects Markdown image syntax (FND-LIFE-08)", () => {
    const issues = lint("![a cat](/cat.jpg)");
    expect(issues.filter((i) => i.ruleId === "FND-LIFE-08")).toHaveLength(1);
  });

  it("a clean body produces no body-lint issues", () => {
    const issues = lint("## Section\n\nA [contact page](/contact/) link.");
    expect(issues.filter((i) => i.ruleId === "FND-LIFE-06" || i.ruleId === "FND-LIFE-08")).toEqual(
      [],
    );
  });
});
