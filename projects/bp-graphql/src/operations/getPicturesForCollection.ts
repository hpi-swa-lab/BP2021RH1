import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'setPicturesForCollection',
  isAllowed: always,
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
