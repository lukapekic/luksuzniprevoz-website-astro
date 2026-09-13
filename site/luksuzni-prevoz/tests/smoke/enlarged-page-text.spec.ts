import { test, expect } from "@playwright/test";
import { routes } from "../../src/data/routes";
import { locales, routePath } from "../support/contracts";

for (const route of routes.filter((item) => item.availability === "published")) {
  for (const locale of locales) {
    test(`${route.key}/${locale}: page fits with 200% text`, async ({ page }) => {
      for (const width of [320, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(routePath(route.key, locale));
        await page.evaluate(async () => {
          document.documentElement.style.fontSize = "200%";
          await document.fonts.ready;
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        });
        const metrics = await page.evaluate(() => ({
          rootFont: getComputedStyle(document.documentElement).fontSize,
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
        }));
        expect(metrics.rootFont).toBe("32px");
        expect(metrics.scrollWidth, `${route.key}/${locale}/${width}`).toBeLessThanOrEqual(metrics.width);
      }
    });
  }
}
