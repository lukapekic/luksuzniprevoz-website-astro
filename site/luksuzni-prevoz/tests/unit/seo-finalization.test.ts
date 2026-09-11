import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { serializeJsonLd } from "../../src/lib/serialize-jsonld.ts";
import { navigation, type NavChild, type NavHeaderItem } from "../../src/data/navigation.ts";
import { getRoute } from "../../src/data/routes.ts";
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

describe("static sitemap publication gates", () => {
  it("excludes noindex, in-review and scaffold documents from URLs and alternates", async () => {
    const { buildSitemap, escapeXml } = await import("../../src/lib/sitemap.ts");
    const xml = buildSitemap([
      { routeKey: "home", locale: "sr", status: "published" },
      { routeKey: "home", locale: "en", status: "published" },
      { routeKey: "home", locale: "ru", status: "in-review" },
      { routeKey: "booking", locale: "sr", status: "published" },
      { routeKey: "corporateTransportation", locale: "sr", status: "published" },
      { routeKey: "contact", locale: "en", status: "published", noindex: true },
    ]);
    assert.equal((xml.match(/<loc>/gu) ?? []).length, 2);
    assert.ok(xml.includes('hreflang="sr-Latn"'));
    assert.ok(xml.includes('hreflang="x-default"'));
    assert.equal(xml.includes('hreflang="ru"'), false);
    assert.equal(xml.includes("korporativni"), false);
    assert.equal(xml.includes("rezervacija"), false);
    assert.equal(escapeXml('a&<"'), "a&amp;&lt;&quot;");
  });
});
