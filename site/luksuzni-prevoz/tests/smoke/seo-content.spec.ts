import { test, expect } from "@playwright/test";
import { config } from "../../foundation.config";
import { routes } from "../../src/data/routes";
import { contact } from "../../src/data/contact";
import { validateStructuredData } from "@astro-foundation/core/seo";
import { routePath, locales } from "../support/contracts";

const publicRoutes = routes.filter((route) => route.availability === "published");
for (const route of publicRoutes) {
  for (const locale of locales) {
    test(`${route.key}/${locale}: localized head and visible schema`, async ({ page }) => {
      const path = routePath(route.key, locale);
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.locator("main h1")).toHaveCount(1);
      const head = await page.locator("head").evaluate((element) => ({
        title: element.querySelector("title")?.textContent ?? "",
        description: element.querySelector('meta[name="description"]')?.getAttribute("content"),
        canonical: element.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        robots: element.querySelector('meta[name="robots"]')?.getAttribute("content"),
        alternates: Array.from(element.querySelectorAll('link[rel="alternate"][hreflang]')).map(
          (node) => ({ language: node.getAttribute("hreflang"), href: node.getAttribute("href") }),
        ),
        image: element.querySelector('meta[property="og:image"]')?.getAttribute("content"),
        schemas: Array.from(element.querySelectorAll('script[type="application/ld+json"]')).map(
          (node) => JSON.parse(node.textContent ?? "{}") as Record<string, unknown>,
        ),
      }));
      expect(head.title.split(" | ").length).toBeLessThanOrEqual(2);
      expect(head.title.match(new RegExp(config.brand, "giu"))).toHaveLength(1);
      expect(head.description?.length).toBeGreaterThan(60);
      expect(head.image).toMatch(/^https:\/\//u);
      const mainText = await page.locator("main").innerText();
      expect(mainText).not.toMatch(/\{[a-zA-Z][a-zA-Z0-9]*\}/u);
      if (route.noindex) {
        expect(head.robots).toContain("noindex");
        expect(head.canonical).toBeUndefined();
        expect(head.alternates).toHaveLength(0);
        expect(head.schemas).toHaveLength(0);
        return;
      }
      expect(head.robots ?? "").not.toContain("noindex");
      expect(head.canonical).toBe(`${config.site}${path}`);
      expect(head.alternates).toHaveLength(locales.length + 1);
      for (const configured of config.locales.locales) {
        expect(head.alternates).toContainEqual({
          language: configured.hreflang,
          href: `${config.site}${routePath(route.key, configured.code)}`,
        });
      }
      expect(head.alternates).toContainEqual({
        language: "x-default",
        href: `${config.site}${routePath(route.key, "sr")}`,
      });
      expect(
        head.schemas.filter((node) => node["@id"] === `${config.site}/#organization`),
      ).toHaveLength(1);
      for (const node of head.schemas) {
        expect(node["@context"]).toBe("https://schema.org");
        expect(validateStructuredData(node)).toMatchObject({ success: true });
        if (node["@type"] === "LocalBusiness") {
          expect(node).not.toHaveProperty("inLanguage");
          expect(node.telephone).toBe(contact.phone.value);
          expect(node.email).toBe(contact.email.value);
          expect(node.openingHoursSpecification).toEqual([expect.objectContaining({
            "@type": "OpeningHoursSpecification",
            opens: contact.officeHours.opens,
            closes: contact.officeHours.closes,
          })]);
        }
        if (node["@type"] === "FAQPage") {
          const faqs = node.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
          const visibleFaqs = await page.locator(".faq-list").textContent();
          for (const faq of faqs) {
            expect(visibleFaqs).toContain(faq.name);
            expect(visibleFaqs).toContain(faq.acceptedAnswer.text);
          }
        }
      }
    });
  }
}

test("published navigation and service enquiries resolve to built documents", async ({
  page,
  request,
}) => {
  const paths = new Set<string>();
  for (const locale of locales) {
    for (const route of publicRoutes) {
      await page.goto(routePath(route.key, locale));
      for (const href of await page
        .locator('a[href^="/"]')
        .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")!))) {
        paths.add(new URL(href, config.site).pathname);
      }
    }
  }
  for (const path of paths) expect((await request.get(path)).status(), path).toBe(200);
  for (const route of routes.filter((item) => item.availability !== "published")) {
    for (const locale of locales)
      expect((await request.get(routePath(route.key, locale))).status()).toBe(404);
  }
  const sitemap = await (await request.get("/sitemap-pages.xml")).text();
  expect(sitemap).toContain("<urlset");
  for (const route of routes) {
    for (const locale of locales) {
      const loc = `<loc>${config.site}${routePath(route.key, locale)}</loc>`;
      if (route.availability === "published" && !route.noindex) expect(sitemap).toContain(loc);
      else expect(sitemap).not.toContain(loc);
    }
  }
});
