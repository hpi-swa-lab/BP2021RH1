import { OperationName, operations } from 'bp-graphql';

export const isEssential = (operationName: OperationName) => {
  const operation = operations[operationName];
  if ('isEssential' in operation) {
    return operation.isEssential;
  } else {
    return false;
  }
};
