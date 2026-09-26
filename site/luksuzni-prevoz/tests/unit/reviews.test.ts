import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LocaleCode } from "@astro-foundation/core";
import { getReviewsSummary } from "../../src/data/reviews.ts";

describe("localized screenshot-backed reviews", () => {
  it("selects Serbian Latin, English and Russian without changing review facts", () => {
    const en = getReviewsSummary("en");
    assert.equal(en.reviews.length, 7);
    assert.equal(en.rating, 5);
    assert.equal(en.userRatingCount, 11);
    for (const locale of ["sr", "ru"] as const) {
      const summary = getReviewsSummary(locale);
      assert.equal(summary.googleMapsUrl, en.googleMapsUrl);
      assert.deepEqual(
        summary.reviews.map(({ id, authorName, rating, publishedAt }) => ({ id, authorName, rating, publishedAt })),
        en.reviews.map(({ id, authorName, rating, publishedAt }) => ({ id, authorName, rating, publishedAt })),
      );
      for (const [index, review] of summary.reviews.entries()) {
        assert.equal(review.languageCode, locale);
        assert.notEqual(review.text, en.reviews[index].text);
        assert.equal(review.relativeTime, null);
        assert.equal(review.originalText, null);
      }
    }
    assert.match(getReviewsSummary("sr").reviews[0].text, /Odlična usluga/);
    assert.match(getReviewsSummary("ru").reviews[0].text, /Отличный сервис/);
    assert.equal(/\p{Script=Cyrillic}/u.test(getReviewsSummary("sr").reviews[0].text), false);
  });

  it("rejects unsupported locales instead of silently returning English", () => {
    assert.throws(() => getReviewsSummary("de" as LocaleCode), /missing review content for de/);
  });
});
