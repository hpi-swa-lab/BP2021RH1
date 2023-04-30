import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation deleteFaceTag($id: ID!) {
      deleteFaceTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
