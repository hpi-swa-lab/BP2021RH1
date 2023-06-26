import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation updateUser($id: ID!, $username: String, $email: String) {
      updateUsersPermissionsUser(id: $id, data: { username: $username, email: $email }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
