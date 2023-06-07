import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation updateMe($username: String, $email: String) {
      updateMe(username: $username, email: $email)
    }
  `,
} satisfies Operation;
