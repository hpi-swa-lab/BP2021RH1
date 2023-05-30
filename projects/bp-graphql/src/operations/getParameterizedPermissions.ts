import { Operation, graphql } from '../Operation.js';
import { checkOnOtherUsers } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: ['on_other_users'],
  isAllowed: checkOnOtherUsers('userId'),
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
            on_other_users
          }
        }
      }
    }
  `,
} satisfies Operation;
