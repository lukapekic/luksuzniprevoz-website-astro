import { test, expect } from "@playwright/test";
import { assertNoHorizontalOverflow, defaultLocale, locales, reviewViewports, routePath } from "../support/contracts";

test.describe("SiteFooter three-tier contract", () => {
  for (const viewport of reviewViewports) {
    test(`${viewport.name}: brand, navigation, and contact targets`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath("home", defaultLocale));
      const footer = page.locator(".site-footer");
      await expect(footer).toBeVisible();
      await expect(footer.getByRole("link", { name: "Luksuzni transport" })).toBeVisible();
      await expect(footer.locator(".site-footer__group")).toHaveCount(4);
      await expect(footer.getByRole("navigation")).toHaveCount(2);
      await expect(footer.locator(".lang-switcher-inline [aria-current='page']")).toHaveText("SR");
      for (const link of await footer.locator(".site-footer__contact").all()) {
        const box = await link.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
      await assertNoHorizontalOverflow(page);
    });
  }

  for (const locale of locales) {
    test(`${locale}: route-aware inline language links`, async ({ page }) => {
      await page.goto(routePath("home", locale));
      const footer = page.locator(".site-footer");
      await expect(footer.locator(".site-footer__group")).toHaveCount(4);
      const current = footer.locator(".lang-switcher-inline [aria-current='page']");
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute("href", routePath("home", locale));
    });
  }
});
