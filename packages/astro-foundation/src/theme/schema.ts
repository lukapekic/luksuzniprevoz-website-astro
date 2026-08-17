import { z } from "zod";

// ── Current schema version supported by this package ──
export const CURRENT_SCHEMA_VERSION = 1;

// ── Manifest (FND-THEME-02) ──
export const ManifestSchema = z
  .object({
    name: z.string().min(1),
    themeVersion: z.string().min(1),
    schemaVersion: z
      .number()
      .refine(
        (v) => v === CURRENT_SCHEMA_VERSION,
        `schemaVersion must be ${CURRENT_SCHEMA_VERSION} (FND-THEME-03)`,
      ),
    description: z.string(),
    created: z.string(),
    // Optional lifecycle status (e.g. "development"). Additive — not required by
    // the v1 reference theme, accepted when present.
    status: z.string().optional(),
  })
  .strict();

export type Manifest = z.infer<typeof ManifestSchema>;

// ── Palette (FND-THEME-04) ──
// Two coexisting vocabularies, discriminated by value shape:
//   • Structured (v1): { modes: { light: {surface,text,focus,accent,border} } }
//     — requires a "light" mode. The reference site uses this.
//   • Flat: Record<string, string> of semantic color keys (background, accent,
//     textPrimary, success…). Dark-first sites with no mode switching use this.
// Discrimination is natural: a {modes:{…}} object has object values (rejected by
// the flat record<string,string>), and a flat palette has no "modes" key with an
// object value (rejected by the structured object schema). No manual refine needed.
export const SurfaceGroupSchema = z
  .object({
    base: z.string(),
    raised: z.string(),
    overlay: z.string(),
    sunken: z.string(),
  })
  .strict();

export const TextGroupSchema = z
  .object({
    primary: z.string(),
    secondary: z.string(),
    muted: z.string(),
    "on-accent": z.string(),
  })
  .strict();

export const FocusGroupSchema = z
  .object({
    ring: z.string(),
    "ring-offset": z.string(),
  })
  .strict();

export const AccentGroupSchema = z
  .object({
    primary: z.string(),
    secondary: z.string(),
    subtle: z.string(),
  })
  .strict();

export const BorderGroupSchema = z
  .object({
    default: z.string(),
    strong: z.string(),
  })
  .strict();

export const ModeColorsSchema = z
  .object({
    surface: SurfaceGroupSchema,
    text: TextGroupSchema,
    focus: FocusGroupSchema,
    accent: AccentGroupSchema,
    border: BorderGroupSchema,
  })
  .strict();

export type ModeColors = z.infer<typeof ModeColorsSchema>;

// Structured palette (v1) — modes dimension, "light" required.
export const PaletteSchema = z
  .object({
    modes: z
      .record(z.string(), ModeColorsSchema)
      .refine((modes) => "light" in modes, 'Palette must include a "light" mode'),
  })
  .strict();

export type Palette = z.infer<typeof PaletteSchema>;

// Flat palette — semantic color keys → hex strings. No modes, no "light" requirement.
export const FlatPaletteSchema = z.record(z.string(), z.string());
export type FlatPalette = z.infer<typeof FlatPaletteSchema>;

/** Type guard: true when the palette is the structured (modes) form. */
export function isStructuredPalette(p: Palette | FlatPalette): p is Palette {
  return typeof p === "object" && p !== null && "modes" in p;
}

// ── Typography ──
// Two field vocabularies, both accepted additively:
//   v1 names: fontFamilies / fontSizes / fontWeights / lineHeights (all optional now)
//   new names: families / sizes / weights / lineHeight / letterSpacing / measure / fallbacks
// At least one family source (fontFamilies or families) is required.
// weights / lineHeight accept numbers (e.g. 400, 1.05) as well as strings.
const StringOrNumberRecord = z.record(z.string(), z.union([z.string(), z.number()]));

