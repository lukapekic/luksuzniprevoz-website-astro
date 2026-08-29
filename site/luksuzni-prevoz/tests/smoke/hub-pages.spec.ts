import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  axeWcag22Tags,
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  reviewViewports,
  routePath,
} from "../support/contracts";

const hubRoutes = [
  { key: "businessTransportation", locale: "sr", htmlLang: "sr-Latn" },
  { key: "businessTransportation", locale: "en", htmlLang: "en" },
  { key: "businessTransportation", locale: "ru", htmlLang: "ru" },
  { key: "specialEvents", locale: "sr", htmlLang: "sr-Latn" },
  { key: "specialEvents", locale: "en", htmlLang: "en" },
  { key: "specialEvents", locale: "ru", htmlLang: "ru" },
] as const;

test.describe("Business and Special Events hubs", () => {
  for (const route of hubRoutes) {
    test(`${route.key}/${route.locale} renders the dedicated hub`, async ({ page }) => {
      const response = await page.goto(routePath(route.key, route.locale));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h2")).not.toHaveCount(0);
      const cardSelector =
        route.key === "businessTransportation" ? ".service-grid > li" : ".selector-grid > article";
      await expect(page.locator(cardSelector)).toHaveCount(3);
    });
  }

  test("hub selectors preserve canonical child routes", async ({ page }) => {
    await page.goto(routePath("businessTransportation", "en"));
    for (const key of [
      "corporateTransportation",
      "delegationTransportation",
      "conferenceCongressTransportation",
    ] as const) {
      await expect(page.locator(`.service-grid a[href="${routePath(key, "en")}"]`)).toHaveCount(1);
    }

    await page.goto(routePath("specialEvents", "en"));
    for (const key of [
      "weddingTransportation",
      "promTransportation",
      "vipTransportation",
    ] as const) {
      await expect(page.locator(`.selector-grid a[href="${routePath(key, "en")}"]`)).toHaveCount(1);
    }
  });

  test("desktop Services menus expose both localized hub URLs", async ({ page }) => {
    for (const locale of ["sr", "en", "ru"] as const) {
      await page.goto(routePath("home", locale));
      await page.locator('[data-dropdown-trigger][aria-controls="hdr-services"]').click();

      for (const key of ["businessTransportation", "specialEvents"] as const) {
        const trigger = page.locator(`[data-dropdown-trigger][aria-controls="hdr-sub-${key}"]`);
        await trigger.click();
        await expect(
          page.locator(`#hdr-sub-${key} a[href="${routePath(key, locale)}"]:visible`),
        ).toHaveCount(1);
        await trigger.click();
      }
    }
  });

  test("Special Events placeholder content remains non-indexable", async ({ page }) => {
    await page.goto(routePath("specialEvents", "en"));
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(0);
  });

  test("Business remains indexable with localized SEO alternates", async ({ page }) => {
    await page.goto(routePath("businessTransportation", "en"));
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(3);
  });

  test("Business renders the locked commercial, proof, and conversion contract", async ({
    page,
  }) => {
    await page.goto(routePath("businessTransportation", "en"));

    await expect(page.locator('.service-hero[data-variant="full-bleed"]')).toHaveCount(1);
    await expect(page.locator('.service-hero a[href="#business-services"]')).toHaveCount(1);
    await expect(page.locator(".service-hero__trust > li")).toHaveCount(3);
    await expect(page.locator(".service-grid > li")).toHaveCount(3);
    await expect(page.locator(".service-card__media img")).toHaveCount(3);
    await expect(page.locator(".service-grid")).not.toContainText(/security|protection/i);

    for (const name of [
      "President Palace Belgrade",
      "Hyatt Regency Belgrade",
      "Qatar Airways",
      "Square Nine Hotel Belgrade",
    ]) {
      await expect(page.locator(`.client-grid img[alt="${name}"]`)).toHaveCount(1);
    }
    await expect(page.locator('.client-grid img[alt*="Embassy"]')).toHaveCount(0);
    await expect(page.locator(".standards-grid > li")).toHaveCount(6);
    await expect(
      page.locator(
        'section[aria-labelledby="business-process-heading"] .business-divided-panel > li',
      ),
    ).toHaveCount(3);
    await expect(page.locator(".faq-list > details")).toHaveCount(6);
  });

  test("Business uses divided light panels and the approved coordination image", async ({
    page,
  }) => {
    await page.goto(routePath("businessTransportation", "en"));

    const engagement = page.locator('section[aria-labelledby="business-engagement-heading"]');
    const process = page.locator('section[aria-labelledby="business-process-heading"]');
    const engagementPanel = engagement.locator('.business-divided-panel[data-layout="stacked"]');
    const processPanel = process.locator('.business-divided-panel[data-layout="three-columns"]');

    await expect(engagementPanel.locator(":scope > li")).toHaveCount(2);
    await expect(processPanel.locator(":scope > li")).toHaveCount(3);
    await expect(engagement.locator(".engagement-copy a")).toHaveCount(1);
    await expect(engagementPanel.locator("a")).toHaveCount(0);

    const panelTokens = await engagementPanel.evaluate((panel) => {
      const probe = document.createElement("div");
      probe.style.cssText = [
        "position:fixed",
        "visibility:hidden",
        "background:var(--color-surface-light)",
        "color:var(--color-text-on-light)",
        "border-radius:var(--radius-section)",
      ].join(";");
      document.body.append(probe);
      const actual = getComputedStyle(panel);
      const expected = getComputedStyle(probe);
      const result = {
        background: actual.backgroundColor === expected.backgroundColor,
        color: actual.color === expected.color,
        radius: actual.borderRadius === expected.borderRadius,
        boxShadow: actual.boxShadow,
      };
      probe.remove();
      return result;
    });
    expect(panelTokens).toEqual({
      background: true,
      color: true,
      radius: true,
      boxShadow: "none",
    });

    const coordinationImage = page.locator(".coordination-media img");
    await expect(coordinationImage).toHaveCount(1);
    await expect(coordinationImage).toHaveAttribute("alt", "");
    await expect(coordinationImage).toHaveAttribute("src", /hero-example/);
    await expect
      .poll(() => coordinationImage.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
    expect(await coordinationImage.evaluate((image) => getComputedStyle(image).objectFit)).toBe(
      "cover",
    );
  });

  test("required responsive states have no accidental horizontal overflow", async ({ page }) => {
    for (const route of [
      routePath("businessTransportation", "sr"),
      routePath("businessTransportation", "en"),
      routePath("businessTransportation", "ru"),
      routePath("specialEvents", "ru"),
    ]) {
      for (const viewport of reviewViewports) {
        await page.setViewportSize(viewport);
        await page.goto(route);
        await assertNoHorizontalOverflow(page);
        if (route !== routePath("specialEvents", "ru")) {
          await assertMinimumTargetSize(page);
        }
      }
    }
  });

  test("Business uses the locked tablet and desktop topology", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(routePath("businessTransportation", "en"));

    const tabletCards = await page.locator(".service-grid > li").evaluateAll((items) =>
      items.map((item) => {
        const rect = item.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width };
      }),
    );
    expect(tabletCards[0].width).toBeGreaterThan(tabletCards[1].width * 1.8);
    expect(Math.abs(tabletCards[1].y - tabletCards[2].y)).toBeLessThan(2);
    expect(tabletCards[0].y).toBeLessThan(tabletCards[1].y);

    const tabletEngagement = await page.locator(".engagement-layout").evaluate((layout) => {
      const copy = layout.querySelector<HTMLElement>(".engagement-copy")!.getBoundingClientRect();
      const panel = layout.querySelector<HTMLElement>(".engagement-panel")!.getBoundingClientRect();
      const rows = Array.from(
        layout.querySelectorAll<HTMLElement>(".business-divided-panel > li"),
      ).map((item) => item.getBoundingClientRect());
      return {
        panelAfterCopy: panel.top >= copy.bottom,
        rowsStacked: rows[1].top > rows[0].top && Math.abs(rows[0].left - rows[1].left) < 2,
      };
    });
    expect(tabletEngagement).toEqual({ panelAfterCopy: true, rowsStacked: true });

    const tabletProcess = await page
      .locator('section[aria-labelledby="business-process-heading"] .business-divided-panel > li')
      .evaluateAll((items) =>
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        }),
      );
    expect(tabletProcess[1].y).toBeGreaterThan(tabletProcess[0].y);
    expect(tabletProcess[2].y).toBeGreaterThan(tabletProcess[1].y);
    expect(
      Math.max(...tabletProcess.map((item) => item.x)) -
        Math.min(...tabletProcess.map((item) => item.x)),
    ).toBeLessThan(2);

    await page.setViewportSize({ width: 1024, height: 768 });
    const desktopCards = await page
      .locator(".service-grid > li")
      .evaluateAll((items) => items.map((item) => item.getBoundingClientRect().y));
    expect(Math.max(...desktopCards) - Math.min(...desktopCards)).toBeLessThan(2);

    const desktopLogos = await page
      .locator(".client-grid > li")
      .evaluateAll((items) => items.map((item) => item.getBoundingClientRect().y));
    expect(Math.max(...desktopLogos) - Math.min(...desktopLogos)).toBeLessThan(2);

    const desktopEngagement = await page.locator(".engagement-layout").evaluate((layout) => {
      const copy = layout.querySelector<HTMLElement>(".engagement-copy")!.getBoundingClientRect();
      const panel = layout.querySelector<HTMLElement>(".engagement-panel")!.getBoundingClientRect();
      const rows = Array.from(
        layout.querySelectorAll<HTMLElement>(".business-divided-panel > li"),
      ).map((item) => item.getBoundingClientRect());
      return {
        split: panel.left > copy.left && Math.abs(panel.top - copy.top) < 2,
        rowsStacked: rows[1].top > rows[0].top && Math.abs(rows[0].left - rows[1].left) < 2,
      };
    });
    expect(desktopEngagement).toEqual({ split: true, rowsStacked: true });

    const desktopProcess = await page
      .locator('section[aria-labelledby="business-process-heading"] .business-divided-panel > li')
      .evaluateAll((items) =>
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        }),
      );
    expect(
      Math.max(...desktopProcess.map((item) => item.y)) -
        Math.min(...desktopProcess.map((item) => item.y)),
    ).toBeLessThan(2);
    expect(desktopProcess[1].x).toBeGreaterThan(desktopProcess[0].x);
    expect(desktopProcess[2].x).toBeGreaterThan(desktopProcess[1].x);
  });

  test("Business preserves logical focus order and reduced-motion behavior", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(routePath("businessTransportation", "en"));

    const focusContract = await page.evaluate(() => {
      const focusable = Array.from(
        document.querySelectorAll<HTMLElement>(
          'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]',
        ),
      ).filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      });
      const positiveTabindex = focusable.filter((element) => Number(element.tabIndex) > 0);
      const engagementCta = document.querySelector<HTMLElement>(".engagement-copy a");
      const finalCta = document.querySelector<HTMLElement>(".fcta-panel a");
      return {
        positiveTabindex: positiveTabindex.length,
        engagementBeforeFinal:
          Boolean(engagementCta && finalCta) &&
          Boolean(
            engagementCta!.compareDocumentPosition(finalCta!) & Node.DOCUMENT_POSITION_FOLLOWING,
          ),
      };
    });
    expect(focusContract).toEqual({ positiveTabindex: 0, engagementBeforeFinal: true });

    await expect(
      page.locator('.service-hero[data-variant="full-bleed"] .service-hero__media'),
    ).toHaveCSS("animation-name", "none");
    const reducedTransitionDuration = await page
      .locator(".vehicle__image")
      .first()
      .evaluate((image) => Number.parseFloat(getComputedStyle(image).transitionDuration));
    expect(reducedTransitionDuration).toBeLessThanOrEqual(0.001);
  });

  for (const key of ["businessTransportation", "specialEvents"] as const) {
    test(`${key} passes the automated WCAG 2.2 floor`, async ({ page }) => {
      await page.goto(routePath(key, "en"));
      const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
