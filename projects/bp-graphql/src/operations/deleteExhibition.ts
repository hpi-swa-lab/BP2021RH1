import { Operation, graphql } from '../Operation.js';

export default {
  document: graphql`
    mutation deleteExhibition($id: ID!) {
      deleteExhibition(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
