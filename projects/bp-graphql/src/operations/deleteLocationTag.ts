import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation deleteLocationTag($id: ID!) {
      deleteLocationTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
