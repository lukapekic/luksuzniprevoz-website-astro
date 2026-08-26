import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  { locale: "sr", path: "/aerodromski-prevoz/" },
  { locale: "en", path: "/en/airport-transportation/" },
  { locale: "ru", path: "/ru/transfer-iz-aeroporta/" },
] as const;

test.describe("Airport Transportation", () => {
  for (const route of routes) {
    test(`${route.locale} renders the dedicated localized page`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.locale);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main section")).toHaveCount(9);
      await expect(page.locator('input[name="flightNumber"]')).toHaveCount(1);
      await expect(page.locator('input[name="date"][type="date"]')).toHaveCount(1);
      await expect(page.locator('input[name="time"][type="time"]')).toHaveCount(1);
    });
  }

  test("booking start is a real accessible handoff and vehicle fares are data-gated", async ({ page }) => {
    await page.goto("/en/airport-transportation/");
    await expect(page.getByText("Flight number (optional)")).toBeVisible();
    await expect(
      page.getByText(
        "Flight tracking, meet and greet, and standard waiting after landing: 60 min.",
      ),
    ).toBeVisible();
    await expect(page.getByText("At least 5 years of driving experience")).toBeVisible();
    await expect(page.locator('input[name="date"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="time"]')).toHaveAttribute("required", "");
    const form = page.locator("#airport-booking form");
    await expect(form).toHaveAttribute("method", "get");
    await expect(form).toHaveAttribute("action", "/en/contact/");
    await expect(form.locator('button[type="submit"]')).toHaveCount(1);
    await expect(form.locator('input[name="service"]')).toHaveValue("airportTransportation");
    await expect(page.getByText("Fare coming soon")).toHaveCount(4);
  });

  test("has no horizontal overflow at required review widths", async ({ page }) => {
    for (const width of [320, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: width < 1000 ? 1024 : 900 });
      await page.goto("/aerodromski-prevoz/");
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }
  });

  test("passes the automated WCAG floor", async ({ page }) => {
    await page.goto("/aerodromski-prevoz/");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  });
});
