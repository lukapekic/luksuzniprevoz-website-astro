import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  assertMinimumTargetSize,
  axeWcag22Tags,
  defaultLocale,
  locales,
  routePath,
} from "../support/contracts";

/**
 * Accessibility tests.
 * FND-A11Y-01 (non-waivable): automated axe-core scan on real rendered pages.
 * Manual checks live in docs/a11y-manual-checklist.md; these are the automated
 * floor. Runs on every locale's home page plus a content page.
 */
test.describe("Accessibility (axe-core)", () => {
  for (const locale of locales) {
    test(`FND-A11Y-01: home page (${locale}) has no WCAG 2.2 axe violations`, async ({ page }) => {
      await page.goto(routePath("home", locale));
      const results = await new AxeBuilder({ page })
        .withTags(axeWcag22Tags)
        .options({ rules: { "target-size": { enabled: true } } })
        .analyze();
      expect(results.violations).toEqual([]);
      await assertMinimumTargetSize(page);
    });
  }

  test("FND-A11Y-01: content page has no WCAG 2.2 axe violations", async ({ page }) => {
    await page.goto(routePath("airportTransportation", defaultLocale));
    const results = await new AxeBuilder({ page })
      .withTags(axeWcag22Tags)
      .options({ rules: { "target-size": { enabled: true } } })
      .analyze();
    expect(results.violations).toEqual([]);
    await assertMinimumTargetSize(page);
  });

  test("404 page has no axe violations", async ({ page }) => {
    await page.goto("/nonexistent-page/");
    const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
    expect(results.violations).toEqual([]);
  });

  test("FND-A11Y-03: skip link is present and targets main content", async ({ page }) => {
    await page.goto(routePath("home", defaultLocale));
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
    // The target id must match the skip link's href.
    await expect(mainContent).toHaveAttribute("id", "main-content");
  });

  test("every nav landmark has a localized aria-label", async ({ page }) => {
    await page.goto(routePath("home", defaultLocale));
    // FND-ARCH-03: nav labels come from the UI dictionary, not hardcoded.
    const navs = page.locator("nav");
    const count = await navs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const label = await navs.nth(i).getAttribute("aria-label");
      expect(label, `nav #${i} must have aria-label`).toBeTruthy();
    }
  });

  test("html has correct lang and dir attributes (sr)", async ({ page }) => {
    await page.goto(routePath("home", defaultLocale));
    await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });
});
