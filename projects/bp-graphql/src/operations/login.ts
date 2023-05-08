import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

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
