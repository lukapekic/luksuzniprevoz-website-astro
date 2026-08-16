import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-dynamic-variant-class";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  },
});

ruleTester.run("no-dynamic-variant-class", rule, {
  valid: [
    // Static strings are fine
    {
      code: 'const variants = { primary: "bg-blue-500 text-white" };',
      filename: "button.variants.ts",
    },
    {
      code: 'const sizes = { sm: "text-sm px-3 py-1" };',
      filename: "button.variants.ts",
    },
    // Rule doesn't apply outside .variants.ts files
    {
      code: "const x = { primary: `bg-${color}-500` };",
      filename: "src/utils.ts",
    },
    {
      code: 'const y = { [key]: "text-sm" };',
      filename: "src/components.tsx",
    },
  ],
  invalid: [
    {
      code: "const variants = { primary: `bg-${color}-500` };",
      filename: "button.variants.ts",
      errors: [
        {
          messageId: "dynamicVariantClass",
          data: { value: "bg-${color}-500" },
        },
      ],
    },
    {
      code: 'const variants = { [key]: "text-sm" };',
      filename: "button.variants.ts",
      errors: [
        {
          messageId: "dynamicKey",
        },
      ],
    },
    {
      code: "const s = { [size]: `p-${val}-4` };",
      filename: "card.variants.ts",
      errors: [
        { messageId: "dynamicKey" },
        { messageId: "dynamicVariantClass", data: { value: "p-${val}-4" } },
      ],
    },
  ],
});
