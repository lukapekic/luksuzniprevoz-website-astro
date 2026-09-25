import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  assertMinimumTargetSize,
  assertNoHorizontalOverflow,
  axeWcag22Tags,
  reviewViewports,
  routePath,
  settleDocumentMotion,
} from "../support/contracts";

const routes = [
  { locale: "sr", htmlLang: "sr-Latn" },
  { locale: "en", htmlLang: "en" },
  { locale: "ru", htmlLang: "ru" },
] as const;

test.describe("Contact", () => {
  for (const route of routes) {
    test(`${route.locale} renders the published localized page`, async ({ page }) => {
      const response = await page.goto(routePath("contact", route.locale));
      expect(response?.status()).toBe(200);
      await expect(page.locator("html")).toHaveAttribute("lang", route.htmlLang);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
      expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBeGreaterThanOrEqual(
        3,
      );
    });
  }

  test("shows canonical contact facts and no messaging-app contact", async ({ page }) => {
    await page.goto(routePath("contact", "en"));

    await expect(page.locator('main a[href="tel:+38163380970"]')).toHaveText("+38163380970");
    await expect(page.locator('main a[href="mailto:reservations@luksuzniprevoz.rs"]')).toHaveText(
      "reservations@luksuzniprevoz.rs",
    );
    await expect(page.locator("main address")).toContainText("Antifašističke borbe 25");
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
  });

  test("validates and sends the question form through the same-origin endpoint", async ({ page }) => {
    const postRequests: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") postRequests.push(request.url());
    });

    await page.addInitScript(() => {
      window.turnstile = {
        render: (_container, options) => { options.callback("test-token"); return "contact-widget"; },
        reset: () => undefined,
        remove: () => undefined,
      };
    });
    await page.route("**/api/forms/contact", async (route) => {
      await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ ok: true, status: "pending", reference: "LP-TEST-CONTACT" }) });
    });
    await page.goto(routePath("contact", "en"));
    const form = page.locator("[data-contact-question-form]");
    expect(await form.evaluate((element) => element.hasAttribute("action"))).toBe(false);
    expect(await form.evaluate((element) => element.hasAttribute("method"))).toBe(false);
    await expect(form.locator('button[type="submit"]')).toBeEnabled();

    const fullName = form.locator('input[name="fullName"]');
    await fullName.fill("Robot");
    await fullName.blur();
    await expect(fullName).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator(`#${await fullName.getAttribute("id")}-error`)).toBeVisible();

    await fullName.fill("Jovana Petrović");
    await expect(fullName).not.toHaveAttribute("aria-invalid", "true");
    await form.locator('input[name="email"]').fill("jovana@example.com");
    await form.locator('textarea[name="message"]').fill("Please send additional service information.");
    await form.locator('button[type="submit"]').click();
    await expect(form.locator('[role="status"]')).toContainText("LP-TEST-CONTACT");
    expect(postRequests).toHaveLength(1);
  });

  test("does not put a question into the URL when JavaScript is unavailable", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(routePath("contact", "en"));
    const form = page.locator("[data-contact-question-form]");
    await form.locator('input[name="fullName"]').fill("Jovana Petrović");
    await form.locator('input[name="email"]').fill("jovana@example.com");
    await form.locator('textarea[name="message"]').fill("A valid example question.");
    await expect(form.locator('button[type="submit"]')).toBeDisabled();
    await expect(form.locator("noscript p")).toContainText("Online sending is temporarily unavailable");
    await form.locator('input[name="email"]').press("Enter");
    await expect(page).toHaveURL(routePath("contact", "en"));
    await context.close();
  });

  test("retries unchanged content with one ID and starts a new ID after an edit", async ({ page }) => {
    const sent: Array<{ submissionId: string }> = [];
    await page.addInitScript(() => {
      let callback: ((token: string) => void) | undefined;
      window.turnstile = {
        render: (_container, options) => {
          callback = options.callback;
          callback("test-token-1");
          return "contact-widget";
        },
        reset: () => callback?.("test-token-next"),
        remove: () => undefined,
      };
    });
    await page.route("**/api/forms/contact", async (route) => {
      sent.push(route.request().postDataJSON() as { submissionId: string });
      const accepted = sent.length === 3;
      await route.fulfill({
        status: accepted ? 202 : 503,
        contentType: "application/json",
        body: JSON.stringify(accepted
          ? { ok: true, status: "pending", reference: "LP-TEST-RETRY" }
          : { ok: false, code: "service_unavailable" }),
      });
    });
    await page.goto(routePath("contact", "en"));
    const form = page.locator("[data-contact-question-form]");
    await form.locator('input[name="fullName"]').fill("Jovana Petrović");
    await form.locator('input[name="email"]').fill("jovana@example.com");
    await form.locator('textarea[name="message"]').fill("Please send service information.");
    const submit = form.locator('button[type="submit"]');
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(form.locator('[role="status"]')).toContainText("temporarily unavailable");
    await submit.click();
    await expect(form.locator('[role="status"]')).toContainText("temporarily unavailable");
    await form.locator('textarea[name="message"]').fill("Please send updated service information.");
    await submit.click();
    await expect(form.locator('[role="status"]')).toContainText("LP-TEST-RETRY");
    expect(sent).toHaveLength(3);
    expect(sent[0]?.submissionId).toBe(sent[1]?.submissionId);
    expect(sent[2]?.submissionId).not.toBe(sent[1]?.submissionId);
  });

  test("preserves the locked responsive topology without overflow", async ({ page }) => {
    await page.goto(routePath("contact", "ru"));

    for (const viewport of reviewViewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await assertNoHorizontalOverflow(page);
      await assertMinimumTargetSize(page);

      const columns = await page
        .locator("[data-contact-layout]")
        .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
      expect(columns).toBe(viewport.width >= 1024 ? 12 : 1);
    }
  });

  test("passes the automated WCAG 2.2 floor", async ({ page }) => {
    await page.goto(routePath("contact", "sr"));
    await settleDocumentMotion(page);
    const results = await new AxeBuilder({ page }).withTags(axeWcag22Tags).analyze();
    expect(results.violations).toEqual([]);
  });
});
