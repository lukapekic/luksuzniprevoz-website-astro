import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const locales = [
  { path: "/rezervacija/", pending: /rezervacija nije potvrđena/i },
  { path: "/en/booking/", pending: /booking not confirmed/i },
  { path: "/ru/bronirovanie/", pending: /бронирование не подтверждено/i },
];

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-26T10:00:00Z"));
  await page.addInitScript(() => {
    window.turnstile = {
      render: (_container, options) => {
        options.callback("test-token");
        return "same-day-widget";
      },
      reset: () => undefined,
      remove: () => undefined,
    };
  });
});

for (const locale of locales)
  for (const width of [320, 768, 1024, 1440, 1920]) {
    test(`${locale.path} same-day notice and stable receipt at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      let submissions = 0;
      await page.route("**/api/forms/booking", async (route) => {
        submissions++;
        const body = route.request().postDataJSON();
        expect(body.payload.date).toBe("2026-09-26");
        expect(body.payload.time).toBe("14:00");
        await route.fulfill({
          status: 202,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            status: "pending",
            reference: "LP-SAME-DAY",
            schedule: {
              date: "2026-09-26",
              time: "14:00",
              timeZone: "Europe/Belgrade",
              sameDay: true,
              shortNotice: true,
            },
          }),
        });
      });
      await page.goto(
        `${locale.path}?intent=booking&service=airportTransportation&date=2026-09-26&time=13%3A59`,
      );
      const form = page.locator("[data-booking-wizard]");
      await expect(form.locator("[data-booking-earliest]")).toContainText("26/09/2026 · 14:00");
      await expect(form.locator("[data-booking-short-notice]").first()).toBeVisible();
      await form.locator('[name="pickup"]').fill("Belgrade Airport");
      await form.locator('[name="destination"]').fill("Belgrade city");
      await form.locator('[name="airportDirection"][value="airport-to-city"]').check();
      await form.locator('[name="airportScope"][value="belgrade-city"]').check();
      await form.locator("[data-booking-continue] button").click();
      await expect(form.locator('[data-error-for="dateTime"]')).toBeVisible();
      await form.locator('[name="timeHour"]').selectOption("14");
      await form.locator('[name="timeMinute"]').selectOption("00");
      await form.locator("[data-booking-continue] button").click();
      await form.locator('[name="passengerCount"]').fill("2");
      await form.locator('[name="vehiclePreference"][value="recommend"]').check();
      await form.locator("[data-booking-continue] button").click();
      await expect(
        form.locator('[data-step-panel="review"] [data-booking-short-notice]'),
      ).toBeVisible();
      await form.locator('[name="fullName"]').fill("Jovana Petrović");
      await form.locator('[name="email"]').fill("jovana@example.com");
      await form.locator("[data-booking-final] button").click();
      const receipt = form.locator("#booking-form-status");
      await expect(receipt).toContainText(locale.pending);
      await expect(receipt).toContainText("26/09/2026 · 14:00");
      await expect(receipt).toContainText("Europe/Belgrade");
      await expect(receipt).toContainText("LP-SAME-DAY");
      await expect(form.locator('[name="date"]')).toHaveValue("");
      await expect(form.locator("[data-booking-feedback]")).toBeFocused();
      expect(submissions).toBe(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBeLessThanOrEqual(0);
      expect(
        (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze())
          .violations,
      ).toEqual([]);
      await page.screenshot({
        path: test.info().outputPath("same-day-receipt.png"),
        fullPage: true,
      });
    });
  }

test("a schedule that expires while editing is revalidated before submission", async ({ page }) => {
  let submissions = 0;
  await page.route("**/api/forms/booking", async (route) => {
    submissions++;
    await route.abort();
  });
  await page.goto(
    "/en/booking/?intent=booking&service=airportTransportation&date=2026-09-26&time=14%3A00",
  );
  const form = page.locator("[data-booking-wizard]");
  await form.locator('[name="pickup"]').fill("Airport");
  await form.locator('[name="destination"]').fill("Belgrade");
  await form.locator('[name="airportDirection"][value="airport-to-city"]').check();
  await form.locator('[name="airportScope"][value="belgrade-city"]').check();
  await form.locator("[data-booking-continue] button").click();
  await form.locator('[name="passengerCount"]').fill("2");
  await form.locator('[name="vehiclePreference"][value="recommend"]').check();
  await form.locator("[data-booking-continue] button").click();
  await form.locator('[name="fullName"]').fill("Jovana Petrović");
  await form.locator('[name="email"]').fill("jovana@example.com");
  await page.clock.setFixedTime(new Date("2026-09-26T10:01:00Z"));
  await form.locator("[data-booking-final] button").click();
  await expect(form.locator('[data-step-panel="journey"]')).toBeVisible();
  await expect(form.locator('[data-error-for="dateTime"]')).toBeVisible();
  expect(submissions).toBe(0);
});

test("server clock rejection opens the schedule step and preserves entered details", async ({
  page,
}) => {
  await page.route("**/api/forms/booking", async (route) =>
    route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ ok: false, code: "validation", fields: { dateTime: "lead-time" } }),
    }),
  );
  await page.goto(
    "/en/booking/?intent=booking&service=airportTransportation&date=2026-09-26&time=14%3A00",
  );
  const form = page.locator("[data-booking-wizard]");
  await form.locator('[name="pickup"]').fill("Airport");
  await form.locator('[name="destination"]').fill("Belgrade");
  await form.locator('[name="airportDirection"][value="airport-to-city"]').check();
  await form.locator('[name="airportScope"][value="belgrade-city"]').check();
  await form.locator("[data-booking-continue] button").click();
  await form.locator('[name="passengerCount"]').fill("2");
  await form.locator('[name="vehiclePreference"][value="recommend"]').check();
  await form.locator("[data-booking-continue] button").click();
  await form.locator('[name="fullName"]').fill("Jovana Petrović");
  await form.locator('[name="email"]').fill("jovana@example.com");
  await form.locator("[data-booking-final] button").click();
  await expect(form.locator('[data-step-panel="journey"]')).toBeVisible();
  await expect(form.locator('[data-error-for="dateTime"]')).toContainText("at least 2 h");
  await expect(form.locator('[name="pickup"]')).toHaveValue("Airport");
  await expect(form.locator('[name="date"]')).toHaveValue("2026-09-26");
  await expect(form.locator('[name="email"]')).toHaveValue("jovana@example.com");
});
