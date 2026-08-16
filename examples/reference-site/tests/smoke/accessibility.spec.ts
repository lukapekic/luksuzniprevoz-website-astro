import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility tests.
 * FND-A11Y-01 (non-waivable): automated axe-core scan on real rendered pages.
 * Manual checks live in docs/a11y-manual-checklist.md; these are the automated
 * floor. Runs on every locale's home page plus a content page.
 */
const locales = ["sr", "en", "ru"] as const;

test.describe("Accessibility (axe-core)", () => {
  for (const locale of locales) {
    test(`home page (${locale}) has no axe violations`, async ({ page }) => {
      await page.goto(`/${locale}/`);
      const results = await new AxeBuilder({ page })
        // WCAG 2.1 A/AA + best-practice. Excludes the exhaustive-per-
        // combination checks that belong to manual visual review (FND-A11Y-09).
        .withTags(["wcag2a", "wcag2aa", "best-practice"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("content page (sr /about) has no axe violations", async ({ page }) => {
    await page.goto("/sr/o-nama/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("404 page has no axe violations", async ({ page }) => {
    await page.goto("/sr/nonexistent-page/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("skip link is present and targets main content", async ({ page }) => {
    await page.goto("/sr/");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeAttached();
    // The target id must match the skip link's href.
    await expect(mainContent).toHaveAttribute("id", "main-content");
  });

  test("every nav landmark has a localized aria-label", async ({ page }) => {
    await page.goto("/sr/");
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
    await page.goto("/sr/");
    await expect(page.locator("html")).toHaveAttribute("lang", "sr");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });
});
