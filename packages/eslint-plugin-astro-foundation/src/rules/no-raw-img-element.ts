import type { Rule } from "eslint";
import type { JSXOpeningElement, JSXIdentifier } from "../ast-types";

const BANNED_ELEMENTS = new Set(["img", "picture"]);

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow raw <img> element outside primitives (FND-IMG-01, FND-IMG-08)",
      url: "foundation/12-responsive-images.md#fnd-img-08",
    },
    messages: {
      rawImg:
        "FND-IMG-08  Raw <{{element}}> element used outside primitives\n" +
        "  Fix: Use the <Image> primitive with a role prop.\n" +
        "  → foundation/12-responsive-images.md#fnd-img-08",
    },
    schema: [],
  },
  create(context) {
    const filename = context.filename || "";
    // Exempt files in foundation/ui/**
    if (filename.includes("foundation/ui")) {
      return {};
    }

    return {
      JSXOpeningElement(node: Rule.Node) {
        const elem = node as unknown as JSXOpeningElement;
        const nameNode = elem.name as JSXIdentifier | undefined;
        const name = nameNode?.type === "JSXIdentifier" ? nameNode.name : null;
        if (!name || !BANNED_ELEMENTS.has(name)) return;

        context.report({
          node,
          messageId: "rawImg",
          data: { element: name },
        });
      },
    };
  },
};

export default rule;
