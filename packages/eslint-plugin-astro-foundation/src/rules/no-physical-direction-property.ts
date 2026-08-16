import type { Rule } from "eslint";
import type { JSXAttribute, Literal } from "../ast-types";

// Tailwind class mappings: physical → logical
const CLASS_MAPPINGS: [RegExp, string][] = [
  [/\bml-/, "ms-"],
  [/\bmr-/, "me-"],
  [/\bpl-/, "ps-"],
  [/\bpr-/, "pe-"],
  [/\bleft-(?!\[)/, "start-"], // left-0, left-auto, but not left-[...]
  [/\bright-(?!\[)/, "end-"],
  [/\btext-left\b/, "text-start"],
  [/\btext-right\b/, "text-end"],
];

// CSS property mappings: physical → logical
const STYLE_MAPPINGS: [RegExp, string][] = [
  [/margin-left\s*:/, "margin-inline-start:"],
  [/margin-right\s*:/, "margin-inline-end:"],
  [/padding-left\s*:/, "padding-inline-start:"],
  [/padding-right\s*:/, "padding-inline-end:"],
  [/text-align\s*:\s*left\b/, "text-align: start"],
  [/text-align\s*:\s*right\b/, "text-align: end"],
  [/float\s*:\s*left\b/, "float: inline-start"],
  [/float\s*:\s*right\b/, "float: inline-end"],
];

function findPhysicalClass(classStr: string): { match: string; replacement: string } | null {
  for (const [pattern, replacement] of CLASS_MAPPINGS) {
    pattern.lastIndex = 0;
    const m = pattern.exec(classStr);
    if (m) {
      const idx = m.index!;
      const fullClass = classStr.slice(idx).match(/^\S+/)?.[0];
      if (!fullClass) continue;
      const newClass = fullClass.replace(pattern, replacement);
      return { match: fullClass, replacement: newClass };
    }
  }
  return null;
}

function findPhysicalStyle(styleStr: string): { match: string; replacement: string } | null {
  for (const [pattern, replacement] of STYLE_MAPPINGS) {
    pattern.lastIndex = 0;
    const m = pattern.exec(styleStr);
    if (m) {
      return { match: m[0].trim(), replacement: replacement.trim() };
    }
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow physical direction properties (FND-I18N-13)",
      url: "foundation/04-i18n-routing.md#fnd-i18n-13",
    },
    messages: {
      physicalDirection:
        'FND-I18N-13  Physical direction property used: "{{value}}"\n' +
        '  Fix: Use logical property: "{{replacement}}".\n' +
        "  → foundation/04-i18n-routing.md#fnd-i18n-13",
    },
    schema: [],
    fixable: "code",
  },
  create(context) {
    return {
      JSXAttribute(node: Rule.Node) {
        const attr = node as unknown as JSXAttribute;
        const name = attr.name?.name;
        if (!name || !attr.value) return;

        if (
          name === "class" &&
          attr.value.type === "Literal" &&
          typeof attr.value.value === "string"
        ) {
          const lit = attr.value as unknown as Literal;
          const result = findPhysicalClass(lit.value as string);
          if (result) {
            context.report({
              node,
              messageId: "physicalDirection",
              data: { value: result.match, replacement: result.replacement },
              fix(fixer) {
                const valueNode = attr.value as unknown as Rule.Node;
                const raw = lit.raw;
                const newRaw = raw!.replace(result.match, result.replacement);
                return fixer.replaceText(valueNode, newRaw);
              },
            });
          }
        }

        if (
          name === "style" &&
          attr.value.type === "Literal" &&
          typeof attr.value.value === "string"
        ) {
          const lit = attr.value as unknown as Literal;
          const result = findPhysicalStyle(lit.value as string);
          if (result) {
            context.report({
              node,
              messageId: "physicalDirection",
              data: { value: result.match, replacement: result.replacement },
              fix(fixer) {
                const valueNode = attr.value as unknown as Rule.Node;
                const raw = lit.raw;
                const newRaw = raw!.replace(result.match, result.replacement);
                return fixer.replaceText(valueNode, newRaw);
              },
            });
          }
        }
      },
    };
  },
};

export default rule;
