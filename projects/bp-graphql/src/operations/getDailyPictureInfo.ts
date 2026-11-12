import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getDailyPictureInfo($pictureId: ID!) {
      picture(documentId: $pictureId) {
        data {
          id
          attributes {
            descriptions: descriptions_connection(sort: "createdAt:asc") {
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
            verified_time_range_tag {
              data {
                id
                attributes {
                  start
                  end
                  isEstimate
                }
              }
            }
            comments: comments_connection(filters: { accepted: { eq: true } }) {
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
                  restrictImageDownloading
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
