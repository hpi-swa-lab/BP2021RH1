import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllCollections',
  isAllowed: always,
  document: graphql`
    query getAllCollections {
      collections(publicationState: PREVIEW) {
        data {
          id
          attributes {
            name
            parent_collections(publicationState: PREVIEW) {
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
