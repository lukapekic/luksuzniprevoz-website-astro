import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateRedirects } from "@astro-foundation/core/seo";
import { serializeJsonLd } from "../../src/lib/serialize-jsonld.ts";
import { navigation, type NavChild, type NavHeaderItem } from "../../src/data/navigation.ts";
import { getRoute, routes } from "../../src/data/routes.ts";
import { getService } from "../../src/data/services.ts";

describe("SEO output safety and public destinations", () => {
  it("round-trips localized JSON without HTML parser delimiters", () => {
    const value = {
      text: '</script><script>alert("x")</script>&\u2028\u2029',
      sr: "Vozač",
      ru: "Водитель",
    };
    const serialized = serializeJsonLd(value);
    assert.equal(/[<>&\u2028\u2029]/u.test(serialized), false);
    assert.deepEqual(JSON.parse(serialized), value);
  });

  it("only exposes published navigation routes without discarding service relationships", () => {
    const visit = (item: NavHeaderItem | NavChild): void => {
      if ("routeKey" in item)
        assert.equal(getRoute(item.routeKey).availability, "published", item.routeKey);
      if ("children" in item) item.children.forEach(visit);
    };
    navigation.header.forEach(visit);
    navigation.footer.services.forEach(visit);
    navigation.footer.company.forEach(visit);
    assert.deepEqual(getService("businessTransportation").children, [
      "corporateTransportation",
      "delegationTransportation",
      "conferenceCongressTransportation",
    ]);
  });
});

describe("legacy URL migration", () => {
  it("maps equivalent WordPress URLs directly and leaves unmatched archives unmapped", () => {
    const redirects = generateRedirects(
      routes,
      "https://luksuzniprevoz.rs",
      ["sr", "en", "ru"],
      "sr",
    );
    const redirectMap = new Map(redirects.map((entry) => [entry.from, entry]));

    assert.equal(redirects.length, 33);
    assert.deepEqual(redirectMap.get("/cenovnik-usluga-prevoza/"), {
      from: "/cenovnik-usluga-prevoza/",
      to: "/cene/",
      status: 301,
    });
    assert.equal(
      redirectMap.get("/korporativni-prevoz-vasa-vrata-ka-profesionalizmu-i-luksuzu/")?.to,
      "/korporativni-prevoz/",
    );
    assert.equal(redirectMap.get("/en/chauffeur-service/")?.to, "/en/private-chauffeur/");
    assert.equal(redirectMap.has("/news/"), false);
    assert.equal(redirectMap.has("/o-nama/"), false);
    assert.equal(redirectMap.has("/en/about-us/"), false);
  });
});

describe("static sitemap publication gates", () => {
  it("includes published routes and excludes noindex and in-review documents", async () => {
    const { buildSitemap, escapeXml } = await import("../../src/lib/sitemap.ts");
    const xml = buildSitemap([
      { routeKey: "home", locale: "sr", status: "published" },
      { routeKey: "home", locale: "en", status: "published" },
      { routeKey: "home", locale: "ru", status: "in-review" },
      { routeKey: "booking", locale: "sr", status: "published" },
      { routeKey: "corporateTransportation", locale: "sr", status: "published" },
      { routeKey: "contact", locale: "en", status: "published", noindex: true },
    ]);
    assert.equal((xml.match(/<loc>/gu) ?? []).length, 3);
    assert.ok(xml.includes('hreflang="sr-Latn"'));
    assert.ok(xml.includes('hreflang="x-default"'));
    assert.equal(xml.includes('hreflang="ru"'), false);
    assert.equal(xml.includes("korporativni"), true);
    assert.equal(xml.includes("rezervacija"), false);
    assert.equal(escapeXml('a&<"'), "a&amp;&lt;&quot;");
  });
});
