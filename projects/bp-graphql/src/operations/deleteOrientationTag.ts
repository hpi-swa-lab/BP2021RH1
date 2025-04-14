import { Operation, graphql } from '../Operation.js';
import { checkOrientationTag } from '../isAllowedHelpers.js';

export default {
  group: 'editOrientationTags',
  isAllowed: checkOrientationTag('id'),
  document: graphql`
    mutation deleteOrientationTag($id: ID!) {
      deleteOrientationTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
