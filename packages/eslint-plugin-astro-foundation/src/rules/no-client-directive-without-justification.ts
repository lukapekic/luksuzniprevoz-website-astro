import type { Rule } from "eslint";
import type { JSXAttribute, JSXOpeningElement, JSXNamespacedName, SourceCode } from "../ast-types";

function hasIslandComment(sourceCode: SourceCode, node: JSXOpeningElement): boolean {
  const lines = sourceCode.lines;
  const startLine = node.loc.start.line; // 1-indexed

  // Check same line (before the element)
  const sameLine = lines[startLine - 1];
  if (sameLine && /\/\/\s*island:/.test(sameLine.substring(0, node.loc.start.column))) {
    return true;
  }

  // Check preceding line
  if (startLine > 1) {
    const prevLine = lines[startLine - 2];
    if (prevLine && /\/\/\s*island:/.test(prevLine)) {
      return true;
    }
  }

  return false;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require justification for client:* directives (FND-ARCH-01)",
      url: "foundation/03-architecture.md#fnd-arch-01",
    },
    messages: {
      noJustification:
        "FND-ARCH-01  client:* directive without justification\n" +
        "  Fix: Add a comment explaining why this island is needed: // island: form submission handler\n" +
        "  → foundation/03-architecture.md#fnd-arch-01",
    },
    schema: [],
  },
  create(context) {
    return {
      JSXAttribute(node: Rule.Node) {
        const attr = node as unknown as JSXAttribute;
        const nameNode = attr.name;
        if (nameNode?.type !== "JSXNamespacedName") return;
        if ((nameNode as JSXNamespacedName).namespace?.name !== "client") return;

        // Check for island comment on the opening element
        const openingElement = attr.parent as unknown as JSXOpeningElement | undefined;
        if (openingElement?.type !== "JSXOpeningElement") return;

        if (hasIslandComment(context.sourceCode as unknown as SourceCode, openingElement)) return;

        context.report({
          node,
          messageId: "noJustification",
        });
      },
    };
  },
};

export default rule;
