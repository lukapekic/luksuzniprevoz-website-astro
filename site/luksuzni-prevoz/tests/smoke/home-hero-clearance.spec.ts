import { test, expect } from "@playwright/test";
import { locales, routePath } from "../support/contracts";

for (const locale of locales) for (const width of [320, 768, 1024, 1440, 1920]) {
  test(`Homepage hero clears header: ${locale}/${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 320 ? 568 : 900 });
    await page.goto(routePath("home", locale));
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
