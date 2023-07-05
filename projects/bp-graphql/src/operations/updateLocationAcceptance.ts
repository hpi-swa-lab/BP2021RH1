import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'locations',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation updateLocationAcceptance($tagId: ID!, $accepted: Boolean) {
      updateLocationTag(id: $tagId, data: { accepted: $accepted }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
