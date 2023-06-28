import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  group: 'editPicture',
  isAllowed: checkPicture('pictureId'),
  document: graphql`
    mutation updatePicture($pictureId: ID!, $data: JSON!) {
      updatePictureWithTagCleanup(id: $pictureId, data: $data)
    }
  `,
} satisfies Operation;
