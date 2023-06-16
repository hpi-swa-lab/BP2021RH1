import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateLocationRoot($tagId: ID!, $root: Boolean!) {
      updateLocationTag(id: $tagId, data: { root: $root }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
