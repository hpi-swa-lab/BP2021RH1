import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateLocationChild($tagID: ID!, $childIDs: [ID!]) {
      updateLocationTag(id: $tagID, data: { child_tags: $childIDs }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
