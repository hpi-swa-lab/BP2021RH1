import { Operation, graphql } from '../Operation.js';
import { checkComment } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: ['archive_tag'],
  isAllowed: checkComment('commentId'),
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
