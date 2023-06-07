import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getUser($id: ID!) {
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
