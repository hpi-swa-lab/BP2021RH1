import { Operation, graphql } from '../Operation.js';

export default {
  group: 'editArchive',
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
