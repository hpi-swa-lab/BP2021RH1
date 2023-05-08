import { Operation, graphql } from '../Operation.js';
import { Maybe } from '../db-types.js';
import { hasPermission } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: async ({ variables, permissions }) =>
    hasPermission(variables as { operationName: string; archiveId: Maybe<string> }, permissions),
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
