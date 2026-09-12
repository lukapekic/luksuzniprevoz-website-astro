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
      await expect(page.locator("#sedans, #suv, #groups")).toHaveCount(3);
      await expect(page.locator("#vans")).toHaveCount(0);
      await expect(page.locator("#groups [data-fleet-vehicle]")).toHaveCount(2);
      const hasFaqSchema = await page
        .locator("script[type='application/ld+json']")
        .evaluateAll((scripts) =>
          scripts.some((script) => script.textContent?.includes("FAQPage")),
        );
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

  test("uses the contained page grid and fill media treatment", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${origin}/vozila/`);

    const layout = await page.evaluate(() => {
      const navigator = document.querySelector<HTMLElement>(".fleet-navigator");
      const intro = document.querySelector<HTMLElement>(".fleet-introduction__grid");
      const vehicleGrid = document.querySelector<HTMLElement>(".vehicle-feature__grid");
      const vehicle = vehicleGrid?.closest<HTMLElement>(".vehicle-feature");
      const media = document.querySelector<HTMLElement>(".vehicle-feature__media");
      const image = media?.querySelector<HTMLImageElement>("img");
      const faq = document.querySelector<HTMLElement>("#fleet-faq-heading")?.closest("section");

      if (!navigator || !intro || !vehicleGrid || !vehicle || !media || !image || !faq) {
        throw new Error("Fleet layout contract nodes are missing.");
      }

      const mediaRect = media.getBoundingClientRect();
      return {
        navigatorWidth: navigator.getBoundingClientRect().width,
        navigatorRadius: getComputedStyle(navigator).borderRadius,
        vehicleDivider: getComputedStyle(vehicle).borderBlockEndWidth,
        faqWidth: faq.getBoundingClientRect().width,
        introStart: intro.getBoundingClientRect().left,
        mediaStart: mediaRect.left,
        mediaRatio: mediaRect.width / mediaRect.height,
        gridColumnCount: getComputedStyle(vehicleGrid).gridTemplateColumns.split(" ").length,
        objectFit: getComputedStyle(image).objectFit,
        objectPosition: getComputedStyle(image).objectPosition,
        overlay: getComputedStyle(media, "::after").backgroundColor,
      };
    });

    expect(layout.navigatorWidth).toBeLessThan(1440);
    expect(Number.parseFloat(layout.navigatorRadius)).toBeGreaterThan(0);
    expect(layout.vehicleDivider).toBe("0px");
    expect(layout.faqWidth).toBeLessThan(1440);
    expect(layout.introStart).toBe(layout.mediaStart);
    expect(layout.mediaRatio).toBeCloseTo(1.5, 1);
    expect(layout.gridColumnCount).toBe(12);
    expect(layout.objectFit).toBe("cover");
    expect(layout.objectPosition).toBe("50% 50%");
    expect(layout.overlay).not.toBe("rgba(0, 0, 0, 0)");
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
