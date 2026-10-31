import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllCollections',
  isAllowed: always,
  document: graphql`
    query getCollectionInfoById($collectionId: ID!) {
      collection(id: $collectionId) {
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
                  visible
                  pictures(pagination: { limit: 1 }) {
                    data {
                      id
                    }
                  }
                  child_collections(pagination: { limit: 1 }) {
                    data {
                      id
                    }
                  }
                  parent_collections {
                    data {
                      id
                      attributes {
                        name
                      }
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
