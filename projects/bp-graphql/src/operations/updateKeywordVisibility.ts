import { Operation, graphql } from '../Operation.js';

export default {
  group: 'updateTagVisibility',
  document: graphql`
    mutation updateKeywordVisibility($tagId: ID!, $visible: Boolean!) {
      updateKeywordTag(id: $tagId, data: { visible: $visible }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
