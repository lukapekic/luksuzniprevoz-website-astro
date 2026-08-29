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

test.describe("Contact", () => {
  for (const route of routes) {
    test(`${route.locale} renders the published localized page`, async ({ page }) => {
      const response = await page.goto(routePath("contact", route.locale));
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

  test("shows canonical contact facts and no messaging-app contact", async ({ page }) => {
    await page.goto(routePath("contact", "en"));

    await expect(page.locator('main a[href="tel:+381601119999"]')).toHaveText(
      "+381 60 111 9999",
    );
    await expect(
      page.locator('main a[href="mailto:office@luksuzniprevoz.rs"]'),
    ).toHaveText("office@luksuzniprevoz.rs");
    await expect(page.locator("main address")).toContainText("Antifašističke borbe 25");
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  });

  test("keeps the question form validation-only", async ({ page }) => {
    const postRequests: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") postRequests.push(request.url());
    });

    await page.goto(routePath("contact", "en"));
    const form = page.locator("[data-contact-question-form]");
    expect(await form.evaluate((element) => element.hasAttribute("action"))).toBe(false);
    expect(await form.evaluate((element) => element.hasAttribute("method"))).toBe(false);
    await expect(form.locator('button[type="button"]')).toBeDisabled();
    await expect(form.locator('button[type="submit"]')).toHaveCount(0);

    const fullName = form.locator('input[name="fullName"]');
    await fullName.fill("Robot");
    await fullName.blur();
    await expect(fullName).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(`#${await fullName.getAttribute("id")}-error`)).toBeVisible();

    await fullName.fill("Jovana Petrović");
    await expect(fullName).not.toHaveAttribute("aria-invalid", "true");
    expect(postRequests).toEqual([]);
  });

  test("preserves the locked responsive topology without overflow", async ({ page }) => {
    await page.goto(routePath("contact", "ru"));

    for (const viewport of reviewViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);

      const columns = await page
        .locator("[data-contact-layout]")
        .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
      expect(columns).toBe(viewport.width >= 1024 ? 12 : 1);
    }
  });

  test("passes the automated WCAG 2.2 floor", async ({ page }) => {
    await page.goto(routePath("contact", "sr"));
    const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
    expect(results.violations).toEqual([]);
  });
});
