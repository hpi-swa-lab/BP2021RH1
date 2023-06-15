import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getPicturesForLocation($tagID: ID!) {
      locationTag(id: $tagID) {
        data {
          id
          attributes {
            pictures {
              data {
                id
              }
            }
            verified_pictures {
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
