import { Operation, graphql } from '../Operation.js';

export default {
  group: 'getAllTags',
  document: graphql`
    query getAllKeywordTags {
      keywordTags {
        data {
          id
          attributes {
            name
            synonyms {
              name
            }
            visible
          }
        }
      }
    }
  `,
} satisfies Operation;
