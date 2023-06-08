import { Operation, graphql } from '../Operation.js';

export default {
  isEssential: true,
  document: graphql`
    mutation updateMe($username: String, $email: String) {
      updateMe(username: $username, email: $email)
    }
  `,
} satisfies Operation;
