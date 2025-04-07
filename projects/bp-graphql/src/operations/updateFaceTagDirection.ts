import { Operation, graphql } from '../Operation.js';
import { checkFaceTag } from '../isAllowedHelpers.js';

export default {
  group: 'editFaceTags',
  isAllowed: checkFaceTag('id'),
  document: graphql`
    mutation updateFaceTagDirection($id: ID!, $tag_direction: Int) {
      updateFaceTag(id: $id, data: { tag_direction: $tag_direction }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
