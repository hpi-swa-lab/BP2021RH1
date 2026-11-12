import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getMostLikedPictures($filters: PictureFiltersInput!, $pagination: PaginationArg!) {
      pictures: pictures_connection(
        filters: { and: [{ likes: { gt: 0 } }, $filters] }
        pagination: $pagination
        sort: ["likes:desc"]
      ) {
        data {
          id
          attributes {
            is_text
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
