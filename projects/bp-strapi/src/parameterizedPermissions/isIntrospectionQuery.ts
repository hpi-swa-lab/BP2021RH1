import { getIntrospectionQuery } from 'graphql';
import { OperationDefinitionNode } from 'graphql/language/ast';

const introspectionQuery = getIntrospectionQuery();

export const isIntrospectionQuery = (operation: OperationDefinitionNode) => {
  return operation.loc?.source.body === introspectionQuery;
};
