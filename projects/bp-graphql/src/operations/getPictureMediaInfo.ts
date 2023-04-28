import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getPictureMediaInfo($pictureId: ID!) {
      picture(id: $pictureId) {
        data {
          id
          attributes {
            media {
              data {
                id
                attributes {
                  width
                  height
                  formats
                  url
                  updatedAt
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
