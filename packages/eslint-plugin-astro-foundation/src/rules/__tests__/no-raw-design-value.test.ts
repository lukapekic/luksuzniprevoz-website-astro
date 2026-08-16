import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-raw-design-value";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-raw-design-value", rule, {
  valid: [
    // Semantic var references are allowed
    {
      code: '<div class="bg-[var(--surface-base)]">Content</div>',
    },
    // Named Tailwind tokens are allowed (not arbitrary)
    {
      code: '<div class="bg-red-500">Content</div>',
    },
    {
      code: '<div class="text-sm px-4">Content</div>',
    },
    // Style with semantic var
    {
      code: '<div style="color: var(--text-primary)">Content</div>',
    },
  ],
  invalid: [
    {
      code: '<div class="bg-[#fff]">Content</div>',
      errors: [
        {
          messageId: "rawDesignValue",
          data: { value: "bg-[#fff]" },
        },
      ],
    },
    {
      code: '<div class="text-[13px]">Content</div>',
      errors: [
        {
          messageId: "rawDesignValue",
          data: { value: "text-[13px]" },
        },
      ],
    },
    {
      code: '<div class="p-[20px]">Content</div>',
      errors: [
        {
          messageId: "rawDesignValue",
          data: { value: "p-[20px]" },
        },
      ],
    },
    {
      code: '<div style="color: #fff">Content</div>',
      errors: [
        {
          messageId: "rawDesignValue",
          data: { value: "#fff" },
        },
      ],
    },
    {
      code: '<div style="background: rgb(255,0,0)">Content</div>',
      errors: [
        {
          messageId: "rawDesignValue",
          data: { value: "rgb(" },
        },
      ],
    },
  ],
});
