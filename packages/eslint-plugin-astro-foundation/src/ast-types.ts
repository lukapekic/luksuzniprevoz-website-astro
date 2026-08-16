/**
 * Minimal AST node types for ESLint rule implementations.
 *
 * ESLint rules receive untyped AST nodes because the visitor key
 * determines the node type at runtime based on the parser.
 * These interfaces document the shapes we actually access.
 */

/** eslint sourceCode object passed to visitors */
export interface SourceCode {
  lines: string[];
}

/** Base AST node with location info */
export interface AstNode {
  type: string;
  loc: { start: { line: number; column: number }; end: { line: number; column: number } };
  parent?: AstNode;
}

/** JSX identifier node (e.g. `div`, `Button`) */
export interface JSXIdentifier {
  type: "JSXIdentifier";
  name: string;
}

/** JSX member expression (e.g. `UI.Button`) */
export interface JSXMemberExpression {
  type: "JSXMemberExpression";
  name?: JSXIdentifier;
  object?: AstNode;
}

/** JSX namespaced name (e.g. `client:load`) */
export interface JSXNamespacedName {
  type: "JSXNamespacedName";
  namespace?: JSXIdentifier;
  name?: JSXIdentifier;
}

/** JSX attribute node */
export interface JSXAttribute {
  type: "JSXAttribute";
  name?: JSXIdentifier | JSXNamespacedName;
  value?: JSXAttributeValue | Literal;
}

/** JSX expression container (e.g. class={...}) */
export interface JSXExpressionContainer {
  type: "JSXExpressionContainer";
  expression: AstNode;
}

/** JSX text node */
export interface JSXText {
  type: "JSXText";
  value: string;
  parent?: AstNode;
}

/** JSX opening element node */
export interface JSXOpeningElement {
  type: "JSXOpeningElement";
  name?: JSXIdentifier | JSXMemberExpression;
  attributes?: Array<JSXAttribute | JSXSpreadAttribute>;
}

/** JSX element node */
export interface JSXElement {
  type: "JSXElement";
  openingElement?: JSXOpeningElement;
  parent?: AstNode;
}

/** JSX fragment node */
export interface JSXFragment {
  type: "JSXFragment";
  parent?: AstNode;
}

/** JSX spread attribute */
export interface JSXSpreadAttribute {
  type: "JSXSpreadAttribute";
}

/** Literal value node */
export interface Literal {
  type: "Literal";
  value?: string | number | boolean | null;
  raw?: string;
}

/** Template literal node */
export interface TemplateLiteral {
  type: "TemplateLiteral";
  quasis: Array<{ value: { raw: string; cooked: string } }>;
  expressions: AstNode[];
}

/** Binary expression node */
export interface BinaryExpression {
  type: "BinaryExpression";
  operator: string;
  left: AstNode;
  right: AstNode;
}

/** Property node (in object expressions) */
export interface Property {
  type: "Property";
  computed: boolean;
  key?: AstNode;
  value?: AstNode;
}

/** Object expression node */
export interface ObjectExpression {
  type: "ObjectExpression";
  properties: Property[];
}

/** Call expression node */
export interface CallExpression {
  type: "CallExpression";
  callee?: AstNode;
  arguments?: AstNode[];
}

/** Identifier node */
export interface Identifier {
  type: "Identifier";
  name: string;
}

/** Union type for JSX attribute values */
type JSXAttributeValue = JSXExpressionContainer | Literal;

/** Rule node type used in ESLint create() visitors */
export type RuleNode = AstNode & Record<string, unknown>;
