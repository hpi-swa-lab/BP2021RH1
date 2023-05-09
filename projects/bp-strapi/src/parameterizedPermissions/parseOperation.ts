import { Operation } from "bp-graphql/build";
import { parse } from "graphql/language";

export const parseOperation = (operation: Operation) => {
  const document = parse(operation.document.source);
  if (document.definitions.length !== 1) {
    throw new Error(
      `operation ${operation.document.name} contains more than one definition`
    );
  }
  const definition = document.definitions[0];
  if (definition.kind !== "OperationDefinition") {
    throw new Error(`operation ${operation.document.name} is not an operation`);
  }
  return definition;
};
