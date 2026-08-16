import type { Rule } from "eslint";
import type { JSXAttribute } from "../ast-types";

// Arbitrary Tailwind values: bg-[#fff], text-[13px], p-[20px]
const ARBITRARY_VALUE_RE = /[a-zA-Z-]+\[[^\]]+\]/g;

// Raw color values in style: #fff, #ffffff, rgb(), hsl(), hwb()
const RAW_COLOR_RE = /#[0-9a-fA-F]{3,8}\b|\brgb\s*\(|\bhsl\s*\(|\bhwb\s*\(/;

function findArbitraryClass(classStr: string): string | null {
  ARBITRARY_VALUE_RE.lastIndex = 0;
  const match = ARBITRARY_VALUE_RE.exec(classStr);
  return match ? match[0] : null;
}

function findRawColorInStyle(styleStr: string): string | null {
  RAW_COLOR_RE.lastIndex = 0;
  const match = RAW_COLOR_RE.exec(styleStr);
  return match ? match[0] : null;
}

function isSemanticVar(value: string): boolean {
  return /var\s*\(/.test(value);
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw design values (FND-THEME-09)",
      url: "foundation/08-theme.md#fnd-theme-09",
    },
    messages: {
      rawDesignValue:
        'FND-THEME-09  Raw design value used: "{{value}}"\n' +
        "  Fix: Use a semantic token from the theme, e.g., bg-[var(--surface-base)].\n" +
        "  → foundation/08-theme.md#fnd-theme-09",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node: Rule.Node) {
        const attr = node as unknown as JSXAttribute;
        const name = attr.name?.name;
        if (!name || !attr.value) return;

        // Check class attribute for arbitrary Tailwind values
        if (
          name === "class" &&
          attr.value.type === "Literal" &&
          typeof attr.value.value === "string"
        ) {
          const classStr = attr.value.value as string;
          if (isSemanticVar(classStr)) return;

          const arbitrary = findArbitraryClass(classStr);
          if (arbitrary) {
            context.report({
              node,
              messageId: "rawDesignValue",
              data: { value: arbitrary },
            });
          }
        }

        // Check style attribute for raw color values
        if (
          name === "style" &&
          attr.value.type === "Literal" &&
          typeof attr.value.value === "string"
        ) {
          const styleStr = attr.value.value as string;
          if (isSemanticVar(styleStr)) return;

          const rawColor = findRawColorInStyle(styleStr);
          if (rawColor) {
            context.report({
              node,
              messageId: "rawDesignValue",
              data: { value: rawColor },
            });
          }
        }
      },
    };
  },
};

export default rule;
