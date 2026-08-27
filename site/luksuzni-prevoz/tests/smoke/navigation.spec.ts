import { test, expect } from "@playwright/test";
import { defaultLocale, locales, routePath } from "../support/contracts";

/**
 * Navigation smoke tests.
 * FND-I18N-03: URLs come from the route map (never folder names).
 * FND-ARCH-06: mobile nav degrades gracefully without JS.
 *
 * Runs across all three engines (Chromium/Firefox/WebKit) via playwright.config.
 */
test.describe("Navigation", () => {
  for (const locale of locales) {
    test(`home page loads for ${locale}`, async ({ page }) => {
      const response = await page.goto(routePath("home", locale));
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/\S+/);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("main h1")).toBeVisible();
    });
  }

  test("FND-I18N-03: can navigate to airport page from route-map URL", async ({ page }) => {
    await page.goto(routePath("home", defaultLocale));
    const destination = routePath("airportTransportation", defaultLocale);
    await page.locator("[data-site-header] [data-dropdown-trigger]").first().click();
    await page.locator(`[data-site-header] [data-dropdown-panel] a[href="${destination}"]:visible`).click();
    await expect(page).toHaveURL(destination);
  });

  test("FND-I18N-03: can navigate to about page from route-map URL", async ({ page }) => {
    await page.goto(routePath("home", defaultLocale));
    const destination = routePath("about", defaultLocale);
    await page.locator(`a[href="${destination}"]:visible`).first().click();
    await expect(page).toHaveURL(destination);
  });

  test("language switcher changes locale", async ({ page }) => {
    await page.goto(routePath("home", defaultLocale));
    const desktopSwitcher = page.locator("[data-site-header] + noscript ~ [data-mobile-panel]");
    await expect(desktopSwitcher).toBeHidden();
    await page.locator("[data-site-header] .lang-switcher [data-dropdown-trigger]").click();
    const enLink = page.locator('[data-site-header] a[hreflang="en"]:visible');
    await enLink.click();
    await expect(page).toHaveURL(/\/en\//);
  });

  test("404 page renders for unknown route", async ({ page }) => {
    const response = await page.goto("/nonexistent-page/");
    // Astro static output returns 404 for missing pages.
    expect(response?.status()).toBe(404);
    await expect(page.locator("main h1")).toContainText("404");
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
    await page.goto(routePath("home", defaultLocale));

    const mobileNav = page.locator("[data-mobile-panel]");
    // Without JS, the panel is NOT hidden — its links are in the DOM and visible.
    await expect(mobileNav).toBeVisible();
    const navLinks = mobileNav.locator("a[href]");
    expect(await navLinks.count()).toBeGreaterThan(0);

    await context.close();
  });
});
