import { Operation, graphql } from '../Operation.js';

export default {
  group: 'editFaceTags',
  document: graphql`
    mutation deleteFaceTag($id: ID!) {
      deleteFaceTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
