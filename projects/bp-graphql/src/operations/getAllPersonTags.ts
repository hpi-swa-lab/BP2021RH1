import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getAllPersonTags {
      personTags {
        data {
          id
          attributes {
            name
            synonyms {
              name
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
