import { Operation, graphql } from '../Operation.js';

export default {
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