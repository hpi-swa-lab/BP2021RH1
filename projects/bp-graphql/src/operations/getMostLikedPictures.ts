import { Operation, graphql } from '../Operation.js';

export default {
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
          }
        }
      }
    }
  `,
} satisfies Operation;