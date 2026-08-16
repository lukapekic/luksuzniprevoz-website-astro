import type { FoundationIssue } from "../core/errors.ts";
import type { FoundationConfig } from "../core/config.ts";
import { BaseContentSchema, BaseSeoSchema } from "../content/schemas.ts";
import { createHash } from "node:crypto";

export interface ContentFile {
  filePath: string;
  frontmatter: Record<string, unknown>;
  raw: string;
}

/**
 * Extract the Markdown body (everything after the YAML frontmatter).
 * FND-LIFE-07: the body is part of the source digest so a body edit on the
 * source is detected as a translation-staleness event.
 */
export function extractBody(raw: string): string {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return m ? m[2] ?? "" : raw;
}

/**
 * FND-LIFE-07: compute a stable digest over a content entry's *translatable*
 * fields — the body Markdown plus the translatable frontmatter (seoTitle,
 * seoDescription, h1, intro, ogImageAlt, sections, faqs). Lifecycle metadata
 * (status, translationState, sourceLocale, sourceDigest, reviewedOn) and
 * structural/asset fields (routeKey, locale, noindex, ogImage) are excluded so
 * that a status change or a re-review does NOT invalidate translations — only
 * a change to the translatable content does.
 *
 * Uses sha256 (node:crypto, built-in — no dependency). The object is
 * canonicalized with sorted keys so field order in frontmatter is irrelevant.
 */
export function computeSourceDigest(frontmatter: Record<string, unknown>, body: string): string {
  const translatable: Record<string, unknown> = {};
  for (const key of [
    "seoTitle",
    "seoDescription",
    "h1",
    "intro",
    "ogImageAlt",
    "sections",
    "faqs",
  ]) {
    if (frontmatter[key] !== undefined) translatable[key] = frontmatter[key];
  }
  translatable["body"] = body.trim();
  const canonical = JSON.stringify(translatable, Object.keys(translatable).sort());
  return createHash("sha256").update(canonical, "utf8").digest("hex").slice(0, 16);
}

export interface ValidateContentOptions {
  config: FoundationConfig;
  routes: readonly { key: string; slugs: Record<string, string | undefined>; parent?: string }[];
  contentFiles: ContentFile[];
  /** Pinnable "now" (ISO date) for deterministic staleness-window tests. */
  now?: string;
}

/**
 * Minimal frontmatter parser (YAML subset)
 */
export function parseFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const result: Record<string, unknown> = {};
  for (const line of match[1]!.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: unknown = line.slice(colonIdx + 1).trim();
    if (value === "" || value === undefined) continue;
    if (typeof value === "string") {
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      } else if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      }
    }
    result[key] = value;
  }
  return result;
}

/**
 * Validates content files against routes and config.
 */
