import type { Rule } from "eslint";
import type { JSXOpeningElement, JSXAttribute } from "../ast-types";

const PRIMITIVE_COMPONENTS = new Set([
  "Button",
  "Link",
  "Dialog",
  "Input",
  "Field",
  "Container",
  "Image",
  "NavList",
  "Breadcrumbs",
  "LanguageSwitcher",
  "SkipLink",
  "Section",
  "Disclosure",
  "Select",
  "Textarea",
  "Checkbox",
  "FormStatus",
  "Page",
]);

const COLOR_NAMES =
  "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";

const BANNED_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\bbg-/, label: "bg-*" },
  {
    pattern: new RegExp(`\\btext-(${COLOR_NAMES}|white|black|transparent|current)(?:-\\d+)?\\b`),
    label: "text-<color>",
  },
  { pattern: /\brounded-/, label: "rounded-*" },
  { pattern: /\bshadow-/, label: "shadow-*" },
  { pattern: /\bfont-/, label: "font-*" },
  {
    pattern: new RegExp(`\\bborder-(${COLOR_NAMES}|white|black|transparent)(?:-\\d+)?\\b`),
    label: "border-<color>",
  },
];

function findBannedClass(classStr: string): string | null {
  const tokens = classStr.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    // Semantic token references (e.g. bg-[var(--surface-base)],
    // rounded-[var(--radius-md)], text-[var(--text-primary)]) are the
    // *encouraged* pattern — a primitive consuming a theme token is not
    // "appearance passthrough". Only raw Tailwind appearance values are banned.
    if (/\[var\(/.test(token)) continue;
    for (const { pattern } of BANNED_PATTERNS) {
      if (pattern.test(token)) {
        return token;
      }
    }
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow appearance classes on primitive components (FND-UI-06)",
      url: "foundation/06-components.md#fnd-ui-06",
    },
    messages: {
      appearanceClass:
        'FND-UI-06  Appearance class passed to primitive: "{{className}}"\n' +
        "  Fix: Use variant prop, or move appearance to the theme tokens.\n" +
        "  → foundation/06-components.md#fnd-ui-06",
      dynamicClass:
        "FND-UI-06  Dynamic class expression passed to primitive: unverifiable content\n" +
        "  Fix: Use variant prop, or move appearance to the theme tokens.\n" +
        "  → foundation/06-components.md#fnd-ui-06",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node: Rule.Node) {
        const elem = node as unknown as JSXOpeningElement;
        const elemName =
          elem.name?.type === "JSXIdentifier"
            ? elem.name.name
            : elem.name?.type === "JSXMemberExpression"
              ? null
              : null;

        if (!elemName || !PRIMITIVE_COMPONENTS.has(elemName)) return;

        const attrs = elem.attributes as Array<JSXAttribute | { type: string }> | undefined;
        const classAttr = attrs?.find(
          (attr) => attr.type === "JSXAttribute" && (attr as JSXAttribute).name?.name === "class",
        ) as JSXAttribute | undefined;

        if (!classAttr || !classAttr.value) return;

        // FND-UI-06 explicitly allows class passthrough as layout-only: a
        // primitive accepts a `class` prop for layout (spacing/flex/width).
        // Dynamic class expressions (`class={className}`) implement that
        // contract and are allowed — the rule cannot statically verify their
        // content, and flagging them would make the template's own primitives
        // non-compliant with the contract they document. Only literal
        // appearance classes are statically enforceable.
        if (classAttr.value.type === "JSXExpressionContainer") {
          return;
        }

        if (classAttr.value.type === "Literal" && typeof classAttr.value.value === "string") {
          const banned = findBannedClass(classAttr.value.value);
          if (banned) {
            context.report({
              node: classAttr as unknown as Rule.Node,
              messageId: "appearanceClass",
              data: { className: banned },
            });
          }
        }
      },
    };
  },
};

export default rule;
