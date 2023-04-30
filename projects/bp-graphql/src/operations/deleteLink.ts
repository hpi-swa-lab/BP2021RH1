import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation deleteLink($id: ID!) {
      deleteLink(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
