import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-raw-img-element";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-raw-img-element", rule, {
  valid: [
    // Inside foundation/ui/ is exempt
    {
      code: '<img src="/hero.jpg" alt="Hero" />',
      filename: "src/foundation/ui/Image.astro",
    },
    // Using the Image primitive is fine
    {
      code: '<Image role="content" src="/hero.jpg" alt="Hero" />',
      filename: "src/pages/index.astro",
    },
    // Non-banned elements
    {
      code: '<video src="/video.mp4" />',
      filename: "src/pages/index.astro",
    },
  ],
  invalid: [
    {
      code: '<img src="/photo.jpg" alt="Photo" />',
      filename: "src/pages/index.astro",
      errors: [
        {
          messageId: "rawImg",
          data: { element: "img" },
        },
      ],
    },
    {
      code: '<picture><source srcSet="/photo.webp" /><img src="/photo.jpg" alt="Photo" /></picture>',
      filename: "src/pages/index.astro",
      errors: [
        { messageId: "rawImg", data: { element: "picture" } },
        { messageId: "rawImg", data: { element: "img" } },
      ],
    },
    {
      code: '<img src="/icon.svg" alt="" />',
      filename: "src/components/Card.astro",
      errors: [
        {
          messageId: "rawImg",
          data: { element: "img" },
        },
      ],
    },
  ],
});
