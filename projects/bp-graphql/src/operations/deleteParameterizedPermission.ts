import { Operation, graphql } from '../Operation.js';

export default {
  section: 'user',
  document: graphql`
    mutation deleteParameterizedPermission($id: ID!) {
      deleteParameterizedPermission(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
