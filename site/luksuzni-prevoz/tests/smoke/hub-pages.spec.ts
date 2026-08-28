import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { axeWcag22Tags, assertNoHorizontalOverflow, routePath } from "../support/contracts";

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
        route.key === "businessTransportation"
          ? ".service-grid > li"
          : ".selector-grid > article";
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
    for (const key of ["weddingTransportation", "promTransportation", "vipTransportation"] as const) {
      await expect(page.locator(`.selector-grid a[href="${routePath(key, "en")}"]`)).toHaveCount(1);
    }
  });

  test("desktop Services menus expose both localized hub URLs", async ({ page }) => {
    for (const locale of ["sr", "en", "ru"] as const) {
      await page.goto(routePath("home", locale));
      await page.locator('[data-dropdown-trigger][aria-controls="hdr-services"]').click();

      for (const key of ["businessTransportation", "specialEvents"] as const) {
        const trigger = page.locator(
          `[data-dropdown-trigger][aria-controls="hdr-sub-${key}"]`,
        );
        await trigger.click();
        await expect(
          page.locator(
            `#hdr-sub-${key} a[href="${routePath(key, locale)}"]:visible`,
          ),
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

  test("Business renders the locked commercial, proof, and conversion contract", async ({ page }) => {
    await page.goto(routePath("businessTransportation", "en"));

    await expect(page.locator('.service-hero[data-variant="full-bleed"]')).toHaveCount(1);
    await expect(page.locator('.service-hero a[href="#business-services"]')).toHaveCount(1);
    await expect(page.locator(".service-hero__trust > li")).toHaveCount(3);
    await expect(page.locator(".service-grid > li")).toHaveCount(3);
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
    await expect(page.locator(".process-grid > li")).toHaveCount(3);
    await expect(page.locator(".faq-list > details")).toHaveCount(6);
  });

  test("required responsive states have no accidental horizontal overflow", async ({ page }) => {
    for (const route of [
      routePath("businessTransportation", "sr"),
      routePath("specialEvents", "ru"),
    ]) {
      await page.goto(route);
      for (const width of [320, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: width < 1024 ? 1024 : 900 });
        await assertNoHorizontalOverflow(page);
      }
    }
  });

  for (const key of ["businessTransportation", "specialEvents"] as const) {
    test(`${key} passes the automated WCAG 2.2 floor`, async ({ page }) => {
      await page.goto(routePath(key, "en"));
      const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});
