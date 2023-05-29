import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
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
        jwt
      }
    }
  `,
} satisfies Operation;
