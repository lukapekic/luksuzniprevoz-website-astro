import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astroParser from "astro-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import compat from "eslint-plugin-compat";
// Loaded from source so the template enforces the rules without depending on a
// published build artifact (FND-META-05 dedup is tracked separately). ESLint 9
// loads this TS config via jiti, which resolves the extensionless .ts imports.
import foundationPlugin from "./packages/eslint-plugin-astro-foundation/src/index.ts";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/coverage/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "claude-summary/**",
      "**/*.variants.ts",
    ],
  },

  // Foundation plugin: 9 custom rules + built-in import restrictions (§18.2).
  // `plugins` registers the plugin globally; `rules` apply globally.
  foundationPlugin.configs.recommended,

  // FND-COMPAT-01/02: flag JS/DOM API usage that the browserslist targets don't
  // support. Reads the root `browserslist` field. Applied to .ts/.tsx/.astro
  // (browser-facing code); scripts/ and packages' node-only code is excluded.
  {
    files: ["**/*.{ts,tsx,astro,js,mjs}"],
    ignores: ["scripts/**", "packages/create-astro-foundation/**", "**/*.test.ts"],
    plugins: { compat },
    rules: {
      "compat/compat": "warn",
    },
  },

  // .astro files must be parsed by astro-eslint-parser so the JSX-AST rules
  // (no-manual-internal-url, no-hardcoded-ui-string, no-appearance-class-
  // passthrough, etc.) actually fire. Without this, *.astro is unlinted.
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser as unknown as tseslint.ParserConfig,
      parserOptions: {
        // astro-eslint-parser parses the template; the frontmatter script is
        // TypeScript (Astro frontmatter is TS), so delegate it to the TS parser.
        // Without this, `interface`/type annotations error as "reserved".
        parser: tsParser as unknown as tseslint.ParserConfig,
        ecmaFeatures: { jsx: true },
        extraFileExtensions: [".astro"],
      },
    },
  },

  // .ts/.tsx files: enable JSX so any TSX in the packages is covered too.
  {
    files: ["**/*.tsx"],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  // Repository automation runs in Node rather than the browser.
  {
    files: ["scripts/**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        Buffer: "readonly",
        console: "readonly",
        process: "readonly",
      },
    },
  },

  // Standalone wireframe behavior is browser-executed documentation support.
  {
    files: ["site/luksuzni-prevoz/src/docs/**/*.js"],
    languageOptions: {
      globals: {
        document: "readonly",
        getComputedStyle: "readonly",
        window: "readonly",
      },
    },
  },
);
