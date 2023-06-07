import { Operation, operations } from 'bp-graphql';

export const isEssential = (operationName: string) => {
  const operation = operations[operationName] as Operation;
  if ('isEssential' in operation) {
    return operation.isEssential;
  } else {
    return false;
  }
};
