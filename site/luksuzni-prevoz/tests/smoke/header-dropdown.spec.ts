import { test, expect } from "@playwright/test";
import { defaultLocale, routePath } from "../support/contracts";

const homePath = routePath("home", defaultLocale);

/**
 * SiteHeader dropdown smoke — Step 5B.
 *
 * Covers the state/event contract repaired in Step 5B:
 *  - click/activation opens the root Services dropdown and nested branch flyouts;
 *  - only one top-level dropdown is open at a time (Services vs language);
 *  - Escape closes the innermost open level first, then the root, then the menu;
 *  - outside-click closes;
 *  - pointer (hover) opens via the non-bubbling region model and does NOT close
 *    while the pointer moves trigger → panel → child link (no dead gap), and
 *    switching branch rows swaps the flyout without leaving a stale panel.
 *
 * Runs against the production `astro build` output via `astro preview`
 * (see playwright.config.ts webServer). Home page SiteHeader uses idPrefix "hdr".
 */

const servicesTrigger = '[data-dropdown-trigger][aria-controls="hdr-services"]';
const servicesPanel = "#hdr-services";
const businessTrigger = '[data-dropdown-trigger][aria-controls="hdr-sub-businessTransportation"]';
const businessPanel = "#hdr-sub-businessTransportation";
const specialEventsTrigger = '[data-dropdown-trigger][aria-controls="hdr-sub-specialEvents"]';
const specialEventsPanel = "#hdr-sub-specialEvents";
const langTrigger = '[data-dropdown-trigger][aria-controls="hdr-lang-panel"]';
const langPanel = "#hdr-lang-panel";

const supportsHover = async (page: import("@playwright/test").Page): Promise<boolean> =>
  page.evaluate(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);

test.describe("SiteHeader dropdowns", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(homePath);
  });

  test("click Services opens the root dropdown and focuses the first item", async ({ page }) => {
    const trigger = page.locator(servicesTrigger).first();
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(servicesPanel)).not.toHaveAttribute("hidden");
    // First focusable item inside the panel received focus.
    await expect(page.locator(`${servicesPanel} a, ${servicesPanel} button`).first()).toBeFocused();
  });

  test("click a branch opens its nested flyout and keeps the root open", async ({ page }) => {
    await page.locator(servicesTrigger).first().click();
    const branch = page.locator(businessTrigger).first();
    await branch.click();
    await expect(branch).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(businessPanel)).not.toHaveAttribute("hidden");
    // Root Services remains open.
    await expect(page.locator(servicesTrigger).first()).toHaveAttribute("aria-expanded", "true");
  });

  test("only one top-level dropdown is open at a time (Services vs language)", async ({ page }) => {
    await page.locator(servicesTrigger).first().click();
    await expect(page.locator(servicesPanel)).not.toHaveAttribute("hidden");
    // Opening the language dropdown closes Services.
    await page.locator(langTrigger).first().click();
    await expect(page.locator(langPanel)).not.toHaveAttribute("hidden");
    await expect(page.locator(servicesTrigger).first()).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the innermost branch first, then the root", async ({ page }) => {
    await page.locator(servicesTrigger).first().click();
    await page.locator(businessTrigger).first().click();
    // First Escape closes the nested flyout, root stays open.
    await page.keyboard.press("Escape");
    await expect(page.locator(businessPanel)).toHaveAttribute("hidden");
    await expect(page.locator(servicesTrigger).first()).toHaveAttribute("aria-expanded", "true");
    // Second Escape closes the root.
    await page.keyboard.press("Escape");
    await expect(page.locator(servicesTrigger).first()).toHaveAttribute("aria-expanded", "false");
  });

  test("outside click closes an open dropdown", async ({ page }) => {
    await page.locator(servicesTrigger).first().click();
    await expect(page.locator(servicesPanel)).not.toHaveAttribute("hidden");
    // Click empty page area (main content).
    await page.locator("main").click({ position: { x: 5, y: 5 } });
    await expect(page.locator(servicesTrigger).first()).toHaveAttribute("aria-expanded", "false");
  });

  // Pointer-region hover behavior (hover-capable pointers only).
  test("hover opens Services and stays open while moving to a child link", async ({ page }) => {
    test.skip(!(await supportsHover(page)), "pointer not hover-capable in this environment");
    await page.locator(servicesTrigger).first().hover();
    await expect(page.locator(servicesPanel)).not.toHaveAttribute("hidden");
    // Move from the trigger into the panel onto a child link — must not close.
    const firstChild = page.locator(`${servicesPanel} a, ${servicesPanel} button`).first();
    await firstChild.hover();
    await expect(page.locator(servicesPanel)).not.toHaveAttribute("hidden");
  });

  test("hovering a branch opens its flyout; moving into the flyout keeps both open", async ({
    page,
  }) => {
    test.skip(!(await supportsHover(page)), "pointer not hover-capable in this environment");
    await page.locator(servicesTrigger).first().hover();
    await page.locator(businessTrigger).first().hover();
    await expect(page.locator(businessPanel)).not.toHaveAttribute("hidden");
    // Move into the nested flyout onto a child link — neither menu closes.
    const child = page.locator(`${businessPanel} a`).first();
    await child.hover();
    await expect(page.locator(servicesPanel)).not.toHaveAttribute("hidden");
    await expect(page.locator(businessPanel)).not.toHaveAttribute("hidden");
  });

  test("switching branch rows swaps the flyout with no stale panel", async ({ page }) => {
    test.skip(!(await supportsHover(page)), "pointer not hover-capable in this environment");
    await page.locator(servicesTrigger).first().hover();
    await page.locator(businessTrigger).first().hover();
    await expect(page.locator(businessPanel)).not.toHaveAttribute("hidden");
    // Move to the Special Events branch row — Business flyout closes, Special Events opens.
    await page.locator(specialEventsTrigger).first().hover();
    await expect(page.locator(specialEventsPanel)).not.toHaveAttribute("hidden");
    await expect(page.locator(businessPanel)).toHaveAttribute("hidden");
  });
});

