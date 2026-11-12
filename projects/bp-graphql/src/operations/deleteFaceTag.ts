import { Operation, graphql } from '../Operation.js';
import { checkFaceTag } from '../isAllowedHelpers.js';

export default {
  group: 'editFaceTags',
  isAllowed: checkFaceTag('id'),
  document: graphql`
    mutation deleteFaceTag($id: ID!) {
      deleteFaceTag(documentId: $id) {
        documentId
      }
    }
  `,
} satisfies Operation;
