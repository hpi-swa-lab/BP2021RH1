import { Operation, graphql } from '../Operation.js';
import { archiveId, hasPermission } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: async ({ variables, permissions, db, user }) => {
    const permission = await db.loadPermission(variables.id);
    if (permission.users_permissions_user?.id === user.id) {
      // don't let users take permissions from themselves
      return false;
    }
    return hasPermission(
      {
        archiveId: archiveId(permission),
        operationName: permission.operation_name,
      },
      permissions
    );
  },
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
