import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, readdirSync } from "node:fs";
import { resolve, relative } from "node:path";
import { bookingServiceKeys } from "../../src/data/booking";

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-09-26T10:00:00Z"));
});

const dist = resolve("dist");
const pages = readdirSync(dist, { recursive: true }).filter((file): file is string =>
  typeof file === "string" && file.endsWith("index.html") && !file.startsWith("dev/"));
const destinations = new Set(["/rezervacija/", "/en/booking/", "/ru/bronirovanie/", "/kontakt/", "/en/contact/", "/ru/kontakty/"]);
const links = new Map<string, string[]>();
for (const file of pages) {
  const html = readFileSync(resolve(dist, file), "utf8");
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1]!.replaceAll("&amp;", "&");
    const url = new URL(href, "http://localhost:4323");
    if (url.origin !== "http://localhost:4323" || !destinations.has(url.pathname)) continue;
    links.set(href, [...(links.get(href) ?? []), relative(dist, resolve(dist, file))]);
  }
}

const locales = [
  { locale: "sr", airport: "/aerodromski-prevoz/", booking: "/rezervacija/", contact: "/kontakt/" },
  { locale: "en", airport: "/en/airport-transportation/", booking: "/en/booking/", contact: "/en/contact/" },
  { locale: "ru", airport: "/ru/transfer-iz-aeroporta/", booking: "/ru/bronirovanie/", contact: "/ru/kontakty/" },
];

test("all published booking/contact links resolve with supported query parameters", async ({ request }) => {
  expect(pages.length).toBeGreaterThanOrEqual(45);
  expect(links.size).toBeGreaterThan(20);
  for (const [href, sources] of links) {
    const url = new URL(href, "http://localhost:4323");
    expect(url.pathname.endsWith("/"), sources.join(", ")).toBe(true);
    for (const key of url.searchParams.keys()) expect(["intent", "service"]).toContain(key);
    if (url.searchParams.has("intent")) expect(["booking", "quote"]).toContain(url.searchParams.get("intent"));
    if (url.searchParams.has("service")) expect(bookingServiceKeys).toContain(url.searchParams.get("service"));
    const response = await request.get(href);
    expect(response.status(), `${href} from ${sources.join(", ")}`).toBe(200);
    const html = await response.text();
    expect(html).toContain(url.pathname.includes("booking") || url.pathname.includes("rezervacija") || url.pathname.includes("bronirovanie") ? "data-booking-wizard" : "data-contact-question-form");
  }
  console.log(`Scanned ${pages.length} published pages and ${[...links.values()].reduce((sum, sources) => sum + sources.length, 0)} booking/contact links (${links.size} distinct destinations).`);
});

