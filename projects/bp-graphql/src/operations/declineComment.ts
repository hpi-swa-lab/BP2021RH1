import { Operation, graphql } from '../Operation.js';

export default {
  section: 'comment',
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
