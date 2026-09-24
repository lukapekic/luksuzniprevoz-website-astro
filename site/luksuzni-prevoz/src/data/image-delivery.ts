/** Source-capped photographic delivery policy (DR-11); not a theme palette. */
import type { ImageMetadata } from "astro";
import layout from "../theme/versions/version-2/layout.json" with { type: "json" };

export type ImageRole = "hero" | "card" | "supporting";
const ladders: Record<ImageRole, readonly number[]> = {
  hero: [640, 960, 1280, 1600, 1920, 2560, 3200],
  card: [400, 640, 800, 960, 1200, 1600],
  supporting: [480, 768, 1024, 1280, 1600, 1920],
};
const ceilings: Record<ImageRole, number> = { hero: 3200, card: 1600, supporting: 1920 };

export function imageWidths(source: ImageMetadata, role: ImageRole): number[] {
  const cap = Math.min(source.width, ceilings[role]);
  return [...new Set([...ladders[role].filter((width) => width <= cap), cap])].sort((a, b) => a - b);
}

export const imageQuality = { heroAvif: 55, fleetAvif: 60, photoWebp: 85 } as const;

// HTML sizes cannot resolve CSS custom properties. Serialize the active layout
// source instead of copying theme values into individual components.
const gutter = layout.gutters.page;
const contentWidth = `min(calc(100vw - ${gutter} - ${gutter}), calc(${layout.container.main} - ${gutter} - ${gutter}))`;
const md = layout.breakpoints.md;
const lg = layout.breakpoints.lg;

export const imageSizes = {
  hero: "100vw",
  fullWidthCta: "100vw",
  serviceMosaic: {
    privateChauffeur: `(min-width: ${lg}) min(35vw, 26rem), (min-width: ${md}) min(50vw, 38rem), ${contentWidth}`,
    airportTransportation: `(min-width: ${lg}) min(30vw, 23rem), (min-width: ${md}) min(50vw, 38rem), ${contentWidth}`,
    stacked: `(min-width: ${lg}) min(35vw, 26rem), (min-width: ${md}) min(50vw, 38rem), ${contentWidth}`,
  },
  fleetCard: `(min-width: ${lg}) min(31vw, 24rem), (min-width: ${md}) min(56vw, 44rem), 88vw`,
  split: `(min-width: ${lg}) min(55vw, 40rem), ${contentWidth}`,
  supporting: `(min-width: ${lg}) min(55vw, 40rem), ${contentWidth}`,
} as const;
