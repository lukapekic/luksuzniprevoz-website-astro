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

test.describe("Private Chauffeur", () => {
  for (const route of routes) {
    test(`${route.locale} renders the published localized page`, async ({ page }) => {
      const response = await page.goto(routePath("privateChauffeur", route.locale));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(
        3,
      );
    });
  }

  test("resolves canonical facts and flow fallbacks while preserving the fleet route", async ({
    page,
  }) => {
    await page.goto(routePath("privateChauffeur", "en"));

    await expect(page.getByText("From 1 h · Half day 5 h / 100 km")).toBeVisible();
    await expect(page.getByText("Full day 10 h / 200 km · Multi-day by request")).toBeVisible();
    await expect(page.getByText("At least 5 years of driving experience")).toBeVisible();
    await expect(page.getByText("Confirmed requested vehicle model")).toBeVisible();
    await expect(page.getByText("Luggage assistance")).toBeVisible();
    await expect(page.getByText("Child seat on request")).toBeVisible();
    await expect(page.getByText("In-vehicle Wi-Fi · Climate control")).toBeVisible();

    const mainLinks = page.locator("main a");
    const contactHref = routePath("contact", "en");
    await expect(page.locator("[data-site-header]")).toHaveAttribute("data-over-hero", "true");
    await expect(page.locator(".service-hero__actions a")).toHaveCount(2);
    await expect(page.locator(".fcta-actions a")).toHaveCount(2);
    for (const action of await page.locator(".fcta-actions a").all()) {
      await expect(action).toHaveAttribute("href", contactHref);
    }
    await expect(mainLinks.filter({ hasText: "Book Private Chauffeur" }).first()).toHaveAttribute(
      "href",
      contactHref,
    );
    await expect(mainLinks.filter({ hasText: "Request a Quote" }).first()).toHaveAttribute(
      "href",
      contactHref,
    );
    await expect(mainLinks.filter({ hasText: "Send us your schedule" })).toHaveAttribute(
      "href",
      contactHref,
    );
    await expect(page.locator("main a:not([href])")).toHaveCount(0);
    await expect(
      mainLinks.filter({ hasText: "View Full Fleet" }),
    ).toHaveAttribute("href", routePath("fleet", "en"));

    await expect(page.getByRole("heading", { name: "Mercedes S klasa", exact: true })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Mercedes E klasa", exact: true })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Škoda Superb", exact: true })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: /Mercedes V klasa/ })).toHaveCount(0);

    expect(await page.locator("body").innerText()).not.toMatch(
      /\{(?:minimumHours|halfDayHours|halfDayKm|fullDayHours|fullDayKm)\}/,
    );
  });

  test("visible FAQ and FAQ structured data use the same ten interpolated items", async ({ page }) => {
    await page.goto(routePath("privateChauffeur", "en"));

    const visible = await page.locator("main details").evaluateAll((items) =>
      items.map((item) => ({
        question: item.querySelector("summary")?.textContent?.trim(),
        answer: item.querySelector("p")?.textContent?.trim(),
      })),
    );
    expect(visible).toHaveLength(10);

    const faqSchema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
      scripts
        .map((script) => JSON.parse(script.textContent ?? "{}"))
        .find((schema) => schema["@type"] === "FAQPage"),
    );
    expect(faqSchema.mainEntity).toHaveLength(10);
    expect(
      faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      })),
    ).toEqual(visible);
  });

  test("implements the full-bleed Hero and locked matrix topologies", async ({ page }) => {
    await page.goto(routePath("privateChauffeur", "en"));

    await page.setViewportSize({ width: 1024, height: 900 });
    const tabletHeroColumns = await page
      .locator(".service-hero__panel")
      .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
    expect(tabletHeroColumns).toBe(1);
    await expect(page.locator('.standards-grid[data-variant="numbered-matrix"]')).toHaveCSS(
      "grid-template-columns",
      /.+ .+/,
    );

    await page.setViewportSize({ width: 1440, height: 900 });
    const columns = await page.evaluate(() => {
      const selectors = [
        ".service-hero__panel",
        ".overview-grid",
        ".editorial-layout",
        ".standards-layout",
        ".custom-layout",
      ];
      return Object.fromEntries(
        selectors.map((selector) => [
          selector,
          getComputedStyle(document.querySelector(selector)!).gridTemplateColumns,
        ]),
      );
    });

    const ratio = (value: string) => {
      const [first, second] = value.split(" ").map(Number.parseFloat);
      return first / second;
    };
    expect(columns[".service-hero__panel"].split(" ")).toHaveLength(1);
    expect(ratio(columns[".overview-grid"])).toBeCloseTo(5 / 7, 1);
    expect(ratio(columns[".editorial-layout"])).toBeCloseTo(8 / 4, 1);
    expect(ratio(columns[".standards-layout"])).toBeCloseTo(4 / 8, 1);
    expect(ratio(columns[".custom-layout"])).toBeCloseTo(7 / 5, 1);

    const heroBox = await page.locator(".service-hero").boundingBox();
    expect(heroBox?.width).toBeCloseTo(1440, 0);

    const standardGroups = page.locator(
      '.standards-grid[data-variant="numbered-matrix"] article',
    );
    await expect(standardGroups).toHaveCount(4);
    for (const group of await standardGroups.all()) {
      await expect(group.locator("li")).toHaveCount(3);
    }

    await expect(
      page.locator(
        '.standards-grid[data-variant="numbered-matrix"] .standard-marker:not([aria-hidden="true"])',
      ),
    ).toHaveCount(0);
    await expect(page.locator('.statements .statement-marker:not([aria-hidden="true"])')).toHaveCount(
      0,
    );

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
  });

  test("has no accidental overflow or undersized targets at all review states", async ({ page }) => {
    await page.goto(routePath("privateChauffeur", "ru"));
    for (const viewport of reviewViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
      );
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);
    }
  });

  test("loads the prioritized Hero and lazy below-fold images without broken media", async ({
    page,
  }) => {
    await page.goto(routePath("privateChauffeur", "en"));

    const heroImage = page.locator(".service-hero__media");
    await expect(heroImage).toHaveAttribute("loading", "eager");
    await expect(heroImage).toHaveAttribute("fetchpriority", "high");

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
      expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(
        0,
      );
    }
  });

  test("passes the automated WCAG 2.2 floor", async ({ page }) => {
    await page.goto(routePath("privateChauffeur", "en"));
    const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
    expect(results.violations).toEqual([]);
  });
});
