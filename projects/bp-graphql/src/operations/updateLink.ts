import { Operation, graphql } from '../Operation.js';
import { checkLink } from '../isAllowedHelpers.js';

export default {
  group: 'editArchive',
  isAllowed: checkLink('id'),
  document: graphql`
    mutation updateLink($id: ID!, $data: LinkInput!) {
      updateLink(id: $id, data: $data) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
