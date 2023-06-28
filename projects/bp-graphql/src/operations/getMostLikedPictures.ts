import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getMostLikedPictures($filters: PictureFiltersInput!, $pagination: PaginationArg!) {
      pictures(
        filters: { and: [{ likes: { gt: 0 } }, $filters] }
        pagination: $pagination
        sort: ["likes:desc"]
      ) {
        data {
          id
          attributes {
            is_text
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
                  pictures(sort: "picture_sequence_order:asc") {
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
