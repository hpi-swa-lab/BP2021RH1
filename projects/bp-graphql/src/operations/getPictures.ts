import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPictures(
      $filters: PictureFiltersInput!
      $pagination: PaginationArg!
      $sortBy: [String] = ["createdAt:desc"]
    ) {
      pictures: pictures_connection(filters: $filters, pagination: $pagination, sort: $sortBy) {
        data {
          id
          attributes {
            is_text
            comments: comments_connection(filters: { accepted: { eq: true } }) {
              data {
                id
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
            likes
            media {
              data {
                id
                attributes {
                  width
                  height
                  formats
                  url
                  updatedAt
                  provider
                }
              }
            }
            picture_sequence {
              data {
                id
                attributes {
                  pictures: pictures_connection(sort: "picture_sequence_order:asc") {
                    data {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
