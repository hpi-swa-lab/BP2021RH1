import { errors } from "@strapi/utils";
import { operations } from "bp-graphql";
import { OperationDefinitionNode } from "graphql/language/ast";
import { operationDefinitionsEqual } from "./operationDefinitionsEqual";
import { parseOperation } from "./parseOperation";

const { UnauthorizedError } = errors;

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
