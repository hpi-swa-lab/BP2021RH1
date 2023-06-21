import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getPicturesByAllSearch(
      $pagination: PaginationArg!
      $searchTerms: [String]!
      $searchTimes: [[String]]!
      $filterOutTexts: Boolean!
    ) {
      findPicturesByAllSearch(
        pagination: $pagination
        searchTerms: $searchTerms
        searchTimes: $searchTimes
        filterOutTexts: $filterOutTexts
      ) {
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
  `,
} satisfies Operation;