export function validateContent(opts: ValidateContentOptions): FoundationIssue[] {
  const { routes, contentFiles } = opts;
  const issues: FoundationIssue[] = [];
  const routeKeys = new Set(routes.map((r) => r.key));

  for (const cf of contentFiles) {
    const fm = cf.frontmatter;
    const routeKey = String(fm["routeKey"] ?? "");
    const locale = String(fm["locale"] ?? "");
    const status = String(fm["status"] ?? "draft");

    // FND-DATA-05: Content binds to routes by explicit key
    if (!routeKey) {
      issues.push({
        ruleId: "FND-DATA-05",
        severity: "error",
        filePath: cf.filePath,
        offendingValue: "Missing routeKey in frontmatter",
        expectedValue: "A valid route key from the route map",
        docAnchor: "#FND-DATA-05",
      });
    } else if (!routeKeys.has(routeKey)) {
      issues.push({
        ruleId: "FND-DATA-05",
        severity: "error",
        filePath: cf.filePath,
        offendingValue: `Unknown route key: "${routeKey}"`,
        docAnchor: "#FND-DATA-05",
      });
    }

    // FND-DATA-07: Validate against BaseContentSchema
    const baseResult = BaseContentSchema.safeParse({
      routeKey,
      locale,
      status,
      translationState: fm["translationState"],
      sourceLocale: fm["sourceLocale"],
      sourceDigest: fm["sourceDigest"],
      reviewedOn: fm["reviewedOn"],
    });
    if (!baseResult.success) {
      for (const err of baseResult.error.issues) {
        issues.push({
          ruleId: "FND-DATA-07",
          severity: "error",
          filePath: cf.filePath,
          offendingValue: `${err.path.join(".")}: ${err.message}`,
          docAnchor: "#FND-DATA-07",
        });
      }
    }

    // Validate against BaseSeoSchema
    const seoResult = BaseSeoSchema.safeParse({
      seoTitle: fm["seoTitle"],
      seoDescription: fm["seoDescription"],
      ogImage: fm["ogImage"],
      ogImageAlt: fm["ogImageAlt"],
      noindex: fm["noindex"],
    });
    if (!seoResult.success) {
      for (const err of seoResult.error.issues) {
        issues.push({
          ruleId: "FND-DATA-07",
          severity: "error",
          filePath: cf.filePath,
          offendingValue: `seo.${err.path.join(".")}: ${err.message}`,
          docAnchor: "#FND-DATA-07",
        });
      }
    }

    // FND-LIFE-02: Valid status
    const validStatuses = new Set(["draft", "in-review", "published"]);
    if (!validStatuses.has(status)) {
      issues.push({
        ruleId: "FND-LIFE-02",
        severity: "error",
        filePath: cf.filePath,
        offendingValue: `Invalid status: "${status}"`,
        expectedValue: "One of: draft, in-review, published",
        docAnchor: "#FND-LIFE-02",
      });
    }

    // FND-LIFE-06 / FND-LIFE-08: body linting (dependency-free; a full
    // remark/rehype pipeline is optional for larger sites — see
    // docs/scale-envelope.md). Checks the high-value defect classes:
    //  - h1 in body (the h1 belongs in frontmatter)
    //  - heading-level skips (h2 → h4 with no h3)
    //  - raw <script> / inline style= / un-allow-listed HTML
    //  - non-descriptive link text ("click here", "read more", …)
    //  - Markdown image syntax ![alt](url) (use the frontmatter `images` field
    //    + the Image primitive so alt/role are structured — FND-LIFE-08)
    const body = extractBody(cf.raw);
    const bodyIssues = lintContentBody(body);
    for (const bi of bodyIssues) {
      issues.push({ ...bi, filePath: cf.filePath });
    }
  }

  // FND-LIFE-01 / FND-LIFE-07: lifecycle fields + source-digest staleness.
  // An entry is a "source" when it has no sourceLocale (or sourceLocale === its
  // own locale); it is a "translation" when sourceLocale is set and differs.
  const byRoute = new Map<string, ContentFile[]>();
  for (const cf of contentFiles) {
    const rk = String(cf.frontmatter["routeKey"] ?? "");
    if (!rk) continue;
    if (!byRoute.has(rk)) byRoute.set(rk, []);
    byRoute.get(rk)!.push(cf);
  }

  for (const cf of contentFiles) {
    const fm = cf.frontmatter;
    const locale = String(fm["locale"] ?? "");
    const sourceLocale = fm["sourceLocale"] !== undefined ? String(fm["sourceLocale"]) : undefined;
    const isTranslation = sourceLocale !== undefined && sourceLocale !== locale;
    const translationState = String(fm["translationState"] ?? "missing");

    // FND-LIFE-01: translations must record their source locale + the digest of
    // the source they were reviewed against. Without sourceDigest, staleness
    // cannot be detected.
    if (isTranslation && sourceLocale !== undefined) {
      if (fm["sourceDigest"] === undefined || String(fm["sourceDigest"]) === "") {
        issues.push({
          ruleId: "FND-LIFE-01",
          severity: "error",
          filePath: cf.filePath,
          offendingValue: `Translation (locale "${locale}") is missing sourceDigest`,
          expectedValue: `sourceDigest of the "${sourceLocale}" source entry (run pnpm content:sync-digests)`,
          fix: "Compute the source digest and record it as sourceDigest",
          docAnchor: "#FND-LIFE-01",
        });
      }
    }

    // FND-LIFE-01: a reviewed translation must record when it was reviewed.
    if (translationState === "reviewed") {
      if (fm["reviewedOn"] === undefined || String(fm["reviewedOn"]) === "") {
        issues.push({
          ruleId: "FND-LIFE-01",
          severity: "error",
          filePath: cf.filePath,
          offendingValue: `translationState is "reviewed" but reviewedOn is missing`,
          expectedValue: "An ISO date (YYYY-MM-DD)",
          fix: "Record the review date as reviewedOn",
          docAnchor: "#FND-LIFE-01",
        });
      }
    }
  }

  // FND-LIFE-07: source-digest staleness. For each route, recompute the source
  // entry's digest from its current body+SEO and compare to each translation's
  // stored sourceDigest. A mismatch means the source changed after the
  // translation was last reviewed → the translation is stale.
  for (const [, files] of byRoute) {
    // The source entry: the one with no sourceLocale (or sourceLocale === locale).
    const source = files.find(
      (f) =>
        f.frontmatter["sourceLocale"] === undefined ||
        String(f.frontmatter["sourceLocale"]) === String(f.frontmatter["locale"] ?? ""),
    );
    if (!source) continue; // no source to compare against

    const sourceDigest = computeSourceDigest(source.frontmatter, extractBody(source.raw));

    for (const cf of files) {
      if (cf === source) continue;
      const fm = cf.frontmatter;
      const locale = String(fm["locale"] ?? "");
      const storedDigest = fm["sourceDigest"];
      if (storedDigest === undefined || String(storedDigest) === "") continue; // reported by FND-LIFE-01
      if (String(storedDigest) !== sourceDigest) {
        const translationState = String(fm["translationState"] ?? "missing");
        // A stale translation that is still marked "reviewed" is an error: it
        // claims to be current but its source has moved on. A stale translation
        // already demoted to "draft" is the expected, healthy state.
        if (translationState === "reviewed") {
          issues.push({
            ruleId: "FND-LIFE-07",
            severity: "error",
            filePath: cf.filePath,
            offendingValue: `Translation (locale "${locale}") is marked reviewed but its sourceDigest is stale (stored "${storedDigest}", source is now "${sourceDigest}")`,
            expectedValue: "translationState set to draft, or re-review and update sourceDigest",
            fix: `Re-translate against the updated source, then set translationState: draft → reviewed and sourceDigest: ${sourceDigest}`,
            docAnchor: "#FND-LIFE-07",
          });
        }
      }
    }
  }

  // FND-I18N-10 / FND-LIFE-03: locale parity. The numerator counts only locales
  // whose translation is reviewed — an unreviewed/stale translation does not
  // count toward coverage, since it is not shippable.
  const parityFloor = opts.config.locales.parityFloor;
  if (typeof parityFloor === "number" && parityFloor > 0) {
    const localeCount = opts.config.locales.locales.length;
    for (const route of routes) {
      const files = byRoute.get(route.key) ?? [];
      if (files.length === 0) continue;
      const reviewedLocales = new Set(
        files
          .filter((f) => String(f.frontmatter["translationState"] ?? "missing") === "reviewed")
          .map((f) => String(f.frontmatter["locale"] ?? "")),
      );
      const parity = reviewedLocales.size / localeCount;
      if (parity < parityFloor) {
        issues.push({
          ruleId: "FND-I18N-10",
          severity: "warning",
          filePath: "(content parity)",
          offendingValue: `Route "${route.key}" is reviewed in ${reviewedLocales.size}/${localeCount} locales (${Math.round(parity * 100)}%)`,
          expectedValue: `At least ${Math.round(parityFloor * 100)}% reviewed coverage (parityFloor: ${parityFloor})`,
          fix: "Review and translate the remaining locales, or lower parityFloor",
          docAnchor: "#FND-I18N-10",
        });
      }
    }
  }

  // FND-LIFE-09: review staleness window. A reviewed entry older than
  // `reviewStalenessWindowMonths` is stale and should be re-reviewed. This is
  // a WARNING by default; a future `reviewCritical` route flag (not yet in the
  // schema) would escalate it to an error — that is the documented trim point.
  const windowMonths = opts.config.reviewStalenessWindowMonths;
  if (typeof windowMonths === "number" && windowMonths > 0) {
    const now = opts.now ? Date.parse(opts.now) : Date.now();
    const windowMs = windowMonths * 30 * 24 * 60 * 60 * 1000;
    for (const cf of contentFiles) {
      const reviewedOn = cf.frontmatter["reviewedOn"];
      if (reviewedOn === undefined) continue;
      const ts = Date.parse(String(reviewedOn));
      if (Number.isNaN(ts)) continue;
      if (now - ts > windowMs) {
        const ageMonths = Math.round((now - ts) / (30 * 24 * 60 * 60 * 1000));
        issues.push({
          ruleId: "FND-LIFE-09",
          severity: "warning",
          filePath: cf.filePath,
          offendingValue: `Review is stale: reviewedOn "${reviewedOn}" is ~${ageMonths} months old (window: ${windowMonths})`,
          expectedValue: `Re-review within ${windowMonths} months, or update reviewedOn`,
          fix: "Re-review the entry and refresh reviewedOn",
          docAnchor: "#FND-LIFE-09",
        });
      }
    }
  }

  // FND-DATA-04: Cross-references (parent refs)
  for (const route of routes) {
    if (route.parent && !routeKeys.has(route.parent)) {
      issues.push({
        ruleId: "FND-DATA-04",
        severity: "error",
        filePath: "(routes)",
        offendingValue: `Route "${route.key}" references unknown parent "${route.parent}"`,
        docAnchor: "#FND-DATA-04",
      });
    }
  }

  return issues;
}

