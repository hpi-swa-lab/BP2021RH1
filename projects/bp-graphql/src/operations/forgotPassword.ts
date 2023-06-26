import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    mutation forgotPassword($email: String!) {
      forgotPassword(email: $email) {
        ok
      }
    }
  `,
} satisfies Operation;
