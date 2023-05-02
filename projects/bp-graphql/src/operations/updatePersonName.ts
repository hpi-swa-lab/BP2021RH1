import { Operation, graphql } from '../Operation.js';

export default {
  group: 'updateTagName',
  document: graphql`
    mutation updatePersonName($tagId: ID!, $name: String!) {
      updatePersonTag(id: $tagId, data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
