import { Operation, graphql } from '../Operation.js';

export default {
  group: 'viewCollection',
  document: graphql`
    query getRootCollection {
      browseRootCollection {
        data {
          attributes {
            current {
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
