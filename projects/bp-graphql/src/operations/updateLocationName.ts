import { Operation, graphql } from '../Operation.js';

export default {
  group: 'updateTagName',
  document: graphql`
    mutation updateLocationName($tagId: ID!, $name: String!) {
      updateLocationTag(id: $tagId, data: { name: $name }) {
        data {
          id
        }
      }
    }
  `,
} satisfies Operation;
