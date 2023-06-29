import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  group: 'createPictureSequence',
  isAllowed: checkPicture('pictureId'),
  document: graphql`
    mutation updatePictureSequenceData(
      $pictureId: ID!
      $pictureSequence: ID
      $pictureSequenceOrder: Int
    ) {
      updatePictureWithTagCleanup(
        id: $pictureId
        data: { picture_sequence: $pictureSequence, picture_sequence_order: $pictureSequenceOrder }
      )
    }
  `,
} satisfies Operation;
