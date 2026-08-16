import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-manual-internal-url";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-manual-internal-url", rule, {
  valid: [
    {
      code: '<a href="https://example.com">Link</a>',
      filename: "src/pages/index.astro",
    },
    {
      code: '<a href="mailto:test@example.com">Email</a>',
      filename: "src/pages/index.astro",
    },
    {
      code: '<a href="tel:+1234567890">Call</a>',
      filename: "src/pages/index.astro",
    },
    {
      code: '<a href="#section">Jump</a>',
      filename: "src/pages/index.astro",
    },
    {
      code: "<a href={urlVar}>Link</a>",
      filename: "src/pages/index.astro",
    },
    {
      code: '<a href={getPath("about", locale)}>Link</a>',
      filename: "src/pages/index.astro",
    },
    // i18n files are exempt
    {
      code: '<a href="/en/about/">Link</a>',
      filename: "src/foundation/i18n/utils.tsx",
    },
    {
      code: "<a href={`/${locale}/contact/`}>Link</a>",
      filename: "src/foundation/i18n/link-builder.tsx",
    },
  ],
  invalid: [
    {
      code: '<a href="/en/about/">Link</a>',
      filename: "src/pages/index.astro",
      errors: [
        {
          messageId: "manualInternalUrl",
          data: { url: "/en/about/" },
        },
      ],
    },
    {
      code: '<a href={"/" + locale + "/about/"}>Link</a>',
      filename: "src/pages/index.astro",
      errors: [
        {
          messageId: "manualInternalUrl",
        },
      ],
    },
    {
      code: "<a href={`/${locale}/contact/`}>Link</a>",
      filename: "src/pages/index.astro",
      errors: [
        {
          messageId: "manualInternalUrl",
        },
      ],
    },
    {
      code: '<form action="/en/submit"><button>Go</button></form>',
      filename: "src/pages/form.astro",
      errors: [
        {
          messageId: "manualInternalUrl",
          data: { url: "/en/submit" },
        },
      ],
    },
  ],
});
