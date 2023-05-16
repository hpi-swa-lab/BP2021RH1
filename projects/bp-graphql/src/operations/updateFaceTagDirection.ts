import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation updateFaceTagDirection($faceTagId: ID!, $tag_direction: Int) {
      updateFaceTag(id: $faceTagId, data: { tag_direction: $tag_direction }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
