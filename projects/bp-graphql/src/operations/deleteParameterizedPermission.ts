import { Operation, graphql } from '../Operation.js';
import { archiveId, hasPermission, isIDLike, toId, validate } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: async ({ variables, permissions, db, user }) => {
    const permission = await db.loadPermission(toId(validate(variables.id, isIDLike, 'id')));
    if (permission?.users_permissions_user?.id === user?.id) {
      // don't let users take permissions from themselves
      return false;
    }
    return hasPermission(
      {
        ...permission,
        archive_tag: archiveId(permission),
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
