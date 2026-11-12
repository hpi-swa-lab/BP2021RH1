import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagSynonyms',
  isAllowed: always,
  document: graphql`
    mutation updateLocationSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
      updateLocationTag(documentId: $tagId, data: { synonyms: $synonyms }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
