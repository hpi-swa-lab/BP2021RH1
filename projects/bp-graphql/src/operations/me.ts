import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  group: 'login',
  isAllowed: always,
  document: graphql`
    query me {
      me {
        id
        username
        email
      }
    }
  `,
} satisfies Operation;
