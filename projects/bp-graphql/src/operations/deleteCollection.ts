import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation deleteCollection($collectionId: ID!) {
      deleteCollection(id: $collectionId) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
