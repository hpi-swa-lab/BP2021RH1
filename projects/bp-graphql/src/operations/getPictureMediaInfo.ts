import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'geo',
  isAllowed: always, // geo picks pictures across all archives
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
