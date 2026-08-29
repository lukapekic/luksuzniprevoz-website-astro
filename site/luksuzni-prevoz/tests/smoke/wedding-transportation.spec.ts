import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  axeWcag22Tags,
  flowPath,
  reviewViewports,
  routePath,
} from "../support/contracts";

const routes = [
  { locale: "sr", htmlLang: "sr-Latn" },
  { locale: "en", htmlLang: "en" },
  { locale: "ru", htmlLang: "ru" },
] as const;

test.describe("Wedding Transportation", () => {
  for (const route of routes) {
    test(`${route.locale} renders the dedicated published page`, async ({ page }) => {
      const response = await page.goto(routePath("weddingTransportation", route.locale));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main > section")).toHaveCount(11);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(
        3,
      );
    });
  }

  test("preserves the locked content order, counts, fleet order, and canonical actions", async ({
    page,
  }) => {
    await page.goto(routePath("weddingTransportation", "en"));

    const labelledSections = await page
      .locator("main > section")
      .evaluateAll((sections) =>
        sections.map((section) => section.getAttribute("aria-labelledby")),
      );
    expect(labelledSections).toEqual([
      "service-hero-title",
      "occasion-definition-heading",
      "occasion-scope-heading",
      "wedding-day-heading",
      "vehicle-recommendations-heading",
      "wedding-guests-heading",
      "wedding-presentation-heading",
      "occasion-standards-heading",
      "occasion-process-heading",
      "wedding-faq-heading",
      "final-cta-heading",
    ]);

    await expect(page.locator(".principle-list > li")).toHaveCount(3);
    await expect(page.locator(".scope-panel ol > li")).toHaveCount(3);
    await expect(page.locator(".stage-list > li")).toHaveCount(5);
    await expect(page.locator(".guest-groups > li")).toHaveCount(3);
    await expect(page.locator(".standards-matrix > li")).toHaveCount(6);
    await expect(page.locator(".process-panel > li")).toHaveCount(3);
    await expect(page.locator("main details")).toHaveCount(6);

    await expect(page.getByText("Multiple vehicles", { exact: true })).toBeVisible();
    await expect(page.getByText("Mixed vehicle classes", { exact: true })).toBeVisible();
    await expect(page.getByText("Return transport by agreement", { exact: true })).toBeVisible();
    await expect(page.getByText("Waiting by agreement", { exact: true })).toBeVisible();
    await expect(page.getByText("Individual quote", { exact: true })).toBeVisible();

    const vehicleNames = await page.locator(".vehicle h3").allTextContents();
    expect(vehicleNames).toEqual([
      "Mercedes S klasa",
      "Mercedes E klasa",
      "Mercedes V klasa 7+1 Extra Long",
      "Mercedes Sprinter",
    ]);

    const bookingHref = flowPath("booking", "en");
    const quoteHref = flowPath("quote", "en");
    await expect(page.locator(".service-hero__actions a").nth(0)).toHaveAttribute(
      "href",
      bookingHref,
    );
    await expect(page.locator(".service-hero__actions a").nth(1)).toHaveAttribute(
      "href",
      quoteHref,
    );
    await expect(page.locator(".presentation-action a")).toHaveAttribute("href", bookingHref);
    await expect(page.locator(".fcta-actions a").nth(0)).toHaveAttribute("href", bookingHref);
    await expect(page.locator(".fcta-actions a").nth(1)).toHaveAttribute("href", quoteHref);
    await expect(page.getByRole("link", { name: "View all vehicles" })).toHaveAttribute(
      "href",
      routePath("fleet", "en"),
    );
    await expect(page.locator("main a:not([href])")).toHaveCount(0);

    await expect(page.getByText(/Decorations, flowers, ribbons/)).toBeVisible();
    await expect(page.getByText(/manually confirms the organisation/)).toBeAttached();
  });

  test("visible FAQ and FAQ structured data use the same six localized items", async ({ page }) => {
    await page.goto(routePath("weddingTransportation", "en"));

    const visible = await page.locator("main details").evaluateAll((items) =>
      items.map((item) => ({
        question: item.querySelector("summary")?.textContent?.trim(),
        answer: item.querySelector("p")?.textContent?.trim(),
      })),
    );
    expect(visible).toHaveLength(6);

    const faqSchema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .map((script) => JSON.parse(script.textContent ?? "{}"))
          .find((schema) => schema["@type"] === "FAQPage"),
      );
    expect(faqSchema.mainEntity).toHaveLength(6);
    expect(
      faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      })),
    ).toEqual(visible);
  });

  test("implements the locked responsive topologies and content-first DOM order", async ({
    page,
  }) => {
    await page.goto(routePath("weddingTransportation", "en"));

    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 1024 });
      await expect(page.locator(".standards-matrix")).toHaveCSS(
        "grid-template-columns",
        width === 320 ? /^\d+(?:\.\d+)?px$/ : /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
      );
      await expect(page.locator(".process-panel")).toHaveCSS(
        "grid-template-columns",
        /^\d+(?:\.\d+)?px$/,
      );
    }

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator(".standards-matrix")).toHaveCSS(
      "grid-template-columns",
      /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
    );
    await expect(page.locator(".process-panel")).toHaveCSS(
      "grid-template-columns",
      /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
    );

    const contentFirst = await page.evaluate(() =>
      [".story-layout", ".guest-layout", ".presentation-layout"].every((selector) => {
        const layout = document.querySelector(selector);
        return layout?.firstElementChild?.classList.contains(
          selector === ".story-layout"
            ? "story-content"
            : selector === ".guest-layout"
              ? "guest-content"
              : "presentation-content",
        );
      }),
    );
    expect(contentFirst).toBe(true);

    const presentation = await page.evaluate(() => {
      const content = document.querySelector(".presentation-content")!.getBoundingClientRect();
      const media = document.querySelector(".presentation-media")!.getBoundingClientRect();
      return { contentX: content.x, mediaX: media.x };
    });
    expect(presentation.mediaX).toBeLessThan(presentation.contentX);
  });

  test("has no overflow or undersized targets at every governed viewport", async ({ page }) => {
    await page.goto(routePath("weddingTransportation", "ru"));
    for (const viewport of reviewViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
      );
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);
    }
  });

  test("uses prioritized hero media and lazy contextual media without broken images", async ({
    page,
  }) => {
    await page.goto(routePath("weddingTransportation", "en"));

    const hero = page.locator(".service-hero__media");
    await expect(hero).toHaveAttribute("loading", "eager");
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    await expect(hero).toHaveAttribute("alt", "");

    for (const selector of [".story-media img", ".guest-media img", ".presentation-media img"]) {
      await expect(page.locator(selector)).toHaveAttribute("loading", "lazy");
      await expect(page.locator(selector)).toHaveAttribute("alt", "");
    }

    await page.evaluate(async () => {
      const step = Math.max(window.innerHeight * 0.75, 400);
      for (let position = 0; position < document.body.scrollHeight; position += step) {
        window.scrollTo(0, position);
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
      window.scrollTo(0, 0);
    });

    const images = page.locator("main img");
    expect(await images.count()).toBeGreaterThanOrEqual(9);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(
          () => image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
          { timeout: 5_000 },
        )
        .toBeGreaterThan(0);
    }
  });

  test("uses the configured typography roles and passes the WCAG 2.2 automated floor", async ({
    page,
  }) => {
    await page.goto(routePath("weddingTransportation", "en"));

    const fonts = await page.evaluate(() => ({
      h1: getComputedStyle(document.querySelector("h1")!).fontFamily,
      h2: getComputedStyle(document.querySelector("h2")!).fontFamily,
      body: getComputedStyle(document.querySelector("main p")!).fontFamily,
      control: getComputedStyle(document.querySelector("main a")!).fontFamily,
    }));
    expect(fonts.h1).toContain("Inter Tight");
    expect(fonts.h2).toContain("Inter Tight");
    expect(fonts.body).toContain("Manrope");
    expect(fonts.control).toContain("Manrope");

    const results = await new AxeBuilder({ page })
      .withTags(axeWcag22Tags)
      .options({ rules: { "target-size": { enabled: true } } })
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
