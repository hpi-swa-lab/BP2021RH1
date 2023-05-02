import { Operation, graphql } from '../Operation.js';

export default {
  section: 'user',
  document: graphql`
    mutation createParameterizedPermission($userId: ID, $operationName: String!) {
      createParameterizedPermission(
        data: { users_permissions_user: $userId, operation_name: $operationName }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
