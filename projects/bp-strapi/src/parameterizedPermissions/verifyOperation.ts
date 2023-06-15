import { operations } from 'bp-graphql';
import { OperationDefinitionNode } from 'graphql/language/ast';
import { operationDefinitionsEqual } from './operationDefinitionsEqual';
import { parseOperation } from './parseOperation';

const parsedAllowedOperations = Object.fromEntries(
  Object.entries(operations).map(([name, operation]) => [name, parseOperation(operation)])
);

export const verifyOperation = (operation: OperationDefinitionNode) => {
  const name = operation.name?.value;
  if (!name) {
    return;
  }
  if (!(name in parsedAllowedOperations)) {
    return false;
  }
  const allowedOperation = parsedAllowedOperations[name];
  return operationDefinitionsEqual(allowedOperation, operation);
};
