import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateLocationHierarchy',
  isAllowed: always,
  document: graphql`
    mutation updateLocationChild($tagID: ID!, $childIDs: [ID!]) {
      updateLocationTag(documentId: $tagID, data: { child_tags: $childIDs }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
