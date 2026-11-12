import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateLocationHierarchy',
  isAllowed: always,
  document: graphql`
    mutation updateLocationParent($tagID: ID!, $parentIDs: [ID!]) {
      updateLocationTag(documentId: $tagID, data: { parent_tags: $parentIDs }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
