import { Operation, graphql } from '../Operation.js';
import { checkMultiplePictures } from '../isAllowedHelpers.js';

export default {
  group: 'createPictureSequence',
  isAllowed: checkMultiplePictures('pictures'),
  document: graphql`
    mutation createPictureSequence($pictures: [ID!]!, $publishedAt: DateTime!) {
      createPictureSequence(data: { pictures: $pictures, publishedAt: $publishedAt }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
