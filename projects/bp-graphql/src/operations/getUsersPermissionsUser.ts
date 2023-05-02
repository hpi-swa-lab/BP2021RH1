import { Operation, graphql } from '../Operation.js';

export default {
  section: 'user',
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
