import { Operation } from "bp-graphql/build";
import { parse } from "graphql/language";

export const parseOperationSource = (source: string, name: string) => {
  const document = parse(source);
  if (document.definitions.length !== 1) {
    throw new Error(`operation ${name} contains more than one definition`);
  }
  const definition = document.definitions[0];
  if (definition.kind !== "OperationDefinition") {
    throw new Error(`operation ${name} is not an operation`);
  }
  return definition;
};

export const parseOperation = (operation: Operation) => {
  return parseOperationSource(
    operation.document.source,
    operation.document.name
  );
};
