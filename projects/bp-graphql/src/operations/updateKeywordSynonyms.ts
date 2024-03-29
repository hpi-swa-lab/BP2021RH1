import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagSynonyms',
  isAllowed: always,
  document: graphql`
    mutation updateKeywordSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
      updateKeywordTag(id: $tagId, data: { synonyms: $synonyms }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
