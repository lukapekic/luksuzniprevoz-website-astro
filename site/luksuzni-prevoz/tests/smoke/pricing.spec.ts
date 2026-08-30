import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { getPublishedPricingRecords } from "../../src/components/pricing/pricing-view-model";
import { getRoute } from "../../src/data/routes";
import { formatCurrency } from "@astro-foundation/core/i18n";
import {
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  axeWcag22Tags,
  flowPath,
  reviewViewports,
  routePath,
} from "../support/contracts";

const localizedRoutes = [
  { locale: "sr", htmlLang: "sr-Latn" },
  { locale: "en", htmlLang: "en" },
  { locale: "ru", htmlLang: "ru" },
] as const;
const publishedRecords = getPublishedPricingRecords();
const publishedVehicleIds = publishedRecords.map(({ vehicle }) => vehicle.id);

test.describe("Pricing page", () => {
  for (const route of localizedRoutes) {
    test(`${route.locale} publishes the localized, indexable page`, async ({ page }) => {
      const response = await page.goto(routePath("pricing", route.locale));

      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator('.service-hero[data-variant="full-bleed"]')).toHaveCount(1);
      await expect(page.locator('header[data-over-hero="true"]')).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(
        3,
      );
      await expect(page.locator(".service-hero__support")).toBeVisible();
      await expect(page.locator(".service-hero__actions a")).toHaveCount(2);
      await expect(page.locator(".service-hero__actions a").nth(0)).toHaveAttribute(
        "href",
        flowPath("booking", route.locale),
      );
      await expect(page.locator(".service-hero__actions a").nth(1)).toHaveAttribute(
        "href",
        flowPath("quote", route.locale),
      );
    });
  }

  test("renders canonical numeric ledgers without quote-only fallbacks", async ({ page }) => {
    await page.goto(routePath("pricing", "en"));

    await expect(page.locator('nav[aria-label="Quick pricing navigation"] a')).toHaveCount(3);
    for (const id of ["airport", "private-chauffeur", "individual-pricing"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    const airportRows = page.locator("#airport [data-vehicle-id]");
    await expect(airportRows).toHaveCount(publishedVehicleIds.length);
    const chauffeurGroups = page.locator("#private-chauffeur [data-pricing-rate-group]");
    await expect(chauffeurGroups).toHaveCount(3);
    for (const group of await chauffeurGroups.all()) {
      await expect(group.locator("[data-vehicle-id]")).toHaveCount(publishedVehicleIds.length);
    }

    expect(
      await airportRows.evaluateAll((rows) => rows.map((row) => row.dataset.vehicleId)),
    ).toEqual(publishedVehicleIds);
    await expect(page.locator('[data-vehicle-id="skoda-kodiaq"]')).toHaveCount(0);
    for (const routeKey of ["vipTransportation", "delegationTransportation"] as const) {
      await expect(page.locator(`[data-route-key="${routeKey}"] a`)).toHaveCount(
        getRoute(routeKey).availability === "published" ? 1 : 0,
      );
    }
    await expect(page.locator('[data-route-key="corporateTransportation"]')).toContainText(
      "Estimate + quote",
    );
    await expect(page.locator('[data-route-key="vipTransportation"]')).toContainText(
      "Individual quote",
    );
    await expect(page.locator('[data-pricing-family="business"] li')).toHaveCount(4);
    await expect(page.locator('[data-pricing-family="events"] li')).toHaveCount(4);

    const numericLedgerText = (
      await page.locator("#airport, #private-chauffeur").allTextContents()
    ).join(" ");
    for (const { pricing } of publishedRecords) {
      expect(numericLedgerText).not.toContain(formatCurrency(pricing.perKm, "EUR", "en-GB"));
    }
    await expect(page.locator("main")).not.toContainText("PUTEVI IZ BEOGRADA");
    await expect(page.locator("main")).not.toContainText("Novi Sad");

    await expect(page.locator(".fcta-actions a").nth(0)).toHaveAttribute(
      "href",
      flowPath("booking", "en"),
    );
    await expect(page.locator(".fcta-actions a").nth(1)).toHaveAttribute(
      "href",
      flowPath("quote", "en"),
    );
  });

  test("uses the approved dark and contained light surfaces", async ({ page }) => {
    await page.goto(routePath("pricing", "en"));

    expect(
      await page
        .locator("[data-pricing-surface]")
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-pricing-surface"))),
    ).toEqual(["airport", "chauffeur", "models", "faq"]);

    await expect(page.locator('[data-pricing-surface="airport"] #airport')).toHaveCount(1);
    await expect(
      page.locator('[data-pricing-surface="chauffeur"] [data-pricing-rate-group]'),
    ).toHaveCount(3);
    await expect(page.locator('[data-pricing-surface="models"] .pricing-models')).toHaveCount(1);
    await expect(page.locator('[data-pricing-surface="faq"] details')).toHaveCount(8);

    for (const headingId of [
      "published-pricing-heading",
      "private-chauffeur-pricing-heading",
      "pricing-confirmation-heading",
    ]) {
      expect(
        await page
          .locator(`#${headingId}`)
          .evaluate(
            (heading) =>
              heading.closest("[data-pricing-surface]")?.getAttribute("data-pricing-surface") ??
              null,
          ),
      ).toBeNull();
    }

    expect(
      await page.locator("#pricing-faq-heading").evaluate(
        (heading) =>
          heading.closest("[data-pricing-surface]")?.getAttribute("data-pricing-surface") ??
          null,
      ),
    ).toBe("faq");

    const moneySize = await page
      .locator(".pricing-rate-row__money strong")
      .first()
      .evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize));
    const unitSize = await page
      .locator(".pricing-rate-row__money span")
      .first()
      .evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize));
    expect(moneySize).toBeGreaterThan(unitSize);
  });

  test("keeps visible FAQ content and FAQPage schema in parity", async ({ page }) => {
    await page.goto(routePath("pricing", "en"));

    const visible = await page.locator("main details").evaluateAll((items) =>
      items.map((item) => ({
        question: item.querySelector("summary")?.textContent?.trim(),
        answer: item.querySelector("p")?.textContent?.trim(),
      })),
    );
    expect(visible).toHaveLength(8);

    const faqSchema = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) =>
        scripts
          .map((script) => JSON.parse(script.textContent ?? "{}"))
          .find((schema) => schema["@type"] === "FAQPage"),
      );
    expect(faqSchema.mainEntity).toHaveLength(8);
    expect(
      faqSchema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
        question: item.name,
        answer: item.acceptedAnswer.text,
      })),
    ).toEqual(visible);
  });

  test("preserves the locked responsive topology", async ({ page }) => {
    await page.goto(routePath("pricing", "en"));

    await page.setViewportSize({ width: 1024, height: 900 });
    expect(
      await page
        .locator(".pricing-introduction")
        .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
    ).toBe(2);
    expect(
      await page
        .locator(".pricing-rate-group")
        .first()
        .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
    ).toBe(1);

    await page.setViewportSize({ width: 1440, height: 900 });
    expect(
      await page
        .locator(".service-hero__composition")
        .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
    ).toBe(2);
    expect(
      await page
        .locator(".pricing-rate-group")
        .first()
        .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
    ).toBe(2);
    expect(
      await page
        .locator(".pricing-custom__families")
        .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
    ).toBe(2);
    expect(
      await page
        .locator(".pricing-models__list")
        .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
    ).toBe(3);

    const closingWidths = await page.evaluate(() => ({
      models: document
        .querySelector<HTMLElement>('[data-pricing-surface="models"]')
        ?.getBoundingClientRect().width,
      confirmation: document
        .querySelector<HTMLElement>("#pricing-confirmation-heading")
        ?.parentElement
        ?.getBoundingClientRect().width,
      faq: document
        .querySelector<HTMLElement>('[data-pricing-surface="faq"]')
        ?.getBoundingClientRect().width,
    }));
    if (!closingWidths.models || !closingWidths.confirmation || !closingWidths.faq) {
      throw new Error("Pricing closing regions must be rendered at the regular page width.");
    }
    expect(closingWidths.confirmation).toBeCloseTo(closingWidths.models, 0);
    expect(closingWidths.faq).toBeCloseTo(closingWidths.models, 0);
  });

  test("meets the page accessibility baseline", async ({ page }) => {
    await page.goto(routePath("pricing", "en"));
    const results = await new AxeBuilder({ page })
      .withTags(axeWcag22Tags)
      .options({ rules: { "target-size": { enabled: true } } })
      .analyze();

    expect(results.violations).toEqual([]);
    await assertMinimumTargetSize(page);

    const firstIndexLink = page.locator(".pricing-index__link").first();
    await firstIndexLink.focus();
    const focusStyle = await firstIndexLink.evaluate((node) => {
      const style = getComputedStyle(node);
      return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    });
    expect(focusStyle.outlineStyle).not.toBe("none");
    expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0);
  });

  for (const viewport of reviewViewports) {
    test(`has no overflow at ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(routePath("pricing", "en"));

      await assertNoHorizontalOverflow(page);
      await expect(page.locator("[data-pricing-rate-group]")).toHaveCount(4);
    });
  }
});