for (const route of locales) {
  test(`${route.locale}: actual contextual links hydrate service/intent and clean the query`, async ({ page }) => {
    const entries = [...links.keys()].filter(href => href.startsWith(`${route.booking}?`));
    for (const href of entries) {
      await page.goto(href);
      const url = new URL(href, "http://localhost:4323");
      const form = page.locator("[data-booking-wizard]");
      await expect(form).toHaveAttribute("data-intent", url.searchParams.get("intent") ?? "booking");
      await expect(page).toHaveURL(new RegExp(`${route.booking}$`));
      const service = url.searchParams.get("service");
      await expect(form.locator(`[data-step-panel="${service ? "journey" : "service"}"]`)).toBeVisible();
      if (service) await expect(form.locator(`input[value="${service}"]:checked`)).toHaveCount(1);
    }
  });

  test(`${route.locale}: Airport calendar validation and canonical handoff`, async ({ page }) => {
    await page.goto(route.airport);
    const form = page.locator("[data-airport-booking-start]");
    const date = form.locator('[name="dateDisplay"]');
    await date.fill("31/02/2099");
    await expect(date).toHaveAttribute("aria-invalid", "true");
    await form.locator('[name="timeHour"]').selectOption("23");
    await form.locator('[name="timeMinute"]').selectOption("59");
    await form.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(new RegExp(`${route.airport}$`));
    await expect(form.locator('[name="date"]')).toHaveValue("");
    await date.fill("10102026");
    await expect(date).toHaveValue("10/10/2026");
    await form.locator('[name="flightNumber"]').fill("JU 123");
    await expect(form.locator('[name="timeHour"] option[value="24"]')).toHaveCount(0);
    await expect(form.locator('[name="timeMinute"] option[value="60"]')).toHaveCount(0);
    let handoff = "";
    await page.route(`**${route.booking}?*`, async route => { handoff = route.request().url(); await route.continue(); });
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('[data-step-panel="journey"]')).toBeVisible();
    const params = new URL(handoff).searchParams;
    expect([...params.keys()].sort()).toEqual(["date", "flightNumber", "intent", "service", "time"]);
    expect(params.get("date")).toBe("2026-10-10");
    expect(params.get("time")).toBe("23:59");
    await expect(page.locator('[name="dateDisplay"]')).toHaveValue("10/10/2026");
    await expect(page.locator('[name="timeHour"]')).toHaveValue("23");
    await expect(page.locator('[name="timeMinute"]')).toHaveValue("59");
    await expect(page.locator('[name="flightNumber"]')).toHaveValue("JU 123");
    await expect(page).toHaveURL(new RegExp(`${route.booking}$`));
  });


  test(`${route.locale}: date mask, calendar action and bounded dates stay synchronized`, async ({ page }) => {
    await page.goto(route.airport);
    const form = page.locator("[data-airport-booking-start]");
    const date = form.locator('[name="dateDisplay"]');
    const picker = form.locator('[data-booking-calendar]');
    const button = form.locator('[data-booking-calendar-button]');
    await expect(button).toBeVisible();
    await expect(picker).toHaveAttribute("min", "2026-09-26");
    await expect(picker).toHaveAttribute("max", "2027-09-26");
    await date.pressSequentially("01092026");
    await expect(date).toHaveValue("01/09/2026");
    await expect(date).toHaveAttribute("aria-invalid", "true");
    await date.fill("27092027");
    await expect(date).toHaveValue("27/09/2027");
    await expect(date).toHaveAttribute("aria-invalid", "true");
    await date.fill("26092027");
    await expect(date).toHaveAttribute("aria-invalid", "false");
    await expect(picker).toHaveValue("2027-09-26");
    await date.fill("");
    await expect(form.locator('[name="date"]')).toHaveValue("");
    await expect(picker).toHaveValue("");
    await date.pressSequentially("10102026");
    await expect(date).toHaveValue("10/10/2026");
    // Replace a day in the middle; caret must remain usable instead of jumping to the end.
    await date.evaluate((input: HTMLInputElement) => input.setSelectionRange(0, 2));
    await date.press("1");
    await date.press("1");
    await expect(date).toHaveValue("11/10/2026");
    await date.evaluate((input: HTMLInputElement) => input.setSelectionRange(3, 3));
    await date.press("Backspace");
    await expect(date).toHaveValue("11/02/026");
    await date.fill("10102026");
    await date.press("Tab");
    await expect(button).toBeFocused();
    await picker.evaluate((input: HTMLInputElement) => {
      const nativeShow = input.showPicker.bind(input);
      input.showPicker = () => { input.dataset.opened = "true"; nativeShow(); };
    });
    await button.press("Enter");
    await expect(picker).toHaveAttribute("data-opened", "true");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(date).toHaveValue("11/10/2026");
    await expect(form.locator('[name="date"]')).toHaveValue("2026-10-11");
    // Native picker selection emits a change event; verify its application-side result.
    await picker.evaluate((input: HTMLInputElement) => { input.value = "2026-10-12"; input.dispatchEvent(new Event("input", { bubbles: true })); input.dispatchEvent(new Event("change", { bubbles: true })); });
    await expect(date).toHaveValue("12/10/2026");
    await expect(form.locator('[name="date"]')).toHaveValue("2026-10-12");
    await expect(date).toBeFocused();
    await picker.evaluate((input: HTMLInputElement) => { input.showPicker = () => { throw new DOMException("Unavailable"); }; });
    await button.click();
    await expect(date).toBeFocused();

    await page.goto(`${route.booking}?service=airportTransportation&date=2032-01-01&time=12:00`);
    await expect(page.locator('[name="dateDisplay"]')).toHaveValue("");
    await page.locator('[name="dateDisplay"]').fill("10102026");
    await page.locator('[name="timeHour"]').selectOption("12");
    await page.locator('[name="timeMinute"]').selectOption("00");
    await page.locator('[name="returnRequested"]').check();
    const returnPicker = page.locator('[data-booking-calendar][data-date-for="returnDate"]');
    await expect(returnPicker).toHaveAttribute("min", "2026-10-10");
    await expect(returnPicker).toHaveAttribute("max", "2027-09-26");
    const accessibility = await new AxeBuilder({ page }).include("[data-booking-wizard]").withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    expect(accessibility.violations).toEqual([]);
    await page.locator('[name="returnDateDisplay"]').pressSequentially("01012032");
    await expect(page.locator('[name="returnDateDisplay"]')).toHaveValue("01/01/2032");
    await page.locator('[name="returnTimeHour"]').selectOption("12");
    await page.locator('[name="returnTimeMinute"]').selectOption("00");
    await page.locator('[data-booking-continue] button').click();
    await expect(page.locator('[name="returnDateDisplay"]')).toHaveAttribute("aria-invalid", "true");
  });

  test(`${route.locale}: schedule controls fit all five viewport states`, async ({ page }) => {
    for (const path of [route.airport, `${route.booking}?service=airportTransportation&intent=booking`]) {
      await page.goto(path);
      if (path.includes("?")) await page.locator('[name="returnRequested"]').check();
      for (const width of [320, 768, 1024, 1440, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} at ${width}`).toBe(true);
        for (const control of await page.locator('[data-booking-date-display]:visible, [data-booking-calendar-button]:visible, [data-booking-hour]:visible, [data-booking-minute]:visible').all()) {
          const bounds = await control.boundingBox();
          expect(bounds!.height).toBeGreaterThanOrEqual(44);
          expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
        }
      }
    }
  });
}


test("manual date entry remains available without native picker support", async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(HTMLInputElement.prototype, "showPicker", { value: undefined, configurable: true }); });
  await page.goto("/en/airport-transportation/");
  await expect(page.locator("[data-booking-calendar-button]")).toBeHidden();
  await page.locator('[name="dateDisplay"]').pressSequentially("10102026");
  await expect(page.locator('[name="dateDisplay"]')).toHaveValue("10/10/2026");
  await expect(page.locator('[name="date"]')).toHaveValue("2026-10-10");
});
