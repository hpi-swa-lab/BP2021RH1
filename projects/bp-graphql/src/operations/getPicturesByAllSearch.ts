import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    query getPicturesByAllSearch(
      $pagination: PaginationArg!
      $searchTerms: [String]!
      $searchTimes: [[String]]!
      $textFilter: String!
    ) {
      findPicturesByAllSearch(
        pagination: $pagination
        searchTerms: $searchTerms
        searchTimes: $searchTimes
        textFilter: $textFilter
      ) {
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
  `,
} satisfies Operation;
