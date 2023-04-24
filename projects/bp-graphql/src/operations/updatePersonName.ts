import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation updatePersonName($tagId: ID!, $name: String!) {
      updatePersonTag(id: $tagId, data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