/**
 * SiteHeader mobile visibility / state contract — Step 5C.
 *
 * Covers the Step 5C regressions:
 *  - desktop never visibly renders a mobile panel ([hidden] => display:none,
 *    not overridden) and keeps the bar wordmark visible;
 *  - at a real mobile viewport the bar BrandLockup is logo-only (wordmark
 *    sr-only), the desktop nav is hidden, the menu trigger is visible;
 *  - opening the menu reveals a full-viewport panel whose header is logo-only
 *    (mark-only wordmark) and which covers the viewport;
 *  - on /dev/ui only the forced-open instance's panel is visible; every other
 *    instance's mobile panel stays hidden (multi-instance isolation).
 *
 * The homepage SiteHeader uses idPrefix "hdr" (panel #hdr-mobile). The bar
 * wordmark lives in .site-header__row; the panel header wordmark is mark-only.
 * sr-only wordmarks render as a 1px clipped box, so wordmark visibility is
 * asserted via bounding-box width (<=1 == sr-only), not toBeVisible (a 1px box
 * is technically "visible" to Playwright).
 */
const barWordmark = ".site-header__row [data-brand-wordmark]";
const panelWordmark = ".mobile-panel__header [data-brand-wordmark]";

test.describe("SiteHeader mobile/visibility (Step 5C)", () => {
  test("desktop: mobile panel is hidden and the bar wordmark is visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(homePath);
    const panel = page.locator("#hdr-mobile");
    await expect(panel).not.toBeVisible();
    const box = await page.locator(barWordmark).first().boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(1);
  });

  test("mobile viewport: desktop nav hidden, bar wordmark logo-only, menu trigger visible", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(homePath);
    await expect(page.locator(".nav-desktop").first()).not.toBeVisible();
    const box = await page.locator(barWordmark).first().boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeLessThanOrEqual(1);
    await expect(page.locator("[data-menu-toggle]").first()).toBeVisible();
  });

  test("mobile viewport: opening the menu reveals a full-viewport, logo-only panel", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(homePath);
    await page.locator("[data-menu-toggle]").first().click();
    const panel = page.locator("#hdr-mobile");
    await expect(panel).not.toHaveAttribute("hidden");
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box).toBeTruthy();
    // Full-viewport: spans the viewport width and (near) full height.
    expect(box!.width).toBeGreaterThanOrEqual(385);
    expect(box!.height).toBeGreaterThan(700);
    // Panel header is mark-only (logo only).
    const pw = await page.locator(panelWordmark).first().boundingBox();
    expect(pw).toBeTruthy();
    expect(pw!.width).toBeLessThanOrEqual(1);
  });

  test("mobile viewport: closing the menu hides the panel again", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(homePath);
    await page.locator("[data-menu-toggle]").first().click();
    await expect(page.locator("#hdr-mobile")).toBeVisible();
    await page.locator("#hdr-mobile [data-menu-close]").click();
    await expect(page.locator("#hdr-mobile")).not.toBeVisible();
    await expect(page.locator("#hdr-mobile")).toHaveAttribute("hidden");
  });

  test("/dev/ui: only the forced-open instance panel is visible; all others hidden", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dev/ui/");
    // The forced-open preview panel.
    await expect(page.locator("#hdr-mo-mobile")).toBeVisible();
    // Every other SiteHeader instance's mobile panel stays hidden.
    const otherPanels = [
      "hdr-overlay-mobile",
      "hdr-solid-mobile",
      "hdr-dd-biz-mobile",
      "hdr-dd-evt-mobile",
      "hdr-dd-lang-mobile",
      "hdr-mc-mobile",
    ];
    for (const id of otherPanels) {
      await expect(page.locator(`#${id}`)).not.toBeVisible();
    }
  });
});
