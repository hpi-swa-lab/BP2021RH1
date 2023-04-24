import { Operation, graphql } from "../Operation.js";

export default {
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
