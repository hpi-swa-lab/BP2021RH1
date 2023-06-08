import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'viewCollection',
  isAllowed: always,
  document: graphql`
    query getPublishedCollectionInfoByName($collectionName: String) {
      collections(filters: { name: { eq: $collectionName } }) {
        data {
          id
          attributes {
            name
            description
            child_collections(sort: "name:asc") {
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
