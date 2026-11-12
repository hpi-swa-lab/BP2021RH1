import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllCollections',
  isAllowed: always,
  document: graphql`
    query getAllCollections {
      collections: collections_connection {
        data {
          id
          attributes {
            name
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
  `,
} satisfies Operation;
