import { Operation, graphql } from '../Operation.js';
import { checkComment } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: ['archive_tag'],
  isAllowed: checkComment('commentId'),
  document: graphql`
    mutation declineComment($commentId: ID!) {
      deleteComment(documentId: $commentId) {
        documentId
      }
    }
  `,
} satisfies Operation;
