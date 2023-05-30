import { Operation, graphql } from '../Operation.js';
import { checkOnOtherUsers } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: ['on_other_users'],
  isAllowed: checkOnOtherUsers('id'),
  document: graphql`
    query getUsersPermissionsUser($id: ID!) {
      usersPermissionsUser(id: $id) {
        data {
          id
          attributes {
            username
            email
          }
        }
      }
    }
  `,
} satisfies Operation;
