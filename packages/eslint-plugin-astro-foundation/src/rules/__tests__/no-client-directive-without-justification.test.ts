import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-client-directive-without-justification";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module", ecmaFeatures: { jsx: true } },
  },
});

ruleTester.run("no-client-directive-without-justification", rule, {
  valid: [
    // Comment on preceding line
    {
      code: `// island: form submission handler
<Form client:load />`,
    },
    // Comment on same line before
    {
      code: `// island: interactive gallery
<Gallery client:visible />`,
    },
    // No client directive
    {
      code: "<Form />",
    },
  ],
  invalid: [
    {
      code: "<Form client:load />",
      errors: [
        {
          messageId: "noJustification",
        },
      ],
    },
    {
      code: "<Gallery client:visible />",
      errors: [
        {
          messageId: "noJustification",
        },
      ],
    },
    {
      code: "<><Carousel client:idle /><div>Content</div></>",
      errors: [
        {
          messageId: "noJustification",
        },
      ],
    },
  ],
});
