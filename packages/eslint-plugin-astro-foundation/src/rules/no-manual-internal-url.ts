import type { Rule } from "eslint";
import type {
  JSXAttribute,
  JSXExpressionContainer,
  Literal,
  TemplateLiteral,
  BinaryExpression,
} from "../ast-types";

const ALLOWED_PROTOCOLS = /^(https?:|mailto:|tel:|#)/;

function isAllowedUrl(url: string): boolean {
  return ALLOWED_PROTOCOLS.test(url.trim());
}

function getStaticParts(node: Rule.Node): string | null {
  if (node.type === "Literal" && typeof (node as unknown as Literal).value === "string") {
    return (node as unknown as Literal).value as string;
  }
  if (node.type === "TemplateLiteral") {
    const tl = node as unknown as TemplateLiteral;
    return tl.quasis.map((q) => q.value.raw).join("");
  }
  if (node.type === "BinaryExpression" && (node as unknown as BinaryExpression).operator === "+") {
    const be = node as unknown as BinaryExpression;
    const left = getStaticParts(be.left as unknown as Rule.Node);
    const right = getStaticParts(be.right as unknown as Rule.Node);
    if (left !== null || right !== null) {
      return (left ?? "") + (right ?? "");
    }
  }
  return null;
}

function isSimpleExpression(node: Rule.Node): boolean {
  return (
    node.type === "Identifier" ||
    node.type === "MemberExpression" ||
    node.type === "CallExpression" ||
    node.type === "JSXEmptyExpression"
  );
}

function extractUrlFromValue(valueNode: Rule.Node): {
  url: string | null;
  isManualConstruction: boolean;
} {
  // String literal: href="..."
  if (valueNode.type === "Literal" && typeof (valueNode as unknown as Literal).value === "string") {
    return { url: (valueNode as unknown as Literal).value as string, isManualConstruction: false };
  }

  // JSX expression: href={...}
  if (valueNode.type === "JSXExpressionContainer") {
    const expr = (valueNode as unknown as JSXExpressionContainer).expression as Rule.Node;
    // Simple expressions (variables, function calls) are allowed
    if (isSimpleExpression(expr)) {
      return { url: null, isManualConstruction: false };
    }
    // Template literals and concatenation are manual URL construction
    if (expr.type === "TemplateLiteral" || expr.type === "BinaryExpression") {
      const staticParts = getStaticParts(expr);
      return { url: staticParts, isManualConstruction: true };
    }
  }

  return { url: null, isManualConstruction: false };
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow manual internal URL construction (FND-I18N-03)",
      url: "foundation/04-i18n-routing.md#fnd-i18n-03",
    },
    messages: {
      manualInternalUrl:
        'FND-I18N-03  Internal URL constructed manually: "{{url}}"\n' +
        '  Fix: getPath("about", locale), or use the <Link> primitive.\n' +
        "  → foundation/04-i18n-routing.md#fnd-i18n-03",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || "";
    // Exempt files in foundation/i18n/**
    if (filename.includes("foundation/i18n")) {
      return {};
    }

    return {
      JSXAttribute(node: Rule.Node) {
        const attr = node as unknown as JSXAttribute;
        const name = attr.name?.name;
        if (name !== "href" && name !== "action") return;
        if (!attr.value) return;

        const { url, isManualConstruction } = extractUrlFromValue(
          attr.value as unknown as Rule.Node,
        );

        if (isManualConstruction && url !== null) {
          context.report({
            node,
            messageId: "manualInternalUrl",
            data: { url: url.replace(/\n/g, "") },
          });
          return;
        }

        if (url !== null && !isManualConstruction) {
          if (!isAllowedUrl(url)) {
            context.report({
              node,
              messageId: "manualInternalUrl",
              data: { url },
            });
          }
        }
      },
    };
  },
};

export default rule;
