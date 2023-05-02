import { Operation, graphql } from '../Operation.js';

export default {
  group: 'deleteTag',
  document: graphql`
    mutation deleteLocationTag($id: ID!) {
      deleteLocationTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
