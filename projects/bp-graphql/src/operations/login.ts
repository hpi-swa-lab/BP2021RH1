import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

// needs to be kept in sync with the actual variable name below
export const usernameVariableName = 'username';

export default {
  group: 'login',
  isAllowed: always,
  document: graphql`
    mutation login($username: String!, $password: String!) {
      login(input: { identifier: $username, password: $password }) {
        jwt
      }
    }
  `,
} satisfies Operation;
