import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagVisibility',
  isAllowed: always,
  document: graphql`
    mutation updateKeywordVisibility($tagId: ID!, $visible: Boolean!) {
      updateKeywordTag(documentId: $tagId, data: { visible: $visible }) {
        data {
          id
          attributes {
            visible
          }
        }
      }
    }
  `,
} satisfies Operation;
