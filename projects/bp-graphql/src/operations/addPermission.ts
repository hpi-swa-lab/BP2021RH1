import { Operation, graphql } from '../Operation.js';
import { Maybe } from '../db-types.js';
import { hasPermission } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: async ({ variables, permissions }) =>
    hasPermission(
      variables as {
        operation_name?: Maybe<string>;
        archive_tag?: Maybe<string>;
        see_unpublished_collections?: Maybe<boolean>;
        on_other_users?: Maybe<boolean>;
      },
      permissions
    ),
  // names of parameter variables match the db names instead of camelCase
  // for easier code in PermissionsView
  document: graphql`
    mutation addPermission(
      $user_id: ID
      $operation_name: String
      $archive_tag: ID
      $see_unpublished_collections: Boolean
      $on_other_users: Boolean
    ) {
      addPermission(
        user_id: $user_id
        operation_name: $operation_name
        archive_tag: $archive_tag
        see_unpublished_collections: $see_unpublished_collections
        on_other_users: $on_other_users
      )
    }
  `,
} satisfies Operation;
