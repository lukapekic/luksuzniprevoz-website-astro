import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { settleDocumentMotion } from "../support/contracts";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-26T10:00:00Z"));
});

const routes = ["/rezervacija/", "/en/booking/", "/ru/bronirovanie/"];

test.describe("Booking page", () => {
  for (const path of routes) {
    test(`${path} renders the published four-step request panel`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      const form = page.locator("[data-booking-wizard]");
      await expect(form).toHaveCount(1);
      expect(await form.getAttribute("action")).toBeNull();
      expect(await form.getAttribute("method")).toBeNull();
      await expect(page.locator('[data-booking-actions]')).toBeVisible();
      await expect(form.locator('[data-booking-progress]')).toBeVisible();
      await expect(form.locator('[data-booking-summary]')).toBeHidden();
    });
  }

  test("consumes a validated Airport handoff and completes the client-only flow", async ({ page, browserName }) => {
    await page.addInitScript(() => {
      window.turnstile = {
        render: (_container, options) => { options.callback("test-token"); return "booking-widget"; },
        reset: () => undefined,
        remove: () => undefined,
      };
    });
    await page.route("**/api/forms/booking", async (route) => {
      await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, status: "pending", reference: "LP-TEST-BOOKING" }) });
    });
    await page.goto("/en/booking/?intent=booking&service=airportTransportation&date=2026-10-10&time=12%3A00&flightNumber=JU123");
    await expect(page).toHaveURL(/\/en\/booking\/$/);
    await expect(page.locator('[data-step-panel="journey"]')).toBeVisible();
    await expect(page.locator('[data-journey-branch="airportTransportation"]')).toBeVisible();
    await expect(page.locator('[name="date"]')).toHaveValue("2026-10-10");
    await expect(page.locator('[name="dateDisplay"]')).toHaveValue("10/10/2026");
    await expect(page.locator('[data-booking-hour][data-time-for="time"]')).toHaveValue("12");
    await expect(page.locator('[data-booking-minute][data-time-for="time"]')).toHaveValue("00");
    await expect(page.locator('[name="flightNumber"]')).toHaveValue("JU123");

    await page.locator('[name="pickup"]').fill("Belgrade Airport");
    await page.locator('[name="destination"]').fill("Belgrade city");
    await page.locator('[name="airportDirection"][value="airport-to-city"]').check();
    await page.locator('[name="airportScope"][value="belgrade-city"]').check();
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator("#booking-vehicle-heading")).toBeFocused();

    await page.locator('[name="passengerCount"]').fill("2");
    await page.locator('[name="vehiclePreference"][value="recommend"]').check();
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator("#booking-review-heading")).toBeFocused();
    await expect(page.locator('[data-booking-summary]')).toBeHidden();
    await expect(page.locator('[data-booking-final] button')).toBeEnabled();
    await expect(page.locator('[data-review-value="price"]')).toContainText("Custom quote");
    await page.locator('[name="fullName"]').fill("Jovana Petrović");
    await page.locator('[name="email"]').fill("jovana@example.com");
    const finalButton = page.locator('[data-booking-final] button');
    // Playwright's headless WebKit can report a completed pointer click on a
    // submit button without dispatching the form's submit event on Ubuntu
    // 24.04. Keyboard activation exercises the same native button contract;
    // Chromium and Firefox retain pointer coverage for the submission path.
    if (browserName === "webkit") await finalButton.press("Enter");
    else await finalButton.click();
    await expect(page.locator("#booking-form-status")).toContainText("LP-TEST-BOOKING");
  });

  test("generic and concrete CTA handoffs stay distinct", async ({ page }) => {
    await page.goto("/en/");
    const headerBook = page.locator("header [href*='/en/booking/']").first();
    await expect(headerBook).toHaveAttribute("href", "/en/booking/?intent=booking");

    await page.goto("/en/private-chauffeur/");
    const contextual = page.locator("a[href*='/en/booking/?intent='][href*='service=privateChauffeur']");
    await expect(contextual.first()).toBeVisible();
  });

  test("keeps the first step usable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    await page.goto("/en/booking/");
    await expect(page.locator('[data-step-panel="service"]')).toBeVisible();
    await expect(page.locator('[name="serviceCategory"]')).toHaveCount(4);
    await expect(page.locator('[data-booking-actions]')).toBeHidden();
    await expect(page.locator("noscript a[href='/en/contact/']")).toBeVisible();

    await context.close();
  });

  test("moves focus to the first invalid control", async ({ page }) => {
    await page.goto("/en/booking/");
    await page.locator('[data-booking-continue] button').click();

    await expect(page.locator('[name="serviceCategory"]').first()).toBeFocused();
    await expect(page.locator("#booking-service-error")).toBeVisible();
  });

  test("normalizes explicit dates and blocks an invalid return", async ({ page }) => {
    await page.goto("/rezervacija/");
    await page.locator('[name="serviceCategory"][value="airportTransportation"]').check();
    await page.locator('[data-booking-continue] button').click();
    await page.locator('[name="dateDisplay"]').fill("31/02/2099");
    await page.locator('[name="timeHour"]').selectOption("18");
    await page.locator('[name="timeMinute"]').selectOption("30");
    await page.locator('[name="pickup"]').fill("Belgrade Airport");
    await page.locator('[name="destination"]').fill("Belgrade");
    await page.locator('[name="airportDirection"][value="airport-to-city"]').check();
    await page.locator('[name="airportScope"][value="belgrade-city"]').check();
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator('[name="dateDisplay"]')).toBeFocused();
    await page.locator('[name="dateDisplay"]').fill("10/10/2026");
    await page.locator('[name="returnRequested"]').check();
    await page.locator('[name="returnDateDisplay"]').fill("10/10/2026");
    await page.locator('[name="returnTimeHour"]').selectOption("17");
    await page.locator('[name="returnTimeMinute"]').selectOption("00");
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator('[name="returnDateDisplay"]')).toBeFocused();
    await page.locator('[name="returnTimeHour"]').selectOption("19");
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator('#booking-vehicle-heading')).toBeFocused();
    await expect(page.locator('[data-summary-value="schedule"]')).toContainText("10/10/2026 · 18:30");
  });

  test("meets the page accessibility baseline", async ({ page }) => {
    await page.goto("/en/booking/");
    await settleDocumentMotion(page);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const width of [320, 768, 1024, 1440, 1920]) {
    test(`has no overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ru/bronirovanie/");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const minimumChoiceHeight = await page.locator(".booking-choice").first().evaluate((element) => element.getBoundingClientRect().height);
      expect(minimumChoiceHeight).toBeGreaterThanOrEqual(44);
    });
  }
});
