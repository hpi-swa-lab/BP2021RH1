import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    mutation resetPassword($token: String!, $password: String!, $passwordConfirmation: String!) {
      resetPassword(
        code: $token
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
