import { Operation, graphql } from '../Operation.js';

export default {
  section: 'user',
  document: graphql`
    mutation createParameterizedPermission($userId: ID, $operationName: String!, $archiveId: ID) {
      createParameterizedPermission(
        data: {
          users_permissions_user: $userId
          operation_name: $operationName
          archive_tag: $archiveId
        }
      ) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
