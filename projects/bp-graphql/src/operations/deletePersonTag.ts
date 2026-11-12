import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'deleteTag',
  isAllowed: always,
  document: graphql`
    mutation deletePersonTag($id: ID!) {
      deletePersonTag(documentId: $id) {
        documentId
      }
    }
  `,
} satisfies Operation;