// Non-descriptive link text that conveys no meaning out of context.
const NON_DESCRIPTIVE_LINKS = [
  "click here",
  "read more",
  "learn more",
  "more",
  "here",
  "this link",
  "link",
  "details",
];

/**
 * FND-LIFE-06 / FND-LIFE-08: lint a Markdown body for the high-value content
 * defect classes. Returns issues WITHOUT filePath (the caller attaches it).
 *
 * Intentionally regex-based and dependency-free — a full remark/rehype
 * pipeline is an optional upgrade for larger sites (see docs/scale-envelope.md).
 * The checks here catch the defect classes that scale with a template.
 */
export function lintContentBody(body: string): Omit<FoundationIssue, "filePath">[] {
  const issues: Omit<FoundationIssue, "filePath">[] = [];
  const lines = body.split("\n");

  // FND-LIFE-06: the page <h1> is authored in frontmatter (h1 field); a `#`
  // heading in the body duplicates it and breaks the single-h1 contract.
  for (const line of lines) {
    if (/^#\s+\S/.test(line)) {
      issues.push({
        ruleId: "FND-LIFE-06",
        severity: "error",
        offendingValue: `Body contains an h1 ("${line.trim().slice(0, 60)}"); the h1 belongs in frontmatter`,
        expectedValue: "Body headings start at h2 (##)",
        fix: "Change the body heading to ## or move the text to frontmatter h1",
        docAnchor: "#FND-LIFE-06",
      });
      break; // one report is enough
    }
  }

  // FND-LIFE-06: heading-level skips (e.g. h2 → h4 with no h3).
  let prevLevel = 0;
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+\S/);
    if (!m) continue;
    const level = m[1]!.length;
    if (level !== 1 && prevLevel !== 0 && level > prevLevel + 1) {
      issues.push({
        ruleId: "FND-LIFE-06",
        severity: "warning",
        offendingValue: `Heading skips from h${prevLevel} to h${level}`,
        expectedValue: "Headings increase by one level at a time",
        fix: `Insert an h${prevLevel + 1} or change to h${prevLevel + 1}`,
        docAnchor: "#FND-LIFE-06",
      });
    }
    prevLevel = level;
  }

  // FND-LIFE-06: raw <script> and inline style= are not allowed in bodies.
  if (/<script\b/i.test(body)) {
    issues.push({
      ruleId: "FND-LIFE-06",
      severity: "error",
      offendingValue: "Body contains a <script> element",
      expectedValue: "No executable markup in content bodies",
      fix: "Remove the <script>; interactive behavior belongs in an island",
      docAnchor: "#FND-LIFE-06",
    });
  }
  for (const m of body.matchAll(/<(\w+)([^>]*\s)style\s*=\s*["'][^"']*["']/gi)) {
    issues.push({
      ruleId: "FND-LIFE-06",
      severity: "error",
      offendingValue: `Inline style= on <${m[1]}> in body`,
      expectedValue: "Styling via theme tokens / classes, not inline styles",
      fix: "Move the styling to a class or theme token",
      docAnchor: "#FND-LIFE-06",
    });
  }

  // FND-LIFE-06: non-descriptive link text.
  for (const m of body.matchAll(/\[([^\]]+)\]\([^)]+\)/g)) {
    const text = m[1]!.trim().toLowerCase();
    if (NON_DESCRIPTIVE_LINKS.includes(text)) {
      issues.push({
        ruleId: "FND-LIFE-06",
        severity: "warning",
        offendingValue: `Non-descriptive link text: "${m[1]}"`,
        expectedValue: "Link text that describes the destination in context",
        fix: "Rewrite the link text to describe where it goes",
        docAnchor: "#FND-LIFE-06",
      });
    }
  }

  // FND-LIFE-08: Markdown image syntax ![alt](url) is forbidden in bodies —
  // images must go through the frontmatter `images` field + the Image
  // primitive so alt/role/dimensions are structured and validated.
  for (const m of body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    issues.push({
      ruleId: "FND-LIFE-08",
      severity: "error",
      offendingValue: `Markdown image syntax in body: ![${m[1]}](${m[2]})`,
      expectedValue: "Images declared in frontmatter `images` and rendered via the Image primitive",
      fix: "Move the image to the frontmatter images field (role + alt) and render it with <Image />",
      docAnchor: "#FND-LIFE-08",
    });
  }

  return issues;
}
