/**
 * Unit tests for redirect generator (FND-ENV-10, FND-I18N-07).
 */
import { describe, it, expect } from "vitest";
import {
  generateRedirects,
  formatRedirectsJson,
  formatRedirectsCloudflare,
  formatRedirectsVercel,
} from "../../../src/seo/redirects.ts";

describe("generateRedirects", () => {
  it("generates no redirects when no previousSlugs", () => {
    const routes = [{ key: "home", slugs: { en: "", sr: "" } }];
    const result = generateRedirects(routes, "https://example.com", ["en", "sr"], "sr");
    expect(result).toHaveLength(0);
  });

  it("generates redirect for default locale", () => {
    const routes = [
      {
        key: "about",
        slugs: { sr: "o-nama", en: "about" },
        previousSlugs: { sr: ["o-nas"] },
      },
    ];
    const result = generateRedirects(routes, "https://example.com", ["sr", "en"], "sr");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      from: "/o-nas/",
      to: "/o-nama/",
      status: 301,
    });
  });

  it("generates redirect for non-default locale with prefix", () => {
    const routes = [
      {
        key: "about",
        slugs: { sr: "o-nama", en: "about" },
        previousSlugs: { en: ["about-us"] },
      },
    ];
    const result = generateRedirects(routes, "https://example.com", ["sr", "en"], "sr");
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      from: "/en/about-us/",
      to: "/en/about/",
      status: 301,
    });
  });

  it("generates multiple redirects for multiple previous slugs", () => {
    const routes = [
      {
        key: "services",
        slugs: { sr: "usluge", en: "services" },
        previousSlugs: { sr: ["sluzbe", "nase-usluge"] },
      },
    ];
    const result = generateRedirects(routes, "https://example.com", ["sr", "en"], "sr");
    expect(result).toHaveLength(2);
    expect(result[0]?.from).toBe("/sluzbe/");
    expect(result[1]?.from).toBe("/nase-usluge/");
  });

  it("generates redirects across multiple locales", () => {
    const routes = [
      {
        key: "about",
        slugs: { sr: "o-nama", en: "about" },
        previousSlugs: { sr: ["o-nas"], en: ["about-us"] },
      },
    ];
    const result = generateRedirects(routes, "https://example.com", ["sr", "en"], "sr");
    expect(result).toHaveLength(2);
  });

  it("skips locales that don't have current slugs", () => {
    const routes = [
      {
        key: "contact",
        slugs: { sr: "kontakt" }, // no en slug
        previousSlugs: { sr: ["kontaktirajte-nas"] },
      },
    ];
    const result = generateRedirects(routes, "https://example.com", ["sr", "en"], "sr");
    expect(result).toHaveLength(1);
  });
});

describe("formatRedirectsJson", () => {
  it("formats as JSON with redirects key", () => {
    const redirects = [{ from: "/old/", to: "/new/", status: 301 }];
    const result = JSON.parse(formatRedirectsJson(redirects));
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0]).toEqual({ from: "/old/", to: "/new/", status: 301 });
  });
});

describe("formatRedirectsCloudflare", () => {
  it("formats as Cloudflare _redirects", () => {
    const redirects = [{ from: "/old/", to: "/new/", status: 301 }];
    const result = formatRedirectsCloudflare(redirects);
    expect(result).toBe("/old/ /new/ 301");
  });

  it("formats multiple redirects", () => {
    const redirects = [
      { from: "/a/", to: "/b/", status: 301 },
      { from: "/c/", to: "/d/", status: 301 },
    ];
    const lines = formatRedirectsCloudflare(redirects).split("\n");
    expect(lines).toHaveLength(2);
  });
});

describe("formatRedirectsVercel", () => {
  it("formats as vercel.json with permanent flag", () => {
    const redirects = [{ from: "/old/", to: "/new/", status: 301 }];
    const result = JSON.parse(formatRedirectsVercel(redirects));
    expect(result.redirects).toHaveLength(1);
    expect(result.redirects[0]).toEqual({
      source: "/old/",
      destination: "/new/",
      permanent: true,
    });
  });

  it("sets permanent: false for 302", () => {
    const redirects = [{ from: "/old/", to: "/new/", status: 302 }];
    const result = JSON.parse(formatRedirectsVercel(redirects));
    expect(result.redirects[0]?.permanent).toBe(false);
  });
});
