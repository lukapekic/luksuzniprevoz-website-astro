import { test, expect } from "@playwright/test";
import {
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  defaultLocale,
  reviewViewports,
  routePath,
} from "../support/contracts";

/**
 * Responsive design tests.
 * FND-RESP-03/04/06: scan the spec's fixed viewport set (320 / 390 / 768 /
 * 1024 / 1440 / 1920) for horizontal overflow — the most common responsive
 * defect. Overflow is measured against the actual viewport width with a small
 * tolerance for sub-pixel rounding.
 */
test.describe("Responsive Design", () => {
  for (const viewport of reviewViewports) {
    test(`FND-RESP-03/FND-A11Y-05: ${viewport.name} (${viewport.width}×${viewport.height}) home has no overflow and valid targets`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath("home", defaultLocale));
      await expect(page).toHaveTitle(/\S+/);
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);
    });
  }

  for (const viewport of reviewViewports) {
    test(`FND-RESP-03/FND-A11Y-05: ${viewport.name} (${viewport.width}×${viewport.height}) airport page has no overflow and valid targets`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath("airportTransportation", defaultLocale));
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);
    });
  }

  test("mobile hamburger is visible below 768px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(routePath("home", defaultLocale));
    await expect(page.locator("[data-menu-toggle]")).toBeVisible();
  });

  test("desktop nav is visible at ≥1024px (no hamburger needed)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto(routePath("home", defaultLocale));
    // The hamburger is hidden on desktop; the desktop nav list is visible.
    await expect(page.locator("[data-menu-toggle]")).toBeHidden();
    await expect(page.locator(".nav-desktop")).toBeVisible();
  });

  test("mobile hamburger toggles navigation open/closed", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(routePath("home", defaultLocale));

    const hamburger = page.locator("[data-menu-toggle]");
    const mobileNav = page.locator("[data-mobile-panel]");

    // JS has hidden the server-rendered-open panel on load.
    await expect(mobileNav).toBeHidden();

    await hamburger.click();
    await expect(mobileNav).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");

    await mobileNav.locator("[data-menu-close]").click();
    await expect(mobileNav).toBeHidden();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });
});
