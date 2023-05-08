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
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
