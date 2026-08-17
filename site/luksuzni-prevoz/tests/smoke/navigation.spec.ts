import { test, expect } from "@playwright/test";

/**
 * Navigation smoke tests.
 * FND-I18N-03: URLs come from the route map (never folder names).
 * FND-ARCH-06: mobile nav degrades gracefully without JS.
 *
 * Runs across all three engines (Chromium/Firefox/WebKit) via playwright.config.
 */
test.describe("Navigation", () => {
  test("home page loads for default locale (sr)", async ({ page }) => {
    const response = await page.goto("/sr/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Reference Site/i);
  });

  test("home page loads for English locale", async ({ page }) => {
    const response = await page.goto("/en/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Reference Site/i);
  });

  test("home page loads for Russian locale", async ({ page }) => {
    const response = await page.goto("/ru/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Reference Site/i);
  });

  test("can navigate to airport page from home (sr)", async ({ page }) => {
    await page.goto("/sr/");
    // FND-I18N-03: internal link is resolved from the route map (/aerodrom/)
    await page.click('a[href="/aerodrom/"]');
    await expect(page).toHaveURL("/aerodrom/");
  });

  test("can navigate to about page from home (sr)", async ({ page }) => {
    await page.goto("/sr/");
    await page.click('a[href="/o-nama/"]');
    await expect(page).toHaveURL("/o-nama/");
  });

  test("language switcher changes locale", async ({ page }) => {
    await page.goto("/sr/");
    // The language switcher renders alternate-locale links with hreflang.
    const enLink = page.locator('a[hreflang="en"]').first();
    await enLink.click();
    await expect(page).toHaveURL(/\/en\//);
  });

  test("404 page renders for unknown route", async ({ page }) => {
    const response = await page.goto("/sr/nonexistent-page/");
    // Astro static output returns 404 for missing pages.
    expect(response?.status()).toBe(404);
    await expect(page.locator("h1")).toContainText("404");
  });

  test("root serves the default-locale home page", async ({ page }) => {
    // src/pages/index.astro handles "/" — it should render (not 404).
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("FND-ARCH-06: mobile nav is reachable without JS", async ({ browser }) => {
    // No-JS context: the mobile panel must be server-rendered open so
    // keyboard/no-JS users can navigate. (JS hides it at runtime; see Header.)
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/sr/");

    const mobileNav = page.locator("[data-nav-panel]");
    // Without JS, the panel is NOT hidden — its links are in the DOM and visible.
    await expect(mobileNav).toBeVisible();
    const navLinks = mobileNav.locator("a[href]");
    expect(await navLinks.count()).toBeGreaterThan(0);

    await context.close();
  });
});
