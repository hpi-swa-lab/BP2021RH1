import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
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
