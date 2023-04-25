import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation pinComment($commentId: ID!) {
      updateComment(id: $commentId, data: { pinned: true }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
