import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation resetPassword($token: String!, $password: String!, $passwordConfirmation: String!) {
      resetPassword(
        code: $token
        password: $password
        passwordConfirmation: $passwordConfirmation
      ) {
        jwt
      }
    }
  `,
} satisfies Operation;
