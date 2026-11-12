import { Operation, graphql } from '../Operation.js';
import { checkComment } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: ['archive_tag'],
  isAllowed: checkComment('commentId'),
  document: graphql`
    mutation acceptComment($commentId: ID!) {
      updateComment(documentId: $commentId, data: { accepted: true }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
