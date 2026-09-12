import { expect, type Page } from "@playwright/test";
import { getPath } from "@astro-foundation/core/i18n";
import config from "../../foundation.config";
import { routes } from "../../src/data/routes";
import { resolveFlowHref } from "../../src/lib/cta";
import type { FlowKey } from "../../src/data/flows";
import viewportContract from "../../../../.governance/viewports.json" with { type: "json" };

export const locales = config.locales.locales.map((locale) => locale.code);
export const defaultLocale = config.locales.locales.find((locale) => locale.isDefault)!.code;

export function routePath(routeKey: string, locale: string): string {
  return getPath(routeKey as never, locale as never, routes, defaultLocale);
}

export function flowPath(flowKey: FlowKey, locale: string): string {
  return resolveFlowHref(flowKey, locale as never);
}

export const reviewViewports = viewportContract.viewports.map((viewport) => ({
  name: viewport.id,
  width: viewport.width,
  height: viewport.height,
}));

export const axeWcag22Tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"];

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const offenders = Array.from(document.body.querySelectorAll<HTMLElement>("*"))
      .flatMap((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.right <= clientWidth + 1 && rect.left >= -1) return [];
        let ancestor = element.parentElement;
        while (ancestor && ancestor !== document.body) {
          const overflow = getComputedStyle(ancestor).overflowX;
          if (["auto", "scroll", "hidden", "clip"].includes(overflow)) return [];
          ancestor = ancestor.parentElement;
        }
        return [
          {
            element: `${element.tagName.toLowerCase()}#${element.id}.${element.className}`.slice(
              0,
              180,
            ),
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
          },
        ];
      })
      .slice(0, 10);
    return { scrollWidth: document.documentElement.scrollWidth, clientWidth, offenders };
  });
  expect(
    dimensions.scrollWidth,
    `horizontal overflow: scrollWidth=${dimensions.scrollWidth} > clientWidth=${dimensions.clientWidth}; offenders=${JSON.stringify(dimensions.offenders)}`,
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}

export async function assertMinimumTargetSize(page: Page): Promise<void> {
  // Measure settled hit targets, preserving the strict 44px threshold. Active
  // transforms can report fractional compositor coordinates for a 44px box.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    await Promise.all(document.getAnimations()
      .filter((animation) => animation.effect?.getComputedTiming().iterations !== Infinity)
      .map((animation) => animation.finished.catch(() => undefined)));
  });
  const undersized = await page
    .locator('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]')
    .evaluateAll((elements) =>
      elements.flatMap((element) => {
        const node = element as HTMLElement;
        const root = node.getRootNode();
        if (root instanceof ShadowRoot && root.host.localName === "astro-dev-toolbar") return [];
        const style = getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden" || node.hidden) return [];
        const rect = node.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return [];
        const visuallyClipped =
          rect.width <= 1 &&
          rect.height <= 1 &&
          (node.className.includes("sr-only") ||
            style.clipPath !== "none" ||
            style.overflow === "hidden");
        if (visuallyClipped) return [];
        if (rect.width >= 44 && rect.height >= 44) return [];
        return [
          {
            element: node.outerHTML.slice(0, 180),
            width: rect.width,
            height: rect.height,
            layoutHeight: node.offsetHeight,
            minimumHeight: style.minHeight,
            transform: style.transform,
          },
        ];
      }),
    );
  expect(
    undersized,
    "FND-A11Y-05: every visible interactive target must be at least 44×44 CSS px",
  ).toEqual([]);
}
