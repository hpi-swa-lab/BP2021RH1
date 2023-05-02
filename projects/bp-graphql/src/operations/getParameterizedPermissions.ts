import { Operation, graphql } from '../Operation.js';

export default {
  section: 'user',
  document: graphql`
    query getParameterizedPermissions($userId: ID) {
      parameterizedPermissions(filters: { users_permissions_user: { id: { eq: $userId } } }) {
        data {
          id
          attributes {
            operation_name
          }
        }
      }
    }
  `,
} satisfies Operation;
