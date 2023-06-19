import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllTags',
  isAllowed: always,
  document: graphql`
    query getAllLocationTags {
      locationTags {
        data {
          id
          attributes {
            name
            visible
            root
            accepted
            synonyms {
              name
            }
            child_tags {
              data {
                id
                attributes {
                  name
                }
              }
            }
            parent_tags {
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
