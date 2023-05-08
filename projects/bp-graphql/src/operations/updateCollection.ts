import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation updateCollection($collectionId: ID!, $data: CollectionInput!) {
      updateCollection(id: $collectionId, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
