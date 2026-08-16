import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-hardcoded-ui-string";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-hardcoded-ui-string", rule, {
  valid: [
    // Expressions are allowed
    { code: '<span>{t("nav.menu")}</span>' },
    { code: "<span>{label}</span>" },
    // Numeric-only content
    { code: "<span>42</span>" },
    // Punctuation
    { code: "<span>(</span>" },
    // Empty alt for decorative images
    { code: '<img alt="" src="/photo.jpg" />' },
    // Explicit opt-out
    { code: "<span data-foundation-allow-string>Brand</span>" },
    // Whitespace-only text
    { code: "<span> </span>" },
  ],
  invalid: [
    {
      code: "<span>Submit</span>",
      errors: [
        {
          messageId: "hardcodedString",
          data: { value: "Submit" },
        },
      ],
    },
    {
      code: '<button aria-label="Close menu">{label}</button>',
      errors: [
        {
          messageId: "hardcodedString",
          data: { value: "Close menu" },
        },
      ],
    },
    {
      code: '<input placeholder="Enter email" />',
      errors: [
        {
          messageId: "hardcodedString",
          data: { value: "Enter email" },
        },
      ],
    },
    {
      code: '<img alt="Photo" src="/photo.jpg" />',
      errors: [
        {
          messageId: "hardcodedString",
          data: { value: "Photo" },
        },
      ],
    },
    {
      code: '<div title="Welcome to our site">{children}</div>',
      errors: [
        {
          messageId: "hardcodedString",
          data: { value: "Welcome to our site" },
        },
      ],
    },
  ],
});
