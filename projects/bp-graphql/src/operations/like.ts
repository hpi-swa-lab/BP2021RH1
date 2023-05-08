import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: ['archive_tag'],
  isAllowed: checkPicture('pictureId'),
  document: graphql`
    mutation like($pictureId: ID!, $dislike: Boolean) {
      doLike(pictureId: $pictureId, dislike: $dislike)
    }
  `,
} satisfies Operation;
