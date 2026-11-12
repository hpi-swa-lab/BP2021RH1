import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'deleteTag',
  isAllowed: always,
  document: graphql`
    mutation deleteKeywordTag($id: ID!) {
      deleteKeywordTag(documentId: $id) {
        documentId
      }
    }
  `,
} satisfies Operation;
