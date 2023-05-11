import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getPictures(
      $filters: PictureFiltersInput!
      $pagination: PaginationArg!
      $sortBy: [String] = ["createdAt:desc"]
    ) {
      pictures(filters: $filters, pagination: $pagination, sort: $sortBy) {
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
