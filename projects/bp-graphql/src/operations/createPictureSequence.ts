import { Operation, graphql } from '../Operation.js';
import { checkMultiplePictures } from '../isAllowedHelpers.js';

export default {
  section: 'picture',
  needsParameters: ['archive_tag'],
  isAllowed: checkMultiplePictures('pictures'),
  document: graphql`
    mutation createPictureSequence($pictures: [ID!]!) {
      createPictureSequence(data: { pictures: $pictures }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
