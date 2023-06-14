import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation createPictureSequence($pictures: [ID!]!) {
      createPictureSequence(data: { pictures: $pictures }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
