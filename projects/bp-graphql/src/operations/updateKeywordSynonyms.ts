import { Operation, graphql } from "../Operation.js";

export default {
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
