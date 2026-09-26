import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ImageMetadata } from "astro";
import { imageQuality, imageSizes, imageWidths } from "../../src/data/image-delivery.ts";

const source = (width: number) => ({ width, height: 800 }) as ImageMetadata;

describe("source-capped photographic delivery", () => {
  it("includes the native cap without inventing larger candidates", () => {
    assert.deepEqual(imageWidths(source(2400), "hero"), [640, 960, 1280, 1600, 1920, 2400]);
    assert.deepEqual(imageWidths(source(1200), "card"), [400, 640, 800, 960, 1200]);
    assert.deepEqual(imageWidths(source(5304), "supporting"), [480, 768, 1024, 1280, 1600, 1920]);
    assert.deepEqual(imageWidths(source(350), "card"), [350]);
  });

  it("keeps approved format quality and height-aware cover hints", () => {
    assert.deepEqual(imageQuality, { heroAvif: 55, fleetAvif: 60, photoWebp: 85 });
    assert.match(imageSizes.hero, /max\(100vw, 60rem\)/);
    assert.match(imageSizes.compactCta, /max\(100vw, 60rem\)/);
    assert.match(imageSizes.serviceMosaic.privateChauffeur, /min\(70vw, 55rem\)/);
  });
});
