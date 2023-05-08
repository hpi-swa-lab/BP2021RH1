import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: ['archive_tag'],
  isAllowed: checkPicture('id'),
  document: graphql`
    mutation unpublishPicture($id: ID!) {
      updatePicture(id: $id, data: { publishedAt: null }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
