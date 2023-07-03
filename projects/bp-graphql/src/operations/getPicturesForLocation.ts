import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPicturesForLocation($tagIDs: [ID!]) {
      locationTags(filters: { id: { in: $tagIDs } }) {
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
