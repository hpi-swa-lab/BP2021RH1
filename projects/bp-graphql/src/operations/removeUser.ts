import { Operation, graphql } from '../Operation.js';
import { always } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: [],
  isAllowed: always,
  document: graphql`
    mutation removeUser($id: ID!) {
      removeUser(id: $id)
    }
  `,
} satisfies Operation;
