import { Operation, graphql } from '../Operation.js';

export default {
  section: 'comment',
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
