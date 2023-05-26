import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getPictures',
  isAllowed: always,
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
  `,
} satisfies Operation;
