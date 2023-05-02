import { Operation, graphql } from '../Operation.js';

export default {
  section: 'comment',
  document: graphql`
    mutation acceptComment($commentId: ID!, $currentTime: DateTime!) {
      updateComment(id: $commentId, data: { publishedAt: $currentTime }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
