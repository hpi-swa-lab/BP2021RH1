import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  // TODO
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getUsersPermissionsUser($id: ID!) {
      usersPermissionsUser(id: $id) {
        data {
          id
          attributes {
            username
          }
        }
      }
    }
  `,
} satisfies Operation;
