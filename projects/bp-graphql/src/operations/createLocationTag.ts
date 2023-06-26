import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'createTag',
  isAllowed: always,
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
