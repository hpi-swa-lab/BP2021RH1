import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllCollections',
  isAllowed: always,
  document: graphql`
    query getCollectionInfoById($collectionId: ID!) {
      collection(documentId: $collectionId) {
        data {
          id
          attributes {
            name
            description
            child_collections: child_collections_connection(sort: "name:asc") {
              data {
                id
                attributes {
                  name
                  visible
                  pictures: pictures_connection(pagination: { limit: 1 }) {
                    data {
                      id
                    }
                  }
                  child_collections: child_collections_connection(pagination: { limit: 1 }) {
                    data {
                      id
                    }
                  }
                  parent_collections: parent_collections_connection {
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
