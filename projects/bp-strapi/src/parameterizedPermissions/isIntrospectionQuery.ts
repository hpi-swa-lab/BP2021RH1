import { OperationDefinitionNode } from 'graphql/language/ast';

// The query text of an introspection depends on the client's graphql version, so check its fields.
export const isIntrospectionQuery = (operation: OperationDefinitionNode) =>
  operation.operation === 'query' &&
  operation.selectionSet.selections.every(
    selection => selection.kind === 'Field' && selection.name.value.startsWith('__')
  );
