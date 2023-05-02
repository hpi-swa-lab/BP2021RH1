import { Operation, graphql } from '../Operation.js';

export default {
  group: 'getAllCollections',
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
