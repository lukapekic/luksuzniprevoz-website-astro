import { describe, expect, it } from "vitest";
import { builtHtmlPath, parseRenderedHtml } from "../src/collect/rendered-page.ts";

describe("rendered HTML collection", () => {
  it("extracts standards-based SEO evidence", () => {
    const evidence = parseRenderedHtml(
      `<!doctype html><html lang="en"><head>
        <title>Service A | Site A</title>
        <meta name="description" content="A useful description.">
        <meta property="og:title" content="Service A">
        <link rel="canonical" href="https://site-a.example/en/service-a/">
        <link rel="alternate" hreflang="sr-Latn" href="https://site-a.example/usluga-a/">
        <script type="application/ld+json">{"@graph":[{"@type":"Service"}]}</script>
      </head><body>
        <h1 id="top">Service A</h1><a href="/en/contact/">Contact us</a>
        <img src="/car.webp" alt="Executive car" width="800" height="500" loading="lazy">
      </body></html>`,
      "https://site-a.example/en/service-a/",
      "https://site-a.example/en/service-a/",
      200,
    );

    expect(evidence.title).toBe("Service A | Site A");
    expect(evidence.canonical).toBe("https://site-a.example/en/service-a/");
    expect(evidence.hreflang["sr-Latn"]).toBe("https://site-a.example/usluga-a/");
    expect(evidence.headings).toEqual([{ level: 1, text: "Service A", id: "top" }]);
    expect(evidence.internalLinks[0]?.href).toBe("https://site-a.example/en/contact/");
    expect(evidence.images[0]?.width).toBe(800);
    expect(evidence.jsonLdTypes).toEqual(["Service"]);
    expect(evidence.textExcerpt).not.toContain("@graph");
  });

  it("maps route-map pathnames to Astro directory output", () => {
    expect(builtHtmlPath("/project/site", "/en/service-a/")).toBe(
      "/project/site/dist/en/service-a/index.html",
    );
    expect(builtHtmlPath("/project/site", "/")).toBe("/project/site/dist/index.html");
  });
});
