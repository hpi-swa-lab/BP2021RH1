import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createFaceTag($pictureId: ID!, $personTagId: ID!, $x: Float, $y: Float) {
      createFaceTag(data: { picture: $pictureId, person_tag: $personTagId, x: $x, y: $y }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
