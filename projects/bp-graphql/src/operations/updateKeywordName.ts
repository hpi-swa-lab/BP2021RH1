import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation updateKeywordName($tagId: ID!, $name: String!) {
      updateKeywordTag(id: $tagId, data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
