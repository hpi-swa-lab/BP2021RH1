import { Operation, graphql } from "../Operation.js";

export default {
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
