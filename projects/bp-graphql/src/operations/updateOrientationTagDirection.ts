import { Operation, graphql } from '../Operation.js';
import { checkOrientationTag } from '../isAllowedHelpers.js';

export default {
  group: 'editOrientationTags',
  isAllowed: checkOrientationTag('id'),
  document: graphql`
    mutation updateOrientationTagDirection($id: ID!, $tag_direction: Int) {
      updateOrientationTag(id: $id, data: { tag_direction: $tag_direction }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
