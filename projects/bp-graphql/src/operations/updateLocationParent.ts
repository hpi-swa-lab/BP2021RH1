import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateLocationParent($tagID: ID!, $parentIDs: [ID!]) {
      updateLocationTag(id: $tagID, data: { parent_tags: $parentIDs }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
