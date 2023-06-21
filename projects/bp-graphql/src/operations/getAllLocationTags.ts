import { Operation, graphql } from '../Operation.js';

export default {
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
            coordinates {
              latitude
              longitude
            }
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
