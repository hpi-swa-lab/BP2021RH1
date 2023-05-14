import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createLocationTag(
      $name: String!
      $parentIDs: [ID!]
      $childIDs: [ID!]
      $accepted: Boolean
      $root: Boolean
    ) {
      createLocationTag(
        data: {
          name: $name
          parent_tags: $parentIDs
          child_tags: $childIDs
          accepted: $accepted
          root: $root
        }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
