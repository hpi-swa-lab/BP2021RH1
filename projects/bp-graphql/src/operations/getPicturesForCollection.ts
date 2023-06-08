import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPicturesForCollection($collectionId: ID!) {
      collection(id: $collectionId) {
        data {
          id
          attributes {
            pictures {
              data {
                id
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
