import { Operation, graphql } from '../Operation.js';

export default {
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
