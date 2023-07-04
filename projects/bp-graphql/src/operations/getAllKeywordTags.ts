import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'getAllTags',
  isAllowed: always,
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
