import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-appearance-class-passthrough";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-appearance-class-passthrough", rule, {
  valid: [
    // Layout classes on primitives are fine
    {
      code: '<Button class="mb-4">Click</Button>',
    },
    {
      code: '<Button class="w-full flex">Click</Button>',
    },
    {
      code: '<Button class="order-2">Click</Button>',
    },
    // Non-primitive components are not checked
    {
      code: '<div class="bg-red-500">Content</div>',
    },
    {
      code: '<CustomButton class="bg-red-500 text-white">Click</CustomButton>',
    },
    // Semantic token references (var()) are the encouraged pattern, not
    // appearance passthrough — even on primitives.
    {
      code: '<Section class="bg-[var(--surface-base)]">Content</Section>',
    },
    {
      code: '<Button class="rounded-[var(--radius-md)] text-[var(--text-primary)]">Click</Button>',
    },
    // Dynamic class passthrough is allowed (FND-UI-06: layout-only contract).
    {
      code: "<Button class={dynamicClass}>Click</Button>",
    },
    {
      code: "<Field class={className}>Label</Field>",
    },
  ],
  invalid: [
    {
      code: '<Button class="bg-red-500">Click</Button>',
      errors: [
        {
          messageId: "appearanceClass",
          data: { className: "bg-red-500" },
        },
      ],
    },
    {
      code: '<Button class="text-blue-600">Click</Button>',
      errors: [
        {
          messageId: "appearanceClass",
          data: { className: "text-blue-600" },
        },
      ],
    },
    {
      code: '<Link class="rounded-lg shadow-md">Go</Link>',
      errors: [
        {
          messageId: "appearanceClass",
          data: { className: "rounded-lg" },
        },
      ],
    },
    {
      code: '<Dialog class="font-bold">Content</Dialog>',
      errors: [
        {
          messageId: "appearanceClass",
          data: { className: "font-bold" },
        },
      ],
    },
  ],
});
