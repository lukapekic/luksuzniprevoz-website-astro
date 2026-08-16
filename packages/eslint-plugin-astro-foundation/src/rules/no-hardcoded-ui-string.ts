import type { Rule } from "eslint";
import type { JSXText, JSXAttribute, JSXElement, Literal, JSXIdentifier } from "../ast-types";

// Regex to check if text is numeric/punctuation/whitespace only (no letters)
const NO_LETTERS_RE = /^[^\p{L}]*$/u;

function isHardcodedString(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return !NO_LETTERS_RE.test(trimmed);
}

const TARGET_ATTRS = new Set(["title", "alt", "placeholder"]);

// Only these aria attributes hold a *translatable* UI string. Other aria
// attributes take boolean/token/ID-ref values (aria-expanded="false",
// aria-controls="mobile-nav", aria-live="polite", aria-labelledby="x") and
// must NOT be flagged as hardcoded UI strings.
const TRANSLATABLE_ARIA = new Set(["aria-label", "aria-roledescription", "aria-description"]);

function hasAllowStringAttr(
  attributes: Array<{ name?: JSXIdentifier; type: string } | { type: string }> | undefined,
): boolean {
  return attributes?.some(
    (attr): attr is { name?: JSXIdentifier; type: string } =>
      attr.type === "JSXAttribute" && attr.name?.name === "data-foundation-allow-string",
  );
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded UI strings (FND-ARCH-03, FND-I18N-08, FND-UI-07)",
      url: "foundation/03-architecture.md#fnd-arch-03",
    },
    messages: {
      hardcodedString:
        'FND-ARCH-03  Hardcoded UI string: "{{value}}"\n' +
        '  Fix: Use the UI strings dictionary: t("form.submit").\n' +
        "  → foundation/03-architecture.md#fnd-arch-03",
    },
    schema: [],
  },
  create(context) {
    return {
      // Check text nodes in JSX
      JSXText(node: Rule.Node) {
        const textNode = node as unknown as JSXText;
        const text = textNode.value;
        if (!isHardcodedString(text)) return;

        // Check if parent element has data-foundation-allow-string
        const parent = textNode.parent;
        if (parent?.type === "JSXElement") {
          const el = parent as unknown as JSXElement;
          if (
            hasAllowStringAttr(el.openingElement?.attributes as Array<{ type: string }> | undefined)
          )
            return;
        } else if (parent?.type === "JSXFragment") {
          return; // Skip fragment text
        }

        context.report({
          node,
          messageId: "hardcodedString",
          data: { value: text.trim() },
        });
      },

      // Check aria-*, title, alt, placeholder attributes
      JSXAttribute(node: Rule.Node) {
        const attr = node as unknown as JSXAttribute;
        const nameNode = attr.name;
        if (!nameNode || !attr.value) return;
        // Only plain identifiers are relevant. Skip namespaced attributes
        // (client:*, set:html, is:raw) — their `name` is a JSXNamespacedName
        // node, not a string, and they are not UI strings.
        if (nameNode.type !== "JSXIdentifier") return;
        const name = nameNode.name;
        if (typeof name !== "string") return;

        const isAria = TRANSLATABLE_ARIA.has(name);
        const isTarget = TARGET_ATTRS.has(name);

        if (!isAria && !isTarget) return;

        // Only check string literals
        if (
          attr.value.type === "Literal" &&
          typeof (attr.value as unknown as Literal).value === "string"
        ) {
          const val = (attr.value as unknown as Literal).value as string;
          // alt="" is valid for decorative images
          if (name === "alt" && val === "") return;
          // Empty aria attributes are unusual but let's skip them
          if (isAria && val === "") return;
          // Skip numeric/punctuation-only values
          if (!isHardcodedString(val)) return;

          context.report({
            node,
            messageId: "hardcodedString",
            data: { value: val },
          });
        }
      },
    };
  },
};

export default rule;
