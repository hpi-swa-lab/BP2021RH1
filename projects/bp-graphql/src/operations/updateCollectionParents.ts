import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation updateCollectionParents($collectionId: ID!, $parentCollectionIds: [ID]!) {
      updateCollection(id: $collectionId, data: { parent_collections: $parentCollectionIds }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
