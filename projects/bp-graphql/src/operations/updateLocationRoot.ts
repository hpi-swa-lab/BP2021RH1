import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateLocationHierarchy',
  isAllowed: always,
  document: graphql`
    mutation updateLocationRoot($tagId: ID!, $root: Boolean!) {
      updateLocationTag(documentId: $tagId, data: { root: $root }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
