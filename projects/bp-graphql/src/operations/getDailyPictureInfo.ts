import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: ['archive_tag'],
  isAllowed: checkPicture('pictureId'),
  document: graphql`
    query getDailyPictureInfo($pictureId: ID!) {
      picture(id: $pictureId) {
        data {
          id
          attributes {
            descriptions(sort: "createdAt:asc") {
              data {
                id
                attributes {
                  text
                }
              }
            }
            time_range_tag {
              data {
                id
                attributes {
                  start
                  end
                  isEstimate
                }
              }
            }
            comments {
              data {
                id
              }
            }
            likes
            media {
              data {
                id
                attributes {
                  url
                  updatedAt
                  provider
                }
              }
            }
            archive_tag {
              data {
                id
                attributes {
                  name
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
