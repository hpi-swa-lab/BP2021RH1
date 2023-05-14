import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getLocationTagById($locationID: ID!) {
      locationTag(id: $locationID) {
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
