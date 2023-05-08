import { Operation, graphql } from '../Operation.js';
import { checkComment } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: ['archive_tag'],
  isAllowed: checkComment('commentId'),
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
