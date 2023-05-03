import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation deletePersonTag($id: ID!) {
      deletePersonTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
