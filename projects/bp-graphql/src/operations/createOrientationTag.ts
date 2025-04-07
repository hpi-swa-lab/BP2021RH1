import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  group: 'editOrientationTags',
  isAllowed: checkPicture('pictureId'),
  document: graphql`
    mutation createOrientationTag(
      $pictureId: ID!
      $locationTagId: ID!
      $x: Float
      $y: Float
      $tag_direction: Int
    ) {
      createOrientationTag(
        data: {
          picture: $pictureId
          location_tag: $locationTagId
          x: $x
          y: $y
          tag_direction: $tag_direction
        }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
