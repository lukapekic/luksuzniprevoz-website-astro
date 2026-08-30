import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  axeWcag22Tags,
  reviewViewports,
  routePath,
} from "../support/contracts";

const routes = [
  { locale: "sr", htmlLang: "sr-Latn" },
  { locale: "en", htmlLang: "en" },
  { locale: "ru", htmlLang: "ru" },
] as const;

test.describe("VIP Transportation", () => {
  for (const route of routes) {
    test(`${route.locale} renders the dedicated published page`, async ({ page }) => {
      const response = await page.goto(routePath("vipTransportation", route.locale));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).not.toHaveText("");
      await expect(page.locator("main > section")).toHaveCount(11);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(
        3,
      );
    });
  }

  test("preserves locked order, cardinalities, capabilities and canonical actions", async ({
    page,
  }) => {
    await page.goto(routePath("vipTransportation", "en"));

    const labelledSections = await page
      .locator("main > section")
      .evaluateAll((sections) =>
        sections.map((section) => section.getAttribute("aria-labelledby")),
      );
    expect(labelledSections).toEqual([
      "service-hero-title",
      "vip-definition-heading",
      "occasion-scope-heading",
      "vip-discretion-heading",
      "vip-aviation-heading",
      "vehicle-recommendations-heading",
      "vip-itinerary-heading",
      "occasion-standards-heading",
      "occasion-process-heading",
      "vip-faq-heading",
      "final-cta-heading",
    ]);

    await expect(page.locator(".principles > li")).toHaveCount(3);
    await expect(page.locator(".scope-panel ol > li")).toHaveCount(3);
    await expect(page.locator(".discretion-list > li")).toHaveCount(3);
    await expect(page.locator(".aviation-list > li")).toHaveCount(3);
    await expect(page.locator(".itinerary-sequence > li")).toHaveCount(5);
    await expect(page.locator(".standards-matrix > li")).toHaveCount(6);
    await expect(page.locator(".process-panel > li")).toHaveCount(3);
    await expect(page.locator("main details")).toHaveCount(8);

    for (const capability of [
      "Individual quote",
      "Commercial aviation arrivals",
      "Private aviation arrivals",
      "Multi-vehicle organisation",
      "Dedicated coordination for complex bookings",
    ]) {
      await expect(page.getByText(capability, { exact: true })).toBeVisible();
    }

    const vehicleNames = await page.locator(".vehicle h3").allTextContents();
    expect(vehicleNames).toEqual([
      "Mercedes S klasa",
      "Mercedes E klasa",
      "Mercedes V klasa 7+1 Extra Long",
      "Mercedes Sprinter",
    ]);

    for (const selector of [".service-hero__actions", ".aviation-action", ".fcta-actions"]) {
      const hrefs = await page
        .locator(`${selector} a`)
        .evaluateAll((links) =>
          links.map((link) => (link as HTMLAnchorElement).getAttribute("href")),
        );
      for (const href of hrefs) {
        expect(href).toBeTruthy();
        expect(href).not.toContain("undefined");
      }
    }
    await expect(page.getByRole("link", { name: "View all vehicles" })).toHaveAttribute(
      "href",
      routePath("fleet", "en"),
    );
    await expect(page.locator("main a:not([href])")).toHaveCount(0);
  });

  test("visible FAQ and FAQ structured data use the same eight localized items", async ({
    page,
  }) => {
    await page.goto(routePath("vipTransportation", "en"));
    const visible = await page.locator("main details").evaluateAll((items) =>
      items.map((item) => ({
        question: item.querySelector("summary")?.textContent?.trim(),
        answer: item.querySelector("p")?.textContent?.trim(),
      })),
    );
    expect(visible).toHaveLength(8);
    expect(
      visible.some((item) =>
        item.answer?.includes(
          "Security, bodyguards and close-protection services are not included",
        ),
      ),
    ).toBe(true);

    const faqSchema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .map((script) => JSON.parse(script.textContent ?? "{}"))
          .find((schema) => schema["@type"] === "FAQPage"),
      );
    expect(faqSchema.mainEntity).toHaveLength(8);
    expect(
      faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      })),
    ).toEqual(visible);
  });

  test("implements deterministic responsive topology and content-first DOM order", async ({
    page,
  }) => {
    await page.goto(routePath("vipTransportation", "ru"));

    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: width === 320 ? 568 : 1024 });
      await expect(page.locator(".itinerary-sequence")).toHaveCSS(
        "grid-template-columns",
        /^\d+(?:\.\d+)?px$/,
      );
      await expect(page.locator(".process-panel")).toHaveCSS(
        "grid-template-columns",
        /^\d+(?:\.\d+)?px$/,
      );
    }

    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(page.locator(".itinerary-sequence")).toHaveCSS(
      "grid-template-columns",
      /^(?:\d+(?:\.\d+)?px ){5}\d+(?:\.\d+)?px$/,
    );
    await expect(page.locator(".process-panel")).toHaveCSS(
      "grid-template-columns",
      /^\d+(?:\.\d+)?px \d+(?:\.\d+)?px \d+(?:\.\d+)?px$/,
    );

    const contentFirst = await page.evaluate(() =>
      [".definition-layout", ".discretion-layout", ".aviation-layout"].every((selector) => {
        const first = document.querySelector(selector)?.firstElementChild;
        return first?.className.includes("content");
      }),
    );
    expect(contentFirst).toBe(true);
  });

  test("has no overflow or undersized targets at every governed viewport", async ({ page }) => {
    await page.goto(routePath("vipTransportation", "ru"));
    for (const viewport of reviewViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
      );
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);
    }
  });

  test("uses prioritized Hero media, lazy contextual media, theme typography and WCAG floor", async ({
    page,
  }) => {
    await page.goto(routePath("vipTransportation", "en"));

    const hero = page.locator(".service-hero__media");
    await expect(hero).toHaveAttribute("loading", "eager");
    await expect(hero).toHaveAttribute("fetchpriority", "high");
    await expect(hero).toHaveAttribute("alt", "");
    for (const selector of [
      ".definition-media img",
      ".discretion-media img",
      ".aviation-media__primary",
      ".aviation-media__supporting",
    ]) {
      await expect(page.locator(selector)).toHaveAttribute("loading", "lazy");
      await expect(page.locator(selector)).toHaveAttribute("alt", "");
    }

    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await expect
      .poll(async () =>
        page
          .locator("main img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);

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
