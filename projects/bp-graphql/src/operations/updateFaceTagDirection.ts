import { Operation, graphql } from '../Operation.js';
import { checkFaceTag } from '../isAllowedHelpers.js';

export default {
  group: 'editFaceTags',
  isAllowed: checkFaceTag('faceTagId'),
  document: graphql`
    mutation updateFaceTagDirection($faceTagId: ID!, $tag_direction: Int) {
      updateFaceTag(id: $faceTagId, data: { tag_direction: $tag_direction }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
