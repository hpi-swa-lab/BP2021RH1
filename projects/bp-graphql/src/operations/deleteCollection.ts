import { Operation, graphql } from '../Operation.js';

export default {
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
