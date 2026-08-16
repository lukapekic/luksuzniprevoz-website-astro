import type { Rule } from "eslint";
import type { Property, TemplateLiteral, Identifier } from "../ast-types";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow dynamic classes in variant definitions (FND-UI-05)",
      url: "foundation/06-components.md#fnd_ui-05",
    },
    messages: {
      dynamicVariantClass:
        'FND-UI-05  Dynamic class in variant definition: "{{value}}"\n' +
        "  Fix: Use a static string literal — Tailwind cannot scan interpolated values.\n" +
        "  → foundation/06-components.md#fnd-ui-05",
      dynamicKey:
        "FND-UI-05  Dynamic key in variant definition: computed property key\n" +
        "  Fix: Use a static string literal — Tailwind cannot scan interpolated values.\n" +
        "  → foundation/06-components.md#fnd-ui-05",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || "";
    // Only apply in *.variants.ts files
    if (!filename.endsWith(".variants.ts")) {
      return {};
    }

    return {
      Property(node: Rule.Node) {
        const prop = node as unknown as Property;

        // Check for dynamic (computed) keys: { [key]: "text-sm" }
        if (prop.computed && prop.key?.type !== "Literal") {
          context.report({
            node: prop.key || node,
            messageId: "dynamicKey",
          });
          // Don't return — also check the value below
        }

        // Check for template literal values: { primary: `bg-${color}-500` }
        if (prop.value?.type === "TemplateLiteral") {
          const tl = prop.value as unknown as TemplateLiteral;
          // Build the display value by interleaving quasis and expressions
          const parts: string[] = [];
          const { quasis, expressions } = tl;
          for (let i = 0; i < quasis.length; i++) {
            parts.push(quasis[i]!.value.raw);
            if (i < expressions.length) {
              const expr = expressions[i]!;
              if (expr.type === "Identifier") {
                parts.push(`\${${(expr as unknown as Identifier).name}}`);
              } else {
                parts.push("${...}");
              }
            }
          }
          context.report({
            node: prop.value as unknown as Rule.Node,
            messageId: "dynamicVariantClass",
            data: { value: parts.join("") },
          });
        }
      },
    };
  },
};

export default rule;
