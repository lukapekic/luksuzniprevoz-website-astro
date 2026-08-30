import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = ["/rezervacija/", "/en/booking/", "/ru/bronirovanie/"];

test.describe("Booking page", () => {
  for (const path of routes) {
    test(`${path} renders the published validation-only page`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      const form = page.locator("[data-booking-wizard]");
      await expect(form).toHaveCount(1);
      expect(await form.getAttribute("action")).toBeNull();
      expect(await form.getAttribute("method")).toBeNull();
      await expect(page.locator('[data-booking-actions]')).toBeVisible();
    });
  }

  test("consumes a validated Airport handoff and completes the client-only flow", async ({ page }) => {
    await page.goto("/en/booking/?intent=booking&service=airportTransportation&date=2099-12-31&time=12%3A00&flightNumber=JU123");
    await expect(page).toHaveURL(/\/en\/booking\/$/);
    await expect(page.locator('[data-step-panel="journey"]')).toBeVisible();
    await expect(page.locator('[data-journey-branch="airportTransportation"]')).toBeVisible();
    await expect(page.locator('[name="date"]')).toHaveValue("2099-12-31");
    await expect(page.locator('[name="flightNumber"]')).toHaveValue("JU123");

    await page.locator('[name="pickup"]').fill("Belgrade Airport");
    await page.locator('[name="destination"]').fill("Belgrade city");
    await page.locator('[name="airportDirection"][value="airport-to-city"]').check();
    await page.locator('[name="airportScope"][value="belgrade-city"]').check();
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator("#booking-vehicle-heading")).toBeFocused();

    await page.locator('[name="passengerCount"]').fill("2");
    await page.locator('[name="vehiclePreference"][value="recommend"]').check();
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator("#booking-review-heading")).toBeFocused();
    await expect(page.locator('[data-booking-summary]')).toBeHidden();
    await expect(page.locator('[data-booking-final] button')).toBeDisabled();
    await expect(page.locator("#booking-form-status")).toContainText("Online request sending is not enabled yet");
    await expect(page.locator('[data-review-value="price"]')).toContainText("Custom quote");
  });

  test("generic and concrete CTA handoffs stay distinct", async ({ page }) => {
    await page.goto("/en/");
    const headerBook = page.locator("header [href*='/en/booking/']").first();
    await expect(headerBook).toHaveAttribute("href", "/en/booking/?intent=booking");

    await page.goto("/en/private-chauffeur/");
    const contextual = page.locator("a[href*='/en/booking/?intent='][href*='service=privateChauffeur']");
    await expect(contextual.first()).toBeVisible();
  });

  test("keeps the first step usable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/en/booking/");
    await expect(page.locator('[data-step-panel="service"]')).toBeVisible();
    await expect(page.locator('[name="serviceCategory"]')).toHaveCount(4);
    await expect(page.locator('[data-booking-actions]')).toBeHidden();
    await expect(page.locator("noscript a[href='/en/contact/']")).toBeVisible();

    await context.close();
  });

  test("moves focus to the validation summary", async ({ page }) => {
    await page.goto("/en/booking/");
    await page.locator('[data-booking-continue] button').click();

    await expect(page.locator("[data-error-summary]")).toBeFocused();
    await expect(page.locator("#booking-service-error")).toBeVisible();
  });

  test("meets the page accessibility baseline", async ({ page }) => {
    await page.goto("/en/booking/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const width of [320, 768, 1024, 1440, 1920]) {
    test(`has no overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ru/bronirovanie/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const minimumChoiceHeight = await page.locator(".booking-choice").first().evaluate((element) => element.getBoundingClientRect().height);
      expect(minimumChoiceHeight).toBeGreaterThanOrEqual(44);
    });
  }
});
