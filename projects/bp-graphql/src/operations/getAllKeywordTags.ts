import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    query getAllKeywordTags {
      keywordTags {
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
