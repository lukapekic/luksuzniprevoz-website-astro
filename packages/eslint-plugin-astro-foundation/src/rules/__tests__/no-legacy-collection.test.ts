import parser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import rule from "../no-legacy-collection";

const ruleTester = new RuleTester({
  languageOptions: {
    parser: parser,
    parserOptions: { ecmaVersion: 2022, sourceType: "module" },
  },
});

ruleTester.run("no-legacy-collection", rule, {
  valid: [
    // Astro 5 Content Layer style
    {
      code: `import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({ loader: glob({ pattern: '**/*.md', base: './content' }), schema: z.any() });`,
    },
    // defineCollection without type property
    {
      code: `import { defineCollection } from 'astro:content';
const coll = defineCollection({ loader: glob({ pattern: '**/*.md', base: './content' }) });`,
    },
    // Not defineCollection at all
    {
      code: 'const x = defineSomething({ type: "content" });',
    },
  ],
  invalid: [
    {
      code: `import { defineCollection, z } from 'astro:content';

const posts = defineCollection({ type: 'content', schema: z.any() });`,
      errors: [
        {
          messageId: "legacyCollection",
        },
      ],
    },
    {
      code: `import { defineCollection } from 'astro:content';

const data = defineCollection({ type: 'data' });`,
      errors: [
        {
          messageId: "legacyCollection",
        },
      ],
    },
  ],
});
