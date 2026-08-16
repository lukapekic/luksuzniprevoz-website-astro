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
  })
  .strict();

export type Manifest = z.infer<typeof ManifestSchema>;

// ── Palette (FND-THEME-04: mode-dimensioned) ──
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

export const PaletteSchema = z
  .object({
    modes: z
      .record(z.string(), ModeColorsSchema)
      .refine((modes) => "light" in modes, 'Palette must include a "light" mode'),
  })
  .strict();

export type ModeColors = z.infer<typeof ModeColorsSchema>;
export type Palette = z.infer<typeof PaletteSchema>;

// ── Typography ──
export const TypographySchema = z
  .object({
    fontFamilies: z.record(z.string(), z.string()),
    fontSizes: z.record(z.string(), z.string()),
    fontWeights: z.record(z.string(), z.string()),
    lineHeights: z.record(z.string(), z.string()),
  })
  .strict();

export type Typography = z.infer<typeof TypographySchema>;

// ── Spacing ──
export const SpacingSchema = z
  .object({
    scale: z.record(z.string(), z.string()),
  })
  .strict();

export type Spacing = z.infer<typeof SpacingSchema>;

// ── Radii ──
export const RadiiSchema = z
  .object({
    values: z.record(z.string(), z.string()),
  })
  .strict();

export type Radii = z.infer<typeof RadiiSchema>;

// ── Motion ──
export const MotionSchema = z
  .object({
    durations: z.record(z.string(), z.string()),
    easings: z.record(z.string(), z.string()),
    reduced: z.object({
      durations: z.record(z.string(), z.string()),
    }),
  })
  .strict();

export type Motion = z.infer<typeof MotionSchema>;

// ── Layout ──
export const LayoutSchema = z
  .object({
    containers: z.record(z.string(), z.string()),
    gutters: z.record(z.string(), z.string()),
  })
  .strict();

export type Layout = z.infer<typeof LayoutSchema>;

// ── Full theme ──
export const ThemeTokensSchema = z
  .object({
    manifest: ManifestSchema,
    palette: PaletteSchema,
    typography: TypographySchema,
    spacing: SpacingSchema,
    radii: RadiiSchema,
    motion: MotionSchema,
    layout: LayoutSchema,
  })
  .strict();

export type ThemeTokens = z.infer<typeof ThemeTokensSchema>;
