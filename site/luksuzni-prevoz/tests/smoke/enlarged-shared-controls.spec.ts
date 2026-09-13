import { test, expect } from "@playwright/test";
import { locales, routePath } from "../support/contracts";

for (const locale of locales) for (const width of [320, 768, 1024, 1440, 1920]) {
  test(`Shared controls fit at 200% text: ${locale}/${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(routePath("promTransportation", locale));
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = "200%";
      await document.fonts.ready;
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe("32px");
    const failures = await page.locator("header a, header button, .carousel__controls button").evaluateAll((elements) =>
      elements.flatMap((el) => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height || getComputedStyle(el).visibility === "hidden") return [];
        return rect.left >= -1 && rect.right <= innerWidth + 1 && rect.width >= 44 && rect.height >= 44
          ? [] : [{ text: el.textContent, left: rect.left, right: rect.right, width: rect.width, height: rect.height }];
      }),
    );
    expect(failures).toEqual([]);
  });
}
