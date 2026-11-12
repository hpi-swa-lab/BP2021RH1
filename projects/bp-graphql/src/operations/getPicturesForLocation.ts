import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPicturesForLocation($tagIDs: [ID!]) {
      locationTags: locationTags_connection(filters: { id: { in: $tagIDs } }) {
        data {
          id
          attributes {
            pictures: pictures_connection {
              data {
                id
              }
            }
            verified_pictures: verified_pictures_connection {
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
