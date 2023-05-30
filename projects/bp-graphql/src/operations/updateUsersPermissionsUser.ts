import { Operation, graphql } from '../Operation.js';
import { checkOnOtherUsers } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: ['on_other_users'],
  isAllowed: checkOnOtherUsers('id'),
  document: graphql`
    mutation updateUsersPermissionsUser($id: ID!, $username: String, $email: String) {
      updateUsersPermissionsUser(id: $id, data: { username: $username, email: $email }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
