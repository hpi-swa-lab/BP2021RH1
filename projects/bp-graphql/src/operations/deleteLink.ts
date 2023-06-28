import { Operation, graphql } from '../Operation.js';
import { checkLink } from '../isAllowedHelpers.js';

export default {
  group: 'editArchive',
  isAllowed: checkLink('id'),
  document: graphql`
    mutation deleteLink($id: ID!) {
      deleteLink(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
