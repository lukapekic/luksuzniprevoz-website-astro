import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const baseUrl = "http://127.0.0.1:4322/en/corporate-transportation/";
const widths = [320, 768, 1024, 1440, 1920];
const browser = await chromium.launch({ headless: true });
const findings = [];

for (const width of widths) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const response = await page.goto(baseUrl, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`${width}px page response was ${response?.status()}`);

  const heroImage = page.locator("img.service-hero__media");
  const workingDayImage = page.locator("img.open-split__image");
  await heroImage.waitFor({ state: "visible" });
  await workingDayImage.scrollIntoViewIfNeeded();
  await workingDayImage.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const hero = document.querySelector("img.service-hero__media");
    const workingDay = document.querySelector("img.open-split__image");
    return hero?.complete && hero.naturalWidth > 0 && workingDay?.complete && workingDay.naturalWidth > 0;
  });
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));

  const result = await page.evaluate((viewportWidth) => {
    const hero = document.querySelector("img.service-hero__media");
    const workingDay = document.querySelector("img.open-split__image");
    const split = document.querySelector(".open-split");
    const coordination = document.querySelector(".coordination-nodes");
    const audience = document.querySelector(".audience-rail");
    const itinerary = document.querySelector(".itinerary");
    const h1 = document.querySelector("h1");
    const body = document.body;
    const style = (element) => element ? getComputedStyle(element) : null;
    const columns = (element) => {
      const value = style(element)?.gridTemplateColumns ?? "";
      return value === "none" ? 1 : value.split(" ").filter(Boolean).length;
    };

    return {
      viewportWidth,
      overflow: Math.max(document.documentElement.scrollWidth, body.scrollWidth) - innerWidth,
      h1Count: document.querySelectorAll("h1").length,
      h2Count: document.querySelectorAll("main h2").length,
      faqCount: document.querySelectorAll(".faq-item").length,
      vehicleCount: document.querySelectorAll(".vehicle").length,
      standardGroupCount: document.querySelectorAll(".standards-grid article").length,
      itineraryCount: document.querySelectorAll(".itinerary li").length,
      hero: hero && {
        src: hero.currentSrc,
        loading: hero.getAttribute("loading"),
        fetchpriority: hero.getAttribute("fetchpriority"),
        naturalWidth: hero.naturalWidth,
        naturalHeight: hero.naturalHeight,
        objectPosition: style(hero)?.objectPosition,
      },
      workingDay: workingDay && {
        src: workingDay.currentSrc,
        loading: workingDay.getAttribute("loading"),
        naturalWidth: workingDay.naturalWidth,
        naturalHeight: workingDay.naturalHeight,
        objectPosition: style(workingDay)?.objectPosition,
      },
      splitColumns: columns(split),
      coordinationColumns: columns(coordination),
      audienceColumns: columns(audience),
      itineraryColumns: columns(itinerary),
      h1Font: style(h1)?.fontFamily,
      bodyFont: style(body)?.fontFamily,
      minimumTarget: Math.min(...[...document.querySelectorAll("a, button, summary")]
        .filter((element) => style(element)?.display !== "none" && element.getClientRects().length)
        .map((element) => Math.min(element.getBoundingClientRect().width, element.getBoundingClientRect().height))),
    };
  }, width);

  if (result.overflow > 1) throw new Error(`${width}px has ${result.overflow}px horizontal overflow`);
  if (result.h1Count !== 1 || result.h2Count !== 9) throw new Error(`${width}px heading count mismatch`);
  if (result.faqCount !== 9 || result.vehicleCount !== 3 || result.standardGroupCount !== 4 || result.itineraryCount !== 6) {
    throw new Error(`${width}px structural count mismatch: ${JSON.stringify(result)}`);
  }
  if (!result.hero?.src.includes("chauffeur-inside-grayedout") || result.hero.loading !== "eager" || result.hero.naturalWidth === 0) {
    throw new Error(`${width}px Corporate Hero contract failed`);
  }
  if (!result.workingDay?.src.includes("s-class-driving-forest-intheback") || result.workingDay.loading !== "lazy" || result.workingDay.naturalWidth === 0) {
    throw new Error(`${width}px Working Day image contract failed`);
  }
  if (width < 1024 && (result.splitColumns !== 1 || result.coordinationColumns !== 1 || result.itineraryColumns !== 1)) {
    throw new Error(`${width}px must keep split, coordination, and itinerary stacked`);
  }
  if (width >= 1024 && (result.splitColumns !== 12 || result.coordinationColumns !== 3 || result.itineraryColumns !== 6)) {
    throw new Error(`${width}px desktop topology mismatch`);
  }

  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  const serious = axe.violations.filter((violation) => ["critical", "serious"].includes(violation.impact ?? ""));
  if (serious.length) throw new Error(`${width}px serious Axe violations: ${serious.map((item) => item.id).join(", ")}`);

  await page.screenshot({ path: `/tmp/corporate-${width}.png`, fullPage: true, animations: "disabled" });
  findings.push({ ...result, axeViolations: axe.violations.length });
  await context.close();
}

for (const path of ["/korporativni-prevoz/", "/ru/korporativnyy-transfer/"]) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 900 } });
  const page = await context.newPage();
  const response = await page.goto(`http://127.0.0.1:4322${path}`, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`${path} response was ${response?.status()}`);
  const h1Count = await page.evaluate(() => document.querySelectorAll("h1").length);
  if (h1Count !== 1) {
    throw new Error(`${path} must render one H1 (found ${h1Count} at ${page.url()}: ${await page.title()})`);
  }
  await context.close();
}

await browser.close();
console.log(JSON.stringify(findings, null, 2));
