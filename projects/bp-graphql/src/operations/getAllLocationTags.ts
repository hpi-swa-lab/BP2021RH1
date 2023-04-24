import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    query getAllLocationTags {
      locationTags {
        data {
          id
          attributes {
            name
            visible
            synonyms {
              name
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
