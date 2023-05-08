import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  section: 'comment',
  needsParameters: ['archive_tag'],
  isAllowed: checkPicture('id'),
  document: graphql`
    mutation postComment(
      $id: ID!
      $author: String!
      $text: String!
      $date: DateTime!
      $parentCommentId: ID
    ) {
      createComment(
        data: {
          author: $author
          text: $text
          date: $date
          picture: $id
          publishedAt: null
          parentComment: $parentCommentId
        }
      ) {
        data {
          attributes {
            text
          }
        }
      }
    }
  `,
} satisfies Operation;
