import { Operation, graphql } from '../Operation.js';

export default {
  section: 'comment',
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
