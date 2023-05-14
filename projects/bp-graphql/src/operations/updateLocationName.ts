import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateLocationName($tagId: ID!, $name: String!) {
      updateLocationTag(id: $tagId, data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
