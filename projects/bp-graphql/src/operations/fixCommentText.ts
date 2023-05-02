import { Operation, graphql } from '../Operation.js';

export default {
  section: 'comment',
  document: graphql`
    mutation fixCommentText($commentId: ID!, $text: String!) {
      updateComment(id: $commentId, data: { text: $text }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
