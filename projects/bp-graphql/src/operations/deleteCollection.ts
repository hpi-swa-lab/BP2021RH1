import { Operation, graphql } from '../Operation.js';

export default {
  section: 'collection',
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
