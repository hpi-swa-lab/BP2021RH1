import { Operation, graphql } from '../Operation.js';
import { checkMultiplePictures } from '../isAllowedHelpers.js';

export default {
  group: 'createPictureSequence',
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
