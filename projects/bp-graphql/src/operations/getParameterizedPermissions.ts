import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  // TODO
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getParameterizedPermissions($userId: ID) {
      parameterizedPermissions(filters: { users_permissions_user: { id: { eq: $userId } } }) {
        data {
          id
          attributes {
            operation_name
            archive_tag {
              data {
                id
              }
            }
            see_unpublished_collections
          }
        }
      }
    }
  `,
} satisfies Operation;
