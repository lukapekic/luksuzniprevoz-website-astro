import { test, expect } from "@playwright/test";
import { assertNoHorizontalOverflow, defaultLocale, locales, reviewViewports, routePath } from "../support/contracts";

test.describe("SiteFooter four-tier contract", () => {
  for (const viewport of [...reviewViewports, { name: "mobile-390", width: 390, height: 844 }]) {
    test(`${viewport.name}: brand, navigation, and contact targets`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath("home", defaultLocale));
      const footer = page.locator(".site-footer");
      await expect(footer).toBeVisible();
      await expect(footer.getByRole("link", { name: "Luksuzni prevoz" })).toBeVisible();
      await expect(footer.locator("[data-brand-wordmark]")).toHaveClass(/sr-only/);
      await expect(footer.locator("[data-brand-wordmark]")).toHaveText("Luksuzni prevoz");
      await expect(footer.locator(".site-footer__place span")).toHaveCount(1);
      await expect(footer.locator(".site-footer__group")).toHaveCount(4);
      await expect(footer.locator(".site-footer__partner-link")).toHaveCount(2);
      await expect(footer.locator(".site-footer__partner-link svg")).toHaveCount(2);
      const partnerLayout = await footer.locator(".site-footer__partners").evaluate((row) => {
        const heading = row.querySelector("h2")!.getBoundingClientRect();
        const logos = [...row.querySelectorAll("a svg")].map((logo) => logo.getBoundingClientRect());
        return { headingEnd: heading.right, logoStarts: logos.map((logo) => logo.left), logoTops: logos.map((logo) => logo.top), logoHeights: logos.map((logo) => logo.height) };
      });
      expect(partnerLayout.headingEnd).toBeLessThan(partnerLayout.logoStarts[0]);
      expect(partnerLayout.logoStarts[0]).toBeLessThan(partnerLayout.logoStarts[1]);
      expect(Math.abs(partnerLayout.logoTops[0] - partnerLayout.logoTops[1])).toBeLessThan(1);
      expect(Math.abs(partnerLayout.logoHeights[0] - partnerLayout.logoHeights[1])).toBeLessThan(1);
      await expect(footer.getByRole("navigation")).toHaveCount(2);
      await expect(footer.locator(".lang-switcher-inline [aria-current='page']")).toHaveText("SR");
      const background = await footer.evaluate((element) => getComputedStyle(element).backgroundImage);
      expect(background).toContain("linear-gradient(160deg");
      const columns = await footer.locator(".site-footer__nav").evaluate((element) =>
        getComputedStyle(element).gridTemplateColumns.split(" ").length,
      );
      expect(columns).toBe(viewport.width >= 1024 ? 4 : 2);
      for (const link of await footer.locator("a[href]").all()) {
        const box = await link.boundingBox();
        expect(box?.width).toBeGreaterThanOrEqual(44);
        expect(box?.height).toBeGreaterThanOrEqual(44);
      }
      await assertNoHorizontalOverflow(page);
    });
  }

  for (const locale of locales) {
    test(`${locale}: route-aware inline language links`, async ({ page }) => {
      await page.goto(routePath("contact", locale));
      const footer = page.locator(".site-footer");
      await expect(footer.locator(".site-footer__group")).toHaveCount(4);
      const current = footer.locator(".lang-switcher-inline [aria-current='page']");
      await expect(current).toHaveCount(1);
      await expect(current).toHaveAttribute("href", routePath("contact", locale));
      await expect(footer.getByRole("link", { name: "Luksuzni prevoz" })).toHaveAttribute("href", routePath("home", locale));
      await expect(footer.locator(".site-footer__contact").first()).toHaveAttribute("href", "tel:+38163380970");
      await expect(footer.locator(".site-footer__contact").last()).toHaveAttribute("href", /^mailto:/);
      await expect(footer.getByRole("link", { name: "Belgrade Transfers" })).toHaveAttribute("href", "https://belgradetransfers.com/");
      await expect(footer.getByRole("link", { name: "Transferi" })).toHaveAttribute("href", "https://transferi.rs/");
    });
  }
});
