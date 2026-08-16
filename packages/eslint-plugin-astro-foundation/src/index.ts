import type { ESLint } from "eslint";
import noManualInternalUrl from "./rules/no-manual-internal-url";
import noAppearanceClassPassthrough from "./rules/no-appearance-class-passthrough";
import noRawDesignValue from "./rules/no-raw-design-value";
import noPhysicalDirectionProperty from "./rules/no-physical-direction-property";
import noHardcodedUiString from "./rules/no-hardcoded-ui-string";
import noDynamicVariantClass from "./rules/no-dynamic-variant-class";
import noRawImgElement from "./rules/no-raw-img-element";
import noLegacyCollection from "./rules/no-legacy-collection";
import noClientDirectiveWithoutJustification from "./rules/no-client-directive-without-justification";

interface PluginWithConfigs extends ESLint.Plugin {
  configs: Record<string, ESLint.ConfigData>;
}

// Rules are declared first so the recommended config can reference the plugin
// object without a temporal-dead-zone self-reference (the previous shape read
// `plugin` inside its own object initializer, which threw on import).
const rules: ESLint.Plugin["rules"] = {
  "no-manual-internal-url": noManualInternalUrl,
  "no-appearance-class-passthrough": noAppearanceClassPassthrough,
  "no-raw-design-value": noRawDesignValue,
  "no-physical-direction-property": noPhysicalDirectionProperty,
  "no-hardcoded-ui-string": noHardcodedUiString,
  "no-dynamic-variant-class": noDynamicVariantClass,
  "no-raw-img-element": noRawImgElement,
  "no-legacy-collection": noLegacyCollection,
  "no-client-directive-without-justification": noClientDirectiveWithoutJustification,
};

const plugin: ESLint.Plugin = { rules };

const recommendedConfig: ESLint.ConfigData = {
  name: "astro-foundation/recommended",
  plugins: {
    "astro-foundation": plugin,
  },
  rules: {
    // Custom rules
    "astro-foundation/no-manual-internal-url": "error",
    "astro-foundation/no-appearance-class-passthrough": "error",
    "astro-foundation/no-raw-design-value": "error",
    "astro-foundation/no-physical-direction-property": "error",
    "astro-foundation/no-hardcoded-ui-string": "error",
    "astro-foundation/no-dynamic-variant-class": "error",
    "astro-foundation/no-raw-img-element": "error",
    "astro-foundation/no-legacy-collection": "warn",
    "astro-foundation/no-client-directive-without-justification": "error",

    // Built-in restrictions (§18.2)
    // 1. Deep package imports (FND-META-12)
    // 2. Global state managers (FND-ARCH-05)
    "no-restricted-imports": [
      "error",
      {
        // FND-ARCH-05: global state managers — banned by name.
        paths: [
          { name: "nanostores", message: "FND-ARCH-05: Islands communicate through typed DOM events (CustomEvent), not shared state. See §3.2." },
          { name: "zustand", message: "FND-ARCH-05: Islands communicate through typed DOM events (CustomEvent), not shared state. See §3.2." },
          { name: "jotai", message: "FND-ARCH-05: Islands communicate through typed DOM events (CustomEvent), not shared state. See §3.2." },
          { name: "valtio", message: "FND-ARCH-05: Islands communicate through typed DOM events (CustomEvent), not shared state. See §3.2." },
          { name: "@nanostores/react", message: "FND-ARCH-05: Islands communicate through typed DOM events (CustomEvent), not shared state. See §3.2." },
          { name: "@nanostores/preact", message: "FND-ARCH-05: Islands communicate through typed DOM events (CustomEvent), not shared state. See §3.2." },
        ],
        // FND-META-12: internal package modules must not be imported externally.
        patterns: [
          {
            group: ["@astro-foundation/core/i18n/internal/*", "@astro-foundation/core/**/internal/*"],
            message: "FND-META-12: Internal modules must not be imported from outside their package. See §2.3.",
          },
        ],
      },
    ],
    // 3. Interactive elements outside primitives (FND-UI-02)
    // Note: Full enforcement requires Astro template AST awareness;
    // this config placeholder documents the restriction.
    // 4. TSDoc on public exports (FND-CODE-12)
    // Requires eslint-plugin-jsdoc with require-jsdoc scoped to export entry files.
  },
};

const pluginWithConfigs: PluginWithConfigs = {
  ...plugin,
  configs: {
    recommended: recommendedConfig,
  },
};

export default pluginWithConfigs;
