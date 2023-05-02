import { Operation, graphql } from '../Operation.js';

export default {
  group: 'editArchive',
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
