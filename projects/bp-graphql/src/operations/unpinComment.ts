import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation unpinComment($commentId: ID!) {
      updateComment(id: $commentId, data: { pinned: false }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
