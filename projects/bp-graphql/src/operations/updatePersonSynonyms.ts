import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagSynonyms',
  isAllowed: always,
  document: graphql`
    mutation updatePersonSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
      updatePersonTag(id: $tagId, data: { synonyms: $synonyms }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
