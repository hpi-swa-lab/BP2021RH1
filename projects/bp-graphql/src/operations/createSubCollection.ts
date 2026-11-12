import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation createSubCollection($name: String!, $parentId: ID!) {
      createCollection(data: { name: $name, parent_collections: [$parentId] }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
