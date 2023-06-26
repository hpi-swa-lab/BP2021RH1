import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'updateTagVisibility',
  isAllowed: always,
  document: graphql`
    mutation updateLocationVisibility($tagId: ID!, $visible: Boolean!) {
      updateLocationTag(id: $tagId, data: { visible: $visible }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
