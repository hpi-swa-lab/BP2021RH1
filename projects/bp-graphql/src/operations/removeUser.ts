import { Operation, graphql } from '../Operation.js';
import { checkOnOtherUsers } from '../isAllowedHelpers.js';

export default {
  section: 'user',
  needsParameters: ['on_other_users'],
  isAllowed: checkOnOtherUsers('id'),
  document: graphql`
    mutation removeUser($id: ID!) {
      removeUser(id: $id)
    }
  `,
} satisfies Operation;
