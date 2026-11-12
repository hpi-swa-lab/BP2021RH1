import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagName',
  isAllowed: always,
  document: graphql`
    mutation updateKeywordName($tagId: ID!, $name: String!) {
      updateKeywordTag(documentId: $tagId, data: { name: $name }) {
        data {
          id
          attributes {
            name
          }
        }
      }
    }
  `,
} satisfies Operation;
