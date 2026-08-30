import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  axeWcag22Tags,
  reviewViewports,
} from "../support/contracts";

const routes = ["/vozila/", "/en/fleet/", "/ru/avtopark/"] as const;
const origin = process.env.FLEET_TEST_ORIGIN ?? "";

test.describe("Fleet page", () => {
  for (const path of routes) {
    test(`${path} renders the six-model showcase without Vito`, async ({ page }) => {
      const response = await page.goto(`${origin}${path}`);

      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("[data-fleet-vehicle]")).toHaveCount(6);
      await expect(page.locator("main")).not.toContainText("Mercedes Vito Tourer");
      await expect(page.locator("#sedans, #suv, #vans, #groups")).toHaveCount(4);
      const hasFaqSchema = await page
        .locator("script[type='application/ld+json']")
        .evaluateAll((scripts) => scripts.some((script) => script.textContent?.includes("FAQPage")));
      expect(hasFaqSchema).toBe(true);
    });
  }

  test("keeps Kodiaq quote-only and both CTA flows available", async ({ page }) => {
    await page.goto(`${origin}/en/fleet/`);

    const kodiaq = page.locator('[data-fleet-vehicle="fleet-skodaKodiaq"]');
    await expect(kodiaq).toContainText("Price by quote");
    await expect(kodiaq).not.toContainText(/Passenger capacity/i);
    await expect(page.locator("a[href*='/en/booking/?intent=booking']").first()).toBeVisible();
    await expect(page.locator("a[href*='/en/booking/?intent=quote']").first()).toBeVisible();
  });

  test("meets the page accessibility baseline", async ({ page }) => {
    await page.goto(`${origin}/en/fleet/`);
    const results = await new AxeBuilder({ page })
      .withTags(axeWcag22Tags)
      .options({ rules: { "target-size": { enabled: true } } })
      .analyze();

    expect(results.violations).toEqual([]);
    await assertMinimumTargetSize(page);
  });

  for (const viewport of reviewViewports) {
    test(`has no overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${origin}/vozila/`);

      await assertNoHorizontalOverflow(page);
      await expect(page.locator("[data-fleet-vehicle]")).toHaveCount(6);
    });
  }
});
