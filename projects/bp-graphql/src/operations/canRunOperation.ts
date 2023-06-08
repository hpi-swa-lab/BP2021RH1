import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query canRunOperation(
      $operation: String!
      $variableSets: [JSON!]
      $withSomeVariables: Boolean
    ) {
      canRunOperation(
        operation: $operation
        variableSets: $variableSets
        withSomeVariables: $withSomeVariables
      )
    }
  `,
} satisfies Operation;
