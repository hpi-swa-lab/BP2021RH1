import { Operation, graphql } from '../Operation.js';

export default {
  group: 'deleteTag',
  document: graphql`
    mutation deleteKeywordTag($id: ID!) {
      deleteKeywordTag(id: $id) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
