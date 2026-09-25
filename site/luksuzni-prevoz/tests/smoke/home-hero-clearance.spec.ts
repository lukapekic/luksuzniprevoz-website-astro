import { test, expect } from "@playwright/test";
import { locales, routePath } from "../support/contracts";

for (const locale of locales) for (const width of [320, 768, 1024, 1440, 1920]) {
  test(`Homepage hero clears header: ${locale}/${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    await page.goto(routePath("home", locale));
    await expect(page.locator(".homepage-hero")).toHaveAttribute("data-scrim-treatment", "soft-reveal");
    for (const fontSize of ["100%", "200%"]) {
      await page.evaluate(async (size) => {
        document.documentElement.style.fontSize = size;
        await document.fonts.ready;
        window.scrollTo(0, 0);
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      }, fontSize);
      const metrics = await page.evaluate(() => ({
        headerBottom: document.querySelector("header")!.getBoundingClientRect().bottom,
        titleTop: document.querySelector("main h1")!.getBoundingClientRect().top,
        actionTop: document.querySelector(".homepage-hero__actions")!.getBoundingClientRect().top,
      }));
      expect(metrics.titleTop, fontSize).toBeGreaterThanOrEqual(metrics.headerBottom);
      expect(metrics.actionTop, fontSize).toBeGreaterThanOrEqual(metrics.headerBottom);
    }
  });
}

test("Homepage soft reveal retains a full-bleed overlay", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(routePath("home", "sr"));
  const overlay = await page.locator(".homepage-hero__scrim").evaluate((element) => {
    const hero = element.closest(".homepage-hero")!.getBoundingClientRect();
    const scrim = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      coversHero: scrim.x === hero.x && scrim.y === hero.y && scrim.width === hero.width && scrim.height === hero.height,
      backgroundColor: style.backgroundColor,
      hasDirectionalLayers: style.backgroundImage.includes("linear-gradient"),
    };
  });
  expect(overlay.coversHero).toBe(true);
  expect(overlay.backgroundColor).not.toMatch(/^(transparent|rgba\(0, 0, 0, 0\))$/);
  expect(overlay.hasDirectionalLayers).toBe(true);
});

test("selected service heroes use the soft reveal without changing the default", async ({ page }) => {
  for (const route of ["corporateTransportation", "vipTransportation", "specialEvents"]) {
    await page.goto(routePath(route, "sr"));
    await expect(page.locator(".service-hero")).toHaveAttribute("data-scrim-treatment", "soft-reveal");
    await expect(page.locator(".service-hero")).toHaveAttribute("data-image-treatment", "natural");
  }
  await page.goto(routePath("airportTransportation", "sr"));
  await expect(page.locator(".service-hero")).toHaveAttribute("data-scrim-treatment", "standard");
});

for (const width of [320, 768, 1024, 1440, 1920]) {
  test(`Full-bleed heroes cover the opening viewport: ${width}`, async ({ page }) => {
    const height = width === 320 ? 568 : 900;
    await page.setViewportSize({ width, height });
    const routes = [
      "home", "airportTransportation", "privateChauffeur", "businessTransportation",
      "corporateTransportation", "delegationTransportation", "conferenceCongressTransportation",
      "specialEvents", "weddingTransportation", "promTransportation", "vipTransportation",
      "fleet", "pricing",
    ] as const;
    for (const route of routes) {
      await page.goto(routePath(route, "sr"));
      const hero = page.locator(route === "home" ? ".homepage-hero" : '.service-hero[data-variant="full-bleed"]');
      const box = await hero.boundingBox();
      expect(box, route).not.toBeNull();
      const headerBottom = await page.locator("header[data-site-header]").evaluate((element) => element.getBoundingClientRect().bottom);
      expect(box!.y, route).toBeGreaterThanOrEqual(-1);
      expect(box!.y, route).toBeLessThan(headerBottom);
      expect(box!.height, route).toBeGreaterThanOrEqual(height);
      expect(box!.y + box!.height, route).toBeGreaterThanOrEqual(height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    }
  });
}
