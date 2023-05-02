import { Operation, graphql } from '../Operation.js';

export default {
  group: 'updateTagSynonyms',
  document: graphql`
    mutation updateLocationSynonyms($tagId: ID!, $synonyms: [ComponentCommonSynonymsInput]!) {
      updateLocationTag(id: $tagId, data: { synonyms: $synonyms }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
