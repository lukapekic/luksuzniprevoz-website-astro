import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { axeWcag22Tags } from "../support/contracts";

const routes = [
  { locale: "sr", htmlLang: "sr-Latn", path: "/aerodromski-prevoz/" },
  { locale: "en", htmlLang: "en", path: "/en/airport-transportation/" },
  { locale: "ru", htmlLang: "ru", path: "/ru/transfer-iz-aeroporta/" },
] as const;

test.describe("Airport Transportation", () => {
  for (const route of routes) {
    test(`${route.locale} renders the dedicated localized page`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main section")).toHaveCount(9);
      await expect(page.locator('input[name="flightNumber"]')).toHaveCount(1);
      await expect(page.locator('input[name="date"][type="date"]')).toHaveCount(1);
      await expect(page.locator('input[name="time"][type="time"]')).toHaveCount(1);
    });
  }

  test("booking start is a real accessible handoff and vehicle fares are data-gated", async ({
    page,
  }) => {
    await page.goto("/en/airport-transportation/");
    await expect(page.getByText("Flight number (optional)")).toBeVisible();
    await expect(
      page.getByText(
        "Flight tracking, meet and greet, and standard waiting after landing: 60 min.",
      ),
    ).toBeVisible();
    await expect(page.getByText("At least 5 years of driving experience")).toBeVisible();
    await expect(page.locator('input[name="date"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="time"]')).toHaveAttribute("required", "");
    const form = page.locator("#airport-booking form");
    await expect(form).toHaveAttribute("method", "get");
    await expect(form).toHaveAttribute("action", "/en/contact/");
    await expect(form.locator('button[type="submit"]')).toHaveCount(1);
    await expect(form.locator('input[name="service"]')).toHaveValue("airportTransportation");
    await expect(page.getByText("Airport fare")).toHaveCount(4);
    await expect(page.getByText("Fare coming soon")).toHaveCount(0);
    await expect(page.locator(".vehicle__meta").getByText(/€/)).toHaveCount(4);
    await expect(page.locator("[data-carousel-current]")).toHaveText("01");
    await page.locator("[data-carousel-next]").click();
    await expect(page.locator("[data-carousel-current]")).toHaveText("02");
  });

  test("has no horizontal overflow at required review widths", async ({ page }) => {
    await page.goto("/aerodromski-prevoz/");
    for (const width of [320, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: width < 1000 ? 1024 : 900 });
      await page.evaluate(() => new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }));
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }
  });

  test("uses the approved open arrival split, section spacing, and fleet-family naming", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/aerodromski-prevoz/");

    const arrival = page.locator('section[aria-labelledby="arrival-heading"]');
    const arrivalMedia = arrival.locator(".open-split__media");
    const arrivalContent = arrival.locator(".open-split__content");
    const [mediaBox, contentBox] = await Promise.all([
      arrivalMedia.boundingBox(),
      arrivalContent.boundingBox(),
    ]);

    expect(mediaBox).not.toBeNull();
    expect(contentBox).not.toBeNull();
    expect(mediaBox!.width).toBeLessThan(contentBox!.width);
    expect(Math.abs(mediaBox!.height - contentBox!.height)).toBeLessThanOrEqual(1);

    const bookingBox = await page.locator("#airport-booking").boundingBox();
    expect(bookingBox).not.toBeNull();
    expect(bookingBox!.y - (mediaBox!.y + mediaBox!.height)).toBeGreaterThan(32);

    await expect(page.getByRole("heading", { name: "Mercedes V klasa", exact: true })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: /Mercedes V klasa 6\+1/ })).toHaveCount(0);
  });

  test("FND-A11Y-01: passes the automated WCAG 2.2 floor", async ({ page }) => {
    await page.goto("/aerodromski-prevoz/");
    const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
    expect(results.violations).toEqual([]);
  });
});
