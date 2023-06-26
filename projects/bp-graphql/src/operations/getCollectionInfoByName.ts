import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'collection',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getCollectionInfoByName($collectionName: String) {
      collections(filters: { name: { eq: $collectionName } }, publicationState: PREVIEW) {
        data {
          id
          attributes {
            name
            description
            child_collections(sort: "name:asc", publicationState: PREVIEW) {
              data {
                id
                attributes {
                  name
                  thumbnail
                  publishedAt
                }
              }
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
