import { Operation, graphql } from '../Operation.js';

export default {
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
