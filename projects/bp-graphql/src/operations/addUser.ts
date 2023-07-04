import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation addUser($username: String!, $email: String!) {
      addUser(username: $username, email: $email)
    }
  `,
} satisfies Operation;
