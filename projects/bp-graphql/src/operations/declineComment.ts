import { Operation, graphql } from "../Operation.js";

export default {
  document: graphql`
    mutation declineComment($commentId: ID!) {
      deleteComment(id: $commentId) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
