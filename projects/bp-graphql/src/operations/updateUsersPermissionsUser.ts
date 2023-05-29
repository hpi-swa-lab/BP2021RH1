import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  // TODO
  needsParameters: [],
  isAllowed: always,
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
