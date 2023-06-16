import { Operation, graphql } from '../Operation.js';

export default {
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
