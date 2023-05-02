import { Operation, graphql } from '../Operation.js';

export default {
  group: 'getAllTags',
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
