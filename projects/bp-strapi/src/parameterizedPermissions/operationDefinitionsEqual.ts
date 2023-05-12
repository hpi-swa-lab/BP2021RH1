import {
  ASTNode,
  OperationDefinitionNode,
  SelectionNode,
  SelectionSetNode,
  isNode,
} from "graphql/language/ast";

const objectsEqual = (a: unknown, b: unknown): boolean => {
  if (a instanceof Array && b instanceof Array) {
    return arraysEqual(a, b);
  }
  if (isNode(a) && isNode(b)) {
    return nodesEqual(a, b);
  }
  return a === b;
};

const ignoreTypenameFields = (selections: readonly SelectionNode[]) => {
  return selections.filter(
    (selection) =>
      !(selection.kind === "Field" && selection.name.value === "__typename")
  );
};

const selectionSetsEqual = (a: SelectionSetNode, b: SelectionSetNode) => {
  return arraysEqual(
    ignoreTypenameFields(a.selections),
    ignoreTypenameFields(b.selections)
  );
};

const nodesEqual = (a: ASTNode, b: ASTNode) => {
  if (a.kind === "SelectionSet" && b.kind === "SelectionSet") {
    return selectionSetsEqual(a, b);
  }
  if (a.kind !== b.kind) {
    return false;
  }
  return Object.entries(a).every(([key, aValue]) => {
    if (key === "loc") {
      // ignore location differences
      return true;
    }
    const bValue = b[key];
    return objectsEqual(aValue, bValue);
  });
};

const arraysEqual = (
  as: readonly ASTNode[],
  bs: readonly ASTNode[]
): boolean => {
  return (
    as.length === bs.length &&
    as.every((a, index) => objectsEqual(a, bs[index]))
  );
};

export const operationDefinitionsEqual = (
  a: OperationDefinitionNode,
  b: OperationDefinitionNode
) => nodesEqual(a, b);
