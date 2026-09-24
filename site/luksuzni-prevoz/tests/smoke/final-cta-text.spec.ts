import { test, expect } from "@playwright/test";
import { locales, routePath } from "../support/contracts";

const consumers = [
  "home", "fleet", "pricing", "airportTransportation", "privateChauffeur",
  "businessTransportation", "corporateTransportation", "delegationTransportation",
  "conferenceCongressTransportation", "specialEvents", "weddingTransportation",
  "promTransportation", "vipTransportation",
];

for (const route of consumers) for (const locale of locales) {
  test(`${route}/${locale}: enlarged CTA contacts remain readable`, async ({ page }) => {
    for (const width of [320, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(routePath(route, locale));
      await page.evaluate(async () => {
        document.documentElement.style.fontSize = "200%";
        await document.fonts.ready;
        await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      });
      await expect.poll(() => page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe("32px");
      const panels = page.locator(".final-cta");
      await expect(panels).toHaveCount(1);
      const failures = await panels.evaluateAll((elements) => elements.flatMap((panel) => {
        const bounds = panel.getBoundingClientRect();
        return [...panel.querySelectorAll<HTMLElement>(".final-cta__contacts a")].flatMap((link) => {
          const box = link.getBoundingClientRect();
          const valid = box.left >= bounds.left && box.right <= bounds.right + 1 &&
            box.bottom <= bounds.bottom + 1 && link.scrollWidth <= link.clientWidth + 1 &&
            box.width >= 44 && box.height >= 44;
          return valid ? [] : [{ text: link.textContent, width: box.width, right: box.right,
            panelRight: bounds.right, scrollWidth: link.scrollWidth, clientWidth: link.clientWidth }];
        });
      }));
      expect(failures, `${route}/${locale} at ${width}px and 200% text`).toEqual([]);
    }
  });
}
