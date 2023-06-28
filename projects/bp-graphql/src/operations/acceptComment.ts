import { Operation, graphql } from '../Operation.js';
import { checkComment } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: ['archive_tag'],
  isAllowed: checkComment('commentId'),
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
