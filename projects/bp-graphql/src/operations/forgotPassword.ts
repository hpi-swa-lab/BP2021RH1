import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation forgotPassword($email: String!) {
      forgotPassword(email: $email) {
        ok
      }
    }
  `,
} satisfies Operation;
