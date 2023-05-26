import { Operation, graphql } from '../Operation.js';
import { checkPicture } from '../isAllowedHelpers.js';

export default {
  group: 'editFaceTags',
  isAllowed: checkPicture('pictureId'),
  document: graphql`
    mutation createFaceTag(
      $pictureId: ID!
      $personTagId: ID!
      $x: Float
      $y: Float
      $tag_direction: Int
    ) {
      createFaceTag(
        data: {
          picture: $pictureId
          person_tag: $personTagId
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
