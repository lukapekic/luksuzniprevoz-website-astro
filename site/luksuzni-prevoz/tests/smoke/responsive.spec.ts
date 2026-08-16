import { test, expect } from "@playwright/test";

/**
 * Responsive design tests.
 * FND-RESP-03/04/06: scan the spec's fixed viewport set (320 / 390 / 768 /
 * 1024 / 1440 / 1920) for horizontal overflow — the most common responsive
 * defect. Overflow is measured against the actual viewport width with a small
 * tolerance for sub-pixel rounding.
 */
const viewports = [
  { name: "mobile-sm", width: 320, height: 568 },
  { name: "mobile-md", width: 390, height: 667 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "wide", width: 1920, height: 1080 },
];

// 1px tolerance for sub-pixel / scrollbar rounding.
const OVERFLOW_TOLERANCE = 1;

async function assertNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(
    scrollWidth,
    `horizontal overflow: scrollWidth=${scrollWidth} > clientWidth=${clientWidth}`,
  ).toBeLessThanOrEqual(clientWidth + OVERFLOW_TOLERANCE);
}

test.describe("Responsive Design", () => {
  for (const viewport of viewports) {
    test(`${viewport.name} (${viewport.width}×${viewport.height}) home renders with no overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/sr/");
      await expect(page).toHaveTitle(/Reference Site/i);
      await assertNoHorizontalOverflow(page);
    });
  }

  for (const viewport of viewports) {
    test(`${viewport.name} (${viewport.width}×${viewport.height}) about page no overflow`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto("/sr/o-nama/");
      await assertNoHorizontalOverflow(page);
    });
  }

  test("mobile hamburger is visible below 768px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/sr/");
    await expect(page.locator("[data-nav-toggle]")).toBeVisible();
  });

  test("desktop nav is visible at ≥768px (no hamburger needed)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/sr/");
    // The hamburger is hidden on desktop; the desktop nav list is visible.
    await expect(page.locator("[data-nav-toggle]")).toBeHidden();
  });

  test("mobile hamburger toggles navigation open/closed", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/sr/");

    const hamburger = page.locator("[data-nav-toggle]");
    const mobileNav = page.locator("[data-nav-panel]");

    // JS has hidden the server-rendered-open panel on load.
    await expect(mobileNav).toBeHidden();

    await hamburger.click();
    await expect(mobileNav).toBeVisible();
    await expect(hamburger).toHaveAttribute("aria-expanded", "true");

    await hamburger.click();
    await expect(mobileNav).toBeHidden();
    await expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });
});
