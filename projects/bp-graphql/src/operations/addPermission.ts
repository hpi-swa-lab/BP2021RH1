import { Operation, graphql } from '../Operation.js';
import { Maybe } from '../db-types.js';
import { hasPermission } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: async ({ variables, permissions }) =>
    hasPermission(variables as { operationName: string; archiveId: Maybe<string> }, permissions),
  // names of parameter variables match the db names instead of camelCase
  // for easier code in PermissionsView
  document: graphql`
    mutation addPermission(
      $userId: ID
      $operationName: String
      $archive_tag: ID
      $see_unpublished_collections: Boolean
    ) {
      addPermission(
        userId: $userId
        operationName: $operationName
        archive_tag: $archive_tag
        see_unpublished_collections: $see_unpublished_collections
      )
    }
  `,
} satisfies Operation;
