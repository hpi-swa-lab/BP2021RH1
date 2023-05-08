import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'viewCollection',
  isAllowed: always,
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
