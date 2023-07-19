import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    mutation changePassword(
      $currentPassword: String!
      $password: String!
      $passwordConfirmation: String!
    ) {
      changePassword(
        currentPassword: $currentPassword
        password: $password
        passwordConfirmation: $passwordConfirmation
      ) {
        user {
          id
        }
      }
    }
  `,
} satisfies Operation;
