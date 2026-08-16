import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-physical-direction-property";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-physical-direction-property", rule, {
  valid: [
    // Logical properties are fine
    { code: '<div class="ms-4">Content</div>' },
    { code: '<div class="text-start">Content</div>' },
    { code: '<div style="margin-inline-start: 1rem">Content</div>' },
    { code: '<div class="mx-auto">Content</div>' },
    { code: '<div class="space-x-4">Content</div>' },
  ],
  invalid: [
    {
      code: '<div class="ml-4">Content</div>',
      output: '<div class="ms-4">Content</div>',
      errors: [
        {
          messageId: "physicalDirection",
          data: { value: "ml-4", replacement: "ms-4" },
        },
      ],
    },
    {
      code: '<div class="text-left">Content</div>',
      output: '<div class="text-start">Content</div>',
      errors: [
        {
          messageId: "physicalDirection",
          data: { value: "text-left", replacement: "text-start" },
        },
      ],
    },
    {
      code: '<div style="margin-left: 1rem">Content</div>',
      output: '<div style="margin-inline-start: 1rem">Content</div>',
      errors: [
        {
          messageId: "physicalDirection",
          data: { value: "margin-left:", replacement: "margin-inline-start:" },
        },
      ],
    },
    {
      code: '<div class="ml-auto">Content</div>',
      output: '<div class="ms-auto">Content</div>',
      errors: [
        {
          messageId: "physicalDirection",
          data: { value: "ml-auto", replacement: "ms-auto" },
        },
      ],
    },
    {
      code: '<div style="text-align: left">Content</div>',
      output: '<div style="text-align: start">Content</div>',
      errors: [
        {
          messageId: "physicalDirection",
          data: { value: "text-align: left", replacement: "text-align: start" },
        },
      ],
    },
  ],
});
