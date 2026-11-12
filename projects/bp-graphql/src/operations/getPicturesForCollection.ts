import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPicturesForCollection($collectionId: ID!) {
      collection(documentId: $collectionId) {
        data {
          id
          attributes {
            pictures: pictures_connection {
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
