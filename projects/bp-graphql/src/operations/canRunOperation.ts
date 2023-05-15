import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query canRunOperation($operation: String!, $variables: JSON!) {
      canRunOperation(operation: $operation, variables: $variables)
    }
  `,
} satisfies Operation;
