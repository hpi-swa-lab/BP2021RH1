import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagSynonyms',
  isAllowed: always,
  document: graphql`
    mutation updatePersonSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
      updatePersonTag(documentId: $tagId, data: { synonyms: $synonyms }) {
        data {
          id
          attributes {
            synonyms {
              name
            }
          }
        }
      }
    }
  `,
} satisfies Operation;
