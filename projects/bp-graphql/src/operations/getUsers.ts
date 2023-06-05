import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    query getUsers {
      usersPermissionsUsers {
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