export const TypographySchema = z
  .object({
    fontFamilies: z.record(z.string(), z.string()).optional(),
    fontSizes: z.record(z.string(), z.string()).optional(),
    fontWeights: StringOrNumberRecord.optional(),
    lineHeights: StringOrNumberRecord.optional(),
    families: z.record(z.string(), z.string()).optional(),
    fallbacks: z.record(z.string(), z.string()).optional(),
    sizes: z.record(z.string(), z.string()).optional(),
    weights: StringOrNumberRecord.optional(),
    lineHeight: StringOrNumberRecord.optional(),
    letterSpacing: z.record(z.string(), z.string()).optional(),
    measure: z.record(z.string(), z.string()).optional(),
  })
  .strict()
  .refine(
    (t) => Boolean(t.fontFamilies) || Boolean(t.families),
    "Typography must declare at least one family source (fontFamilies or families)",
  );

export type Typography = z.infer<typeof TypographySchema>;

// ── Spacing ──
// scale: numeric base scale (optional). section: semantic section spacing
// (compact/standard/feature). Both optional; additive and strict.
export const SpacingSchema = z
  .object({
    scale: z.record(z.string(), z.string()).optional(),
    section: z.record(z.string(), z.string()).optional(),
  })
  .strict();

export type Spacing = z.infer<typeof SpacingSchema>;

// ── Radii ──
// Two forms (union, discriminated by value shape):
//   • { values: { key: value } }  — v1 wrapped form
//   • { key: value, … }            — flat form (control/card/section)
export const RadiiSchema = z.union([
  z.object({ values: z.record(z.string(), z.string()) }).strict(),
  z.record(z.string(), z.string()),
]);

export type Radii = z.infer<typeof RadiiSchema>;

/** Type guard: true when radii uses the wrapped { values } form. */
export function isWrappedRadii(r: Radii): r is { values: Record<string, string> } {
  return typeof r === "object" && r !== null && "values" in r;
}

// ── Motion ──
// Two field vocabularies, both accepted:
//   v1 plural: durations / easings / reduced.durations
//   new singular: duration / easing
// The generator reads whichever is present (plural preferred). patterns
// (boolean flags) and reducedMotionRequired are new semantic fields. reduced is
// optional — when absent and reducedMotionRequired is true, the generator
// derives a zeroing override.
export const MotionSchema = z
  .object({
    durations: z.record(z.string(), z.string()).optional(),
    easings: z.record(z.string(), z.string()).optional(),
    duration: z.record(z.string(), z.string()).optional(),
    easing: z.record(z.string(), z.string()).optional(),
    reduced: z.object({ durations: z.record(z.string(), z.string()) }).optional(),
    patterns: z.record(z.string(), z.boolean()).optional(),
    reducedMotionRequired: z.boolean().optional(),
  })
  .strict();

export type Motion = z.infer<typeof MotionSchema>;

// ── Layout ──
// containers (v1) and container (singular, new) are both accepted; gutters is
// optional. grid (breakpoint column counts), columnGap, breakpoints, and
// approvedDesktopCompositions (a design constraint, not a CSS var) are additive.
export const LayoutSchema = z
  .object({
    containers: z.record(z.string(), z.string()).optional(),
    container: z.record(z.string(), z.string()).optional(),
    gutters: z.record(z.string(), z.string()).optional(),
    grid: z.record(z.string(), z.number()).optional(),
    columnGap: z.record(z.string(), z.string()).optional(),
    breakpoints: z.record(z.string(), z.string()).optional(),
    approvedDesktopCompositions: z.array(z.string()).optional(),
  })
  .strict();

export type Layout = z.infer<typeof LayoutSchema>;

// ── Full theme ──
export const ThemeTokensSchema = z
  .object({
    manifest: ManifestSchema,
    palette: z.union([PaletteSchema, FlatPaletteSchema]),
    typography: TypographySchema,
    spacing: SpacingSchema,
    radii: RadiiSchema,
    motion: MotionSchema,
    layout: LayoutSchema,
  })
  .readonly();

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
