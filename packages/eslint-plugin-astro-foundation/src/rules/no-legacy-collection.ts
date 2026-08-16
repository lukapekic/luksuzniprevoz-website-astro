import type { Rule } from "eslint";
import type { CallExpression, Property, Identifier, Literal } from "../ast-types";

const LEGACY_TYPES = new Set(["content", "data"]);

const rule: Rule.RuleModule = {
  meta: {
    type: "warn",
    docs: {
      description: "Disallow legacy collection definitions (FND-DATA-06)",
      url: "foundation/05-data-content.md#fnd-data-06",
    },
    messages: {
      legacyCollection:
        "FND-DATA-06  Legacy collection definition detected\n" +
        '  Fix: Use the Astro 5 Content Layer: defineCollection({ loader: glob({ pattern: "**/*.md", base: "..." }) }).\n' +
        "  → foundation/05-data-content.md#fnd-data-06",
    },
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node: Rule.Node) {
        const ce = node as unknown as CallExpression;
        // Check if calling defineCollection
        const callee = ce.callee;
        if (
          !callee ||
          callee.type !== "Identifier" ||
          (callee as unknown as Identifier).name !== "defineCollection"
        ) {
          return;
        }

        // Check the first argument
        const arg = ce.arguments?.[0];
        if (!arg || arg.type !== "ObjectExpression") return;

        // Look for type: "content" or type: "data"
        const objExpr = arg as unknown as { properties: Property[] };
        for (const prop of objExpr.properties) {
          if (prop.type !== "Property") continue;
          const key = prop.key as unknown as Identifier | undefined;
          if (!key || key.type !== "Identifier" || key.name !== "type") continue;
          const val = prop.value as unknown as Literal | undefined;
          if (!val || val.type !== "Literal") continue;
          if (LEGACY_TYPES.has(String(val.value))) {
            context.report({
              node: prop as unknown as Rule.Node,
              messageId: "legacyCollection",
            });
            return;
          }
        }
      },
    };
  },
};

export default rule;
