import { errors } from "@strapi/utils";
import { Operation, operations } from "bp-graphql";
import { parse } from "graphql/language";
import { OperationDefinitionNode } from "graphql/language/ast";
import { operationDefinitionsEqual } from "./operationDefinitionsEqual";

const { UnauthorizedError } = errors;

const parseOperation = (operation: Operation) => {
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

const parsedAllowedOperations = Object.fromEntries(
  Object.entries(operations).map(([name, operation]) => [
    name,
    parseOperation(operation),
  ])
);

export const verifyOperation = (operation: OperationDefinitionNode) => {
  const name = operation.name.value;
  if (!(name in parsedAllowedOperations)) {
    throw new UnauthorizedError();
  }
  const allowedOperation = parsedAllowedOperations[name];
  if (!operationDefinitionsEqual(allowedOperation, operation)) {
    throw new UnauthorizedError();
  }
};
